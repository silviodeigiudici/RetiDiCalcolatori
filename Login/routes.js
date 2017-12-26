module.exports= function(app,passport) {

  app.get('/', function (req,res){
    res.sendfile(__dirname+'/views/home.html');
  });

  app.get('/login', function (req,res){
    res.sendfile(__dirname+'/views/login.html');
  });

  app.get('/signup', function (req,res){
    res.sendfile(__dirname+'/views/signup.html');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
  });
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next;
  }
  res.redirect('/');
}
