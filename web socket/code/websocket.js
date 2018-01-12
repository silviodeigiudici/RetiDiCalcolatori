module.exports = function(app, request, server_port, sessionParser, dict_req){
  const websocket = require('ws');
  const http = require('http');

  const server = http.createServer(app); //create a server using http because ws interfaces with http but not app

  const WSfunctions = require('./websocket_functions.js');


  const server_socket = new websocket.Server({
    server: server,
    verifyClient: (info, done) => { //this function check if the client is logged, if not refuses connection request
      sessionParser(info.req, {}, () => { //sessionParser allow to get passport information of the serializeUser function
        var passport = info.req.session.passport;
        return done(passport != undefined && passport.user != undefined && dict_req[passport.user].isAuthenticated()); //this line check if the user is logged or not
        });
      }
    });

    server.listen(server_port, () => { //server on listening
        console.log('In ascolto sulla porta: ', server_port);
    });

    WSfunctions.open_server_socket(server_socket, dict_req); //set ws, to call one time only!

}

