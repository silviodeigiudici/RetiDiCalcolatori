module.exports= function(app,passport) {

  app.get('/', function (req,res){
    res.render('home.ejs');
  });

  app.get('/login', function (req,res){
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login',passport.authenticate('login',{
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash:true
  }));
  
  app.get('/signup', function (req,res){
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup',passport.authenticate('signup',{
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash:true
  }));

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
