/*******************************************/
///Global chat using web sockets
// Link to the documentation of ws: https://github.com/websockets/ws
/******************************************/

/**REQUIRE**/
const websocket = require('ws');
const express = require('express');
const http = require('http');
const request = require('request');

/**VARIABLES**/
const server_port = 8080; //you can use this port if you're using docker

const app = express();
const server = http.createServer(app); //create a server using http because ws interfaces with http but not app
const server_socket = new websocket.Server({ server });

const url_weather = "http://api.openweathermap.org/data/2.5/weather";
const city = "Roma";
const state = "IT"
const appid = "bc1ddf2e6211920bf9d7988a7d67348f"
const complete_url = url_weather + "?q=" + city + "," + state + "&appid=" + appid;

const options = {
    url: complete_url
    }


/**FUNCTIONS**/

function get_info(message, username){
    var date = new Date();
    var datatime = date.getHours() + ":" + date.getMinutes();

    var info = JSON.stringify({
        message: message,
        datatime: datatime,
        name: username
        });
    return info;
    }

function open_server_socket(server_socket){ //a function that setting server_socket

    server_socket.on('connection', (client, request) => { // handling a connection's request
        const client_ip = request.connection.remoteAddress; //take ip of client
        //const username = request.user.username; //questo valore user.username viene inserito da passport stesso quando invocato
        const username = client_ip;

        client.on('message', (message) => { //handling a message received
            var info = get_info(message, username);
            console.log("Messaggio ricevuto: " + message);
            server_socket.clients.forEach((client_socket) => client_socket.send(info)); //send message received to all clients
        });

        client.on('close', (client) => { //handling a connection close
            console.log("Un client ha abbandonato la chat: " + client_ip);
        });

        client.on('error', (client) => { //handling a error
            console.log("E' avvenuto un errore con un client: " + error);
        });
    });
}

function is_authenticated(){ //need to use the real authentication function
    return true;
    }

function send_page(req, res, options){

    request.get(options, (error, responde, body) => {
        var info = JSON.parse(body);
        var weather = info.weather[0].main
        var temperature = info.main.temp
        var wind = info.wind.speed
        console.log(wind + weather + temperature);
        if(!error){
            res.render('index.ejs', {weather: weather, temp: temperature, wind: wind});
            }
        });
    }

/**SETTING APP (MAIN)**/

app.use(express.static('views/support'));

app.set('view engine', 'ejs'); //set ejs

app.get('/edifici', (req, res) => {

    if(is_authenticated()){
        send_page(req, res, options);
        }
    else{
        res.redirect('/login'); //redirect to the login's page written from mattia
        }

    });

open_server_socket(server_socket); //set ws

server.listen(server_port, () => { //server on listening
  console.log('In ascolto sulla porta: ', server_port);
});
