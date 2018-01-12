function open_server_socket(server_socket, dict_req){ //a function that setting server_socket

  server_socket.on('connection', (client, request) => { // handling a connection's request (sarebbe res, req)

    const id = request.session.passport.user;

    const req = dict_req[id];
    var username = undefined;
    if(req.user.local){
      username = req.user.local.username;
    }
    else {
      username = req.user.google.name;
    }

    const client_ip = request.connection.remoteAddress;

    client.on('message', (message) => { //handling a message received

      var info = get_info(message, username);
      if(dict_req[id] != undefined && dict_req[id].isAuthenticated()){
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

module.exports.get_info=get_info;
module.exports.open_server_socket=open_server_socket;
