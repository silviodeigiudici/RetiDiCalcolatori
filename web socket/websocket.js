module.exports = function(app, express, sessionParser, dict_req){

/*******************************************/
///Global chat using web sockets
// Link to the documentation of ws: https://github.com/websockets/ws
/******************************************/

/**REQUIRE**/
  const websocket = require('ws');
  const http = require('http');
  const request = require('request');

/**VARIABLES**/
  const server_port = 8080;

  const server = http.createServer(app); //create a server using http because ws interfaces with http but not app


  const server_socket = new websocket.Server({
    server: server,
    verifyClient: (info, done) => { //this function check if the client is logged, if not refuses connection request
      sessionParser(info.req, {}, () => { //sessionParser allow to get passport information
          var passport = info.req.session.passport;
          done(passport != undefined && passport.user != undefined && dict_req[passport.user].isAuthenticated());
        });
      }
    });

  const url_weather = "http://api.openweathermap.org/data/2.5/weather";
  const city = "Roma";
  const state = "IT"
  const appid = "bc1ddf2e6211920bf9d7988a7d67348f"

  const meteo = {
      url: url_weather + "?q=" + city + "," + state + "&appid=" + appid
      }

  const url_couchdb = "http://172.17.0.1:5984/db"

  const couchdb_buildings = {
      url: url_couchdb + "/_all_docs" //use _all_docs to get all buildings in database
      }

/**SETTING APP (MAIN)**/

  app.use(express.static('views/support')); //to use files of web pages

  app.set('view engine', 'ejs'); //set ejs


  app.get('/edifici', (req, res) => {

    if(req.isAuthenticated()){
        dict_req[req.user.local.username] = req; //add req in dictionary
        send_page(couchdb_buildings, request, req, res, meteo, couchdb_buildings);
        }
    else{
        res.redirect('/login'); //redirect to the login's page written from mattia
        }

    });

  open_server_socket(server_socket, dict_req); //set ws, to call one time only!

  server.listen(server_port, () => { //server on listening
    console.log('In ascolto sulla porta: ', server_port);
  });

}

/**FUNCTIONS**/

function get_info(message, username){ //this function create a JSON containing message, datatime and name
  var date = new Date();
  var datatime = date.getHours() + ":" + date.getMinutes();

  var info = JSON.stringify({
    message: message,
    datatime: datatime,
    name: username
    });
  return info;
  }

function open_server_socket(server_socket, dict_req){ //a function that setting server_socket

  server_socket.on('connection', (client, request) => { // handling a connection's request (res, req)

    const username = request.session.passport.user;
    const client_ip = request.connection.remoteAddress;

    client.on('message', (message) => { //handling a message received

      var info = get_info(message, username);
      if(dict_req[username] != undefined && dict_req[username].isAuthenticated()){
          console.log("Messaggio ricevuto: " + message);
          server_socket.clients.forEach((client_socket) => client_socket.send(info)); //send message received to all clients
          }
      else{
          client.close();
          }
    });

    client.on('close', (client) => { //handling a connection close
      console.log("Un client ha abbandonato la chat: " + client_ip);
    });

    client.on('error', (client) => { //handling a error
      console.log("E' avvenuto un errore con un client: " + error);
    });

  });

}

function send_page(couchdb_buildings, request, req, res, meteo){ //function that get meteo and buildings info and send page index

  request.get(meteo, (error_meteo, response_meteo, body_meteo) => { //get meteo info

    var info = JSON.parse(body_meteo);
    var weather = info.weather[0].main
    var temperature = info.main.temp
    var wind = info.wind.speed

    request.get(couchdb_buildings, (error_couch, response_couch, body_couch) => { //get all buildings

      var json = JSON.parse(body_couch);
      var num_edifici = json.total_rows;
      var edifici = json.rows;

      if(!error_meteo && !error_couch){
        res.render('index.ejs', {weather: weather, temp: temperature, wind: wind, num_edifici: num_edifici, edifici:edifici}); //send page with ejs's parameters
        }
      });

    });

  }
