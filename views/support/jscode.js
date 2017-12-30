const port = 8080;
const ip = "localhost";
const url = "ws://" + ip + ":" + port;

const websocket = new WebSocket(url);
const logger = document.getElementById('log');

websocket.onopen = function(event){
    websocket.send("Hello there, i'm a new client!");
    };

websocket.onmessage = function(event){
    var info = JSON.parse(event.data);
    logger.innerHTML += "From: " + info.name + " | Date: " + info.datatime + " | Message: " + info.message + "<br>";
    };

document.querySelector('button').onclick = function(){
    var message = document.getElementById('text').value;
    websocket.send(message);
    };
