var Local_Strategy =require('passport-local').Strategy;
module.exports = function(passport,user){
//serialize and deserialize users to enable passport sessions
  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
passport.use("signup", new Local_Strategy(req,username,password,done)
)
};
