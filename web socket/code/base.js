//getting the required modules

var express=require("express");
var port =process.env.PORT || 8080
var passport= require('passport');
var cookieParser= require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash= require('connect-flash');


//linking middleware to application
var app=express(); //starting express
app.use(cookieParser()); //read coockies
app.use(bodyParser()); //read html forms

var sessionParser = session({
    secret: 'ClassRoomAdvisor'
    });

app.use(sessionParser);


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('views','../views'); // path to the views location
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(flash()) // support flash messages

const request = require('request');


//app.listen(port);
//console.log('up on port:' + port);

var dict_req = {}; //this dictionary is used to save request object, because web socket can't access to passport information

//linking node modules
require('./routes.js')(app,passport, dict_req); //routes for the application
require('./passport.js')(passport); // passport configuration for local authetication
require('./websocket.js')(app, request, port, sessionParser, dict_req);
require('./edifici')(app, request, express, dict_req);
