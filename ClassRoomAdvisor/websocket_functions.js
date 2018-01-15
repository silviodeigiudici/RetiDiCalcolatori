
function check_connection(ws, req, client_ip){

  var username;

  console.log("Client at " + client_ip + " is now connect");
  if(req.isAuthenticated()){ //if it's authenticated get username
    console.log("Client authenticated");
    if(req.user.local){
      username = req.user.local.username; //user is logged with local passport
    }
    else {
      username = req.user.google.name; //user is logged with oauth
    }
  }
  else { //otherwise connection is closed
    console.log("Client not authenticated, closing connection...");
    ws.close();
  }

  return username;

}

function close_ws(wss, id){ //close clients with an specific connection's id
  wss.clients.forEach( (client) => { //client has id of passport session
    if(client.upgradeReq.user._id == id){
      console.log("Client logout, closing connection...");
      client.close();
    }
  });


}

function send_to_all(msg, username, wss){ //a function that send to all client a message
  var info = create_message(msg, username);
  wss.clients.forEach( (client) => {
    console.log("Send message: " + info);
    client.send(info);
  });
}


function create_message(message, username){ //this function create a JSON containing message, datatime and name
  var date = new Date();
  var datatime = date.getHours() + ":" + date.getMinutes();

  var info = JSON.stringify({
    message: message,
    datatime: datatime,
    name: username
    });
  return info;
  }



module.exports.create_message=create_message;
module.exports.send_to_all = send_to_all;
module.exports.check_connection = check_connection;
module.exports.close_ws = close_ws;
