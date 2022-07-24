apt update
apt -y install python3 pip vim curl
cd /root/a2
python3 -m http.server 8080 --cgi