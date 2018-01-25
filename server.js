//getting the required modules

const express=require("express");
const port =process.env.PORT || 8080
const passport= require('passport');
const cookieParser= require('cookie-parser');
const bodyParser= require('body-parser');
const session= require('express-session');
const flash= require('connect-flash');
const NodeCouchDb = require('node-couchdb');
const couch = new NodeCouchDb();
const request = require('request');
//node module amqp (we use topics based queue)
const amqp = require('amqplib/callback_api');
//call flickr API
const Flickr=require('flickrapi');

//linking middleware to application
var app=express(); //starting express
app.use(cookieParser()); //read coockies
app.use(bodyParser.urlencoded({extended:true})); //read html forms

app.use(session({secret: 'ClassRoomAdvisor',resave:false,saveUninitialized:false}));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('views','./views'); // path to the views location
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(flash()) // support flash messages


var expressWs = require('express-ws')(app); //use for web socket, needs it because module ws work on with http module
var wss = expressWs.getWss('/home'); //get web socket server

app.listen(port); //need to listen app after setting up web socket
console.log('[base.js] Up on port:' + port);

//linking node modules
require('./code/routes.js')(app,passport,wss,couch,request,express,amqp,Flickr); //routes for the application
require('./code/passport.js')(passport); // passport configuration for local authetication
require('./code/websocket.js')(app, wss); //open seb socket server

require('./code/amqp_client.js')();
