const port = 8080;
const ip = "localhost";
const url = "ws://" + ip + ":" + port + "/home";

const websocket = new WebSocket(url);
const textarea = document.getElementById('messarea');


websocket.onopen = (event) => {
    };

websocket.onmessage = (event) => {
    var info = JSON.parse(event.data);
    textarea.innerHTML += "From: " + info.name + " | Date: " + info.datatime + "\n" + "\t" + "Message: " + info.message + "\n";
    };

document.querySelector('button').onclick = () => {
    var message = document.getElementById('text').value;
    websocket.send(message);
    };
