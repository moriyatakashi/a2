const pageIdPattern = /^[A-Za-z0-9]{20}$/;

function renderInline(target, source, pages) {
  const tokens = /\[([^\]\n]+)\]\(wiki:([A-Za-z0-9]{20})\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`/g;
  let end = 0;
  for (const match of source.matchAll(tokens)) {
    target.append(source.slice(end, match.index));
    if (match[2]) {
      const link = document.createElement("a");
      link.href = "#wiki-" + match[2];
      link.textContent = pages.get(match[2])?.title ?? match[1];
      target.append(link);
    } else {
      const node = document.createElement(match[3] ? "strong" : "code");
      node.textContent = match[3] ?? match[4];
      target.append(node);
    }
    end = match.index + match[0].length;
  }
  target.append(source.slice(end));
}

function renderMarkdown(target, source, pages) {
  target.replaceChildren();
  for (const block of source.split(/\r?\n\s*\r?\n/)) {
    const lines = block.split(/\r?\n/);
    let list;
    let paragraph;
    for (const line of lines) {
      const heading = /^(#{1,6})\s+(.+)$/.exec(line);
      const bullet = /^[-*]\s+(.+)$/.exec(line);
      if (heading) {
        list = paragraph = undefined;
        const node = document.createElement("h" + Math.min(heading[1].length + 2, 6));
        renderInline(node, heading[2], pages);
        target.append(node);
      } else if (bullet) {
        paragraph = undefined;
        if (!list) {
          list = document.createElement("ul");
          target.append(list);
        }
        const item = document.createElement("li");
        renderInline(item, bullet[1], pages);
        list.append(item);
      } else {
        list = undefined;
        if (!paragraph) {
          paragraph = document.createElement("p");
          target.append(paragraph);
        } else {
          paragraph.append(document.createElement("br"));
        }
        renderInline(paragraph, line, pages);
      }
    }
  }
}

export function setupWiki(app) {
  const menu = document.querySelector("#wiki-button");
  const panel = document.querySelector("#wiki-panel");
  const intro = document.querySelector("#wiki-intro");
  const list = document.querySelector("#wiki-list");
  const status = document.querySelector("#wiki-status");
  const create = document.querySelector("#wiki-new");
  const article = document.querySelector("#wiki-article");
  const heading = document.querySelector("#wiki-page-title");
  const body = document.querySelector("#wiki-body");
  const edit = document.querySelector("#wiki-edit");
  const form = document.querySelector("#wiki-form");
  const fields = form.querySelector("fieldset");
  const titleInput = form.elements.namedItem("title");
  const readingInput = form.elements.namedItem("reading");
  const back = document.querySelector("#wiki-back");
  const bodyInput = form.elements.namedItem("body");
  const linkPicker = form.elements.namedItem("link");
  const insert = document.querySelector("#wiki-insert");
  const cancel = document.querySelector("#wiki-cancel");
  const pages = new Map();
  let user;
  let selected = "";
  let editing = "";
  let revision = 0;
  let ready = false;
  let saving = false;

  function wikiRoute() {
    const hash = location.hash;
    if (hash === "#wiki") return "";
    const id = hash.startsWith("#wiki-") ? hash.slice(6) : "";
    return pageIdPattern.test(id) ? id : null;
  }

  function close() {
    revision++;
    ready = saving = false;
    pages.clear();
    selected = editing = "";
    panel.hidden = form.hidden = article.hidden = back.hidden = intro.hidden = true;
    fields.disabled = false;
    create.disabled = true;
    menu.setAttribute("aria-expanded", "false");
    form.reset();
    list.replaceChildren();
    linkPicker.replaceChildren();
    heading.textContent = status.textContent = "";
    body.replaceChildren();
  }

  function groupOf(page) {
    const initial = (page.reading?.trim() || page.title.trim()).normalize("NFKC").normalize("NFD")[0] ?? "";
    if (/[A-Za-z]/.test(initial)) return "アルファベット";
    const kana = /[ァ-ヶ]/.test(initial) ? String.fromCharCode(initial.charCodeAt(0) - 0x60) : initial;
    const rows = {
      あ: "あぁいぃうぅえぇおぉ", か: "かきくけこゕゖ", さ: "さしすせそ",
      た: "たちつってと", な: "なにぬねの", は: "はひふへほ",
      ま: "まみむめも", や: "やゃゆゅよょ", ら: "らりるれろ", わ: "わゎゐゑをん",
    };
    return Object.entries(rows).find(([, members]) => kana && members.includes(kana))?.[0] ?? "その他";
  }

  function renderList() {
    list.replaceChildren();
    const buckets = new Map([..."あかさたなはまやらわ", "アルファベット", "その他"].map(key => [key, []]));
    const sorted = [...pages].sort((a, b) => (a[1].reading || a[1].title).localeCompare(b[1].reading || b[1].title, "ja"));
    for (const entry of sorted) buckets.get(groupOf(entry[1])).push(entry);
    for (const [group, entries] of buckets) {
      if (!entries.length) continue;
      const row = document.createElement("li");
      const section = document.createElement("details");
      const label = document.createElement("summary");
      label.textContent = group.length === 1 ? group + "行" : group;
      const terms = document.createElement("ul");
      for (const [id, page] of entries) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#wiki-" + id;
        link.textContent = page.title;
        item.append(link);
        terms.append(item);
      }
      section.append(label, terms);
      row.append(section);
      list.append(row);
    }
  }

  function showPage(id) {
    selected = id;
    editing = "";
    form.hidden = true;
    form.reset();
    linkPicker.replaceChildren();
    renderList();
    const page = pages.get(id);
    intro.hidden = Boolean(id);
    list.hidden = Boolean(page);
    back.hidden = !id;
    article.hidden = !page;
    heading.textContent = page?.title ?? "";
    body.replaceChildren();
    if (page) renderMarkdown(body, page.body, pages);
    status.textContent = id && !page ? "用語が見つかりません。" : pages.size ? "" : "用語はまだありません。";
  }

  async function firestore() {
    return import("https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js");
  }

  async function syncRoute() {
    const id = wikiRoute();
    if (!user || id === null) {
      close();
      return;
    }
    panel.hidden = false;
    menu.setAttribute("aria-expanded", "true");
    if (ready) {
      showPage(id);
      return;
    }
    const request = ++revision;
    status.textContent = "Wiki を読み込み中…";
    try {
      const { collection, getDocsFromServer, getFirestore } = await firestore();
      if (request !== revision) return;
      const result = await getDocsFromServer(collection(getFirestore(app), "a2Wiki"));
      if (request !== revision) return;
      for (const snapshot of result.docs) {
        const page = snapshot.data();
        if (pageIdPattern.test(snapshot.id) && typeof page.title === "string" && typeof page.body === "string") {
          pages.set(snapshot.id, page);
        }
      }
      ready = true;
      create.disabled = false;
      showPage(wikiRoute());
    } catch (error) {
      if (request !== revision) return;
      status.textContent = error.code === "permission-denied"
        ? "Wiki を読む権限がありません。"
        : "Wiki を読み込めませんでした。開き直してお試しください。";
    }
  }

  function openEditor(id = "") {
    if (!ready || saving) return;
    editing = id;
    const page = pages.get(id);
    titleInput.value = page?.title ?? "";
    readingInput.value = page?.reading ?? "";
    bodyInput.value = page?.body ?? "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "用語を選ぶ";
    linkPicker.replaceChildren(placeholder);
    for (const [key, entry] of [...pages].sort((a, b) => a[1].title.localeCompare(b[1].title, "ja"))) {
      if (key === id) continue;
      const option = document.createElement("option");
      option.value = key;
      option.textContent = entry.title;
      linkPicker.append(option);
    }
    form.hidden = false;
    intro.hidden = true;
    list.hidden = true;
    article.hidden = true;
    status.textContent = "";
    titleInput.focus();
  }

  menu.addEventListener("click", () => {
    location.hash = panel.hidden ? "wiki" : "";
  });
  window.addEventListener("hashchange", syncRoute);
  create.addEventListener("click", () => openEditor());
  edit.addEventListener("click", () => openEditor(selected));
  cancel.addEventListener("click", () => showPage(selected));
  insert.addEventListener("click", () => {
    const id = linkPicker.value;
    const page = pages.get(id);
    if (!page) return;
    const label = page.title.replace(/[\[\]\r\n]/g, " ").trim() || "関連用語";
    const start = bodyInput.selectionStart;
    const end = bodyInput.selectionEnd;
    const link = "[" + label + "](wiki:" + id + ")";
    if (bodyInput.value.length - (end - start) + link.length > bodyInput.maxLength) {
      status.textContent = "本文が長すぎるためリンクを追加できません。";
      return;
    }
    bodyInput.setRangeText(link, start, end, "end");
    bodyInput.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ready || saving) return;
    const page = { title: titleInput.value.trim(), reading: readingInput.value.trim(), body: bodyInput.value.trim() };
    if (!page.title || !page.body) {
      status.textContent = "タイトルと本文を入力してください。";
      return;
    }
    const request = revision;
    const id = editing;
    saving = fields.disabled = create.disabled = true;
    status.textContent = "保存中…";
    try {
      const { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } = await firestore();
      if (request !== revision) return;
      const db = getFirestore(app);
      const next = { ...page, updatedAt: serverTimestamp() };
      let savedId = id;
      if (id) {
        await updateDoc(doc(db, "a2Wiki", id), next);
      } else {
        savedId = (await addDoc(collection(db, "a2Wiki"), { ...next, createdAt: serverTimestamp() })).id;
      }
      if (request !== revision) return;
      pages.set(savedId, page);
      location.hash = "wiki-" + savedId;
      showPage(savedId);
      status.textContent = "保存しました。";
    } catch {
      if (request === revision) status.textContent = "保存できませんでした。";
    } finally {
      if (request === revision) saving = fields.disabled = create.disabled = false;
    }
  });

  return (nextUser) => {
    close();
    user = nextUser;
    menu.hidden = !user;
    if (user && wikiRoute() !== null) syncRoute();
  };
}
