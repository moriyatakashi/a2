function addEvent(element, eventType, fn) {
    if (element.addEventListener) element.addEventListener(eventType, fn, false);
    else if (element.attachEvent) var r = element.attachEvent('on' + eventType, fn);
    else element['on' + eventType] = fn;
}
function getEventTarget(e) {
	if (defined(e.target)) return e.target;
	else if (defined(e.srcElement)) return e.srcElement;
	return null;
}
function preventDefault(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
}
function defined(v) {
    if (typeof(v) == "undefined") return false;
    return true;
}
function getParam(search, name) {
	var param = search.substring(1);
	var params = param.split("&");
	for (var i = 0; i < params.length; i++) if (params[i].substr(0, name.length) == name && params[i].charAt(name.length) == '=') return params[i].substr(name.length+1);
	return null;
}
function enCER(str) {
	var cerTable = { " " : "&nbsp;", "<" : "&lt;", ">" : "&gt;", "\"" : "&quot;", "&" : "&amp;" };
	return str.replace(/([ <>\"&])/g, function(whole, char) { return cerTable[char]; });
}
var zenTable = new Array(
1024,0,0,0,0,5439872,8388608,8388608,0,0,0,0,0,0,536863984,7208964,0,0,0,0,0,0,0,0,0,0,0,-2083586048,-120817,-130049,558075,0,
-65534,-1,196607,0,128,0,0,0,-1047276,131071,25165824,1,129792,0,65280,-2033664,935348214,-127926271,-2147483648,0,1610612736,1024,1610612736,134217728,1589248,16384,6144,-16384,-536805376,-262144,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,1966145,201326592,14794752,134086656,417873,205128192,1333763680,-134217680,424017,747766272,-1577073032,-1048513,1982545,202506752,-15296,-65488,417809,202506752,1329583728,-262084,-69255437,1073543919,-8392,-4203713,
553789457,1041285632,-6307296,-65473,537014035,202424832,-1080047072,-65473,1878785523,1071947294,-8397008,-11329,63533075,-805042152,2023783296,-786433,1,2013790208,-268435456,-1,17816169,-1006103727,-67059552,-1,262144,1006632960,256,129024,16838656,536870912,-40960,-1,
-1,-1,-1,-1,-1,-1,67174399,-536870912,-1,-1,-1,-1,-1,-1,-1,-1,100663296,0,-1031749120,0,49664,-2134769664,8388807,0,12713984,65286,2013265920,-536870912,-1,532496,1058434,-2059264,
44564481,26624,528482394,384,0,0,-268369921,363,528543744,0,402653436,-1073709056,2015346719,0,0,409042944,768,204473100,405848064,-32378,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1056964608,-67044352,
-67106817,0,0,-16777216,0,-1024,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,1048576,0,0,2048,0,0,-2048,1073741823,0,0,0,0,-268435136,0,0,-67108864,-1061158912,64512,2097216704,-1073726464,-67108864,2112512,271581216,-2145189888,
861995018,135069795,1073740800,787455,-2064384,-4194304,-1,-1,4194312,-33552382,499711,-1,1048559,0,1310720,-2048,-469628531,540041121,262144,3267,204,-2147483616,0,-262144,-65637,-4,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,966365199,-1717987015,2052,0,-4194304,806092803,51392,-32768,-1,-503316481,-1,-23296,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-3145729,-1,-1,-97,-1,-1,-201326593,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-15736832,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-8388609,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,-8192,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-125829121,-4,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,536870905,-1602224128,36,0,0,-262144,524287,268434432,
-1,-1,1073741823,-8,-1,-1,-1,-1,-1,1073741823,-1,-1,-1,-1,-1,-1,-1,-16,-1,-1,0,1711276032,0,1610612736,-1,-1,-1,1,0,-1,-1,2147451135
);
function isZenkaku(charcode) {
	if (zenTable[charcode >>> 5] & (1 << (charcode & 0x1f))) return true;
	return false;
}
function formatSourceLine(strLine, tabWidth) {
	var col = 0;
	var ar = new Array();
	for (var i = 0; i < strLine.length; i++) {
		var ch = strLine.charAt(i);
		var charcode = strLine.charCodeAt(i);
		if (charcode == 9) do {
			ar.push(' ');
			col++;
		} while (col % tabWidth != 0);
		else if (isZenkaku(charcode)) {
			ar.push(ch);
			col += 2;
		} else {
			ar.push(ch);
			col++;
		}
	}
	return ar.join("");
}
function getClientHeight(w) {
	if (defined(window.opera)) return w.document.body.clientHeight;
    if (defined(w.document.documentElement) && defined(w.document.documentElement.clientHeight)) return w.document.documentElement.clientHeight;
    else if (defined(w.document.body) && defined(w.document.body.clientHeight)) return w.document.body.clientHeight;
    else if (defined(w.innerHeight)) return w.innerHeight;
    else return 200;
}
function getScrollPosY(w) {
	if (defined(w.pageYOffset)) return w.pageYOffset;
	else if (defined(w.document.documentElement) && defined(w.document.documentElement.scrollTop)) return w.document.documentElement.scrollTop;
	else if (defined(w.document.body) && defined(w.document.body.scrollTop)) return w.document.body.scrollTop;
	else return -1;
}