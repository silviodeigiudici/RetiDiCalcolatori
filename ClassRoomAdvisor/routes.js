module.exports= function(app,passport, wss) {
const NodeCouchDb = require('node-couchdb');
const couch = new NodeCouchDb();
const WSfunctions = require('./websocket_functions.js');


  // render home page
  app.get('/', function (req,res){
    res.render('home.ejs');
  });

  // render login page
  app.get('/login', function (req,res){
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // initiate login procedure
  app.post('/login',passport.authenticate('login',{
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash:true
  }));

  // render signup page
  app.get('/signup', function (req,res){
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // initiate signup procedure
  app.post('/signup',passport.authenticate('signup',{
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash:true
  }));

  // account profile, available only if the user has already logged
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log("rendering profile view");
    res.render('profile.ejs', {user:req.user});
  });

  // logout
  app.get('/logout', function(req, res) {
    WSfunctions.close_ws(wss, req.user._id); //need to close cliets connected in chat (not only one if you open chat in multiple tabs)
    req.logout();
    res.redirect('/');
  });

  //initiate OAuth2 login with Google credentials
  app.get('/google', passport.authenticate('google', { scope : ['profile'] }));

  //if this is called the nthe user has logged on google, so we must log him in in the app
  //and enventually save him in the DB
  app.get('/auth',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


  app.get("/registration",(req,res) => {
  var page;
  var reg_id = req.query.registration;
  couch.get('users', reg_id).then(({data, headers, status}) => {
      var rev = data._rev;
      couch.update("users", {   //updating the user to the confirmed status
        _id: reg_id,
        _rev: rev,
           "local": {
       "username": data.local.username,
       "password": data.local.password,
       "email": data.local.email,
       "IsConfirmed": true
   }
        }).then(({data, headers, status}) => {
}, err => {
    console.log(err);
    });

	res.render('registered.ejs',{page : "http://localhost:8080/login"});
  },err => {
    res.render('registered.ejs',{page : 'http://localhost:8080/signup'});
});
});

}




// callback which ensures hat the session is authenticated
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    if(req.user.local!=undefined){
        if(req.user.local.IsConfirmed == true){
        console.log("user logged");
        return next(); // loads the page which was requested
        }
    }
    else if(req.user.google != undefined){
        console.log("user logged with google");
        return next(); // loads the page which was requested
    }
    else{
        res.redirect('/'); // redirects
    }
    }
}

module.exports.isLoggedIn=isLoggedIn;
