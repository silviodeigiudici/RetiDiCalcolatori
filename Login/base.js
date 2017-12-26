//getting the required modules

var express=require("express");
var port =process.env.PORT || 3000
var passport= require('passport'); //module to get the
var flash= require('connect-flash');
var cookieParser= require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


//linking middleware to application
var app=express(); //starting express
app.use(cookieParser()); //read coockies
app.use(bodyParser()); //read html forms
app.use(session({secret: 'ClassRoomAdvisor'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.listen(port);
console.log('up on port:' + port);

//linking node modules
require('./routes.js')(app,passport); //routes for the application
require('./password.js')();//password handling
require('./passport.js')(passport); // passport configuration for local authetication
