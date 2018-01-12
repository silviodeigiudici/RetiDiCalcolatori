//getting the required modules

var express=require("express");
var port =process.env.PORT || 3000
var passport= require('passport');
var cookieParser= require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash= require('connect-flash');


//linking middleware to application
var app=express(); //starting express
app.use(cookieParser()); //read coockies
app.use(bodyParser()); //read html forms
app.use(session({secret: 'ClassRoomAdvisor'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('views','../views'); // path to the views location
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(flash()) // support flash messages
app.listen(port);
console.log('up on port:' + port);

//linking node modules
require('./routes.js')(app,passport); //routes for the application
require('./passport.js')(passport); // passport configuration for local authetication
