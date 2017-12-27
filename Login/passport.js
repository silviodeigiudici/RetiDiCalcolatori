var Local_Strategy =require('passport-local').Strategy;
var req=require('request');
var bcrypt=require("bcrypt-nodejs");
var db='http://127.0.0.1:5984/users';

module.exports = function(passport){
//serialize and deserialize users to enable passport sessions
  passport.serializeUser(function(username,done){
        done(null,username);
  });

//from the username get all the user info
  passport.deserializeUser(function(username, done) {
    req({
      url: db+username,
      method:'GET'
    },function (error,response,body){
      if(!error && response.statusCode==200){
        var usr=JSON.parse(body);
        done(null,usr);
      }
    });
  });

  passport.use("signup", new Local_Strategy( function(username,password,done){
    //if user doesn't exists create it in the database
    var usr= { "username":username,"password":createhash(password)};
    req({
      url: db+'/'+username,
      method:'PUT',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usr)
    },function (error,response,body){
      if(!error && response.statusCode==202){
        console.log("created the user");
        return done(null,true);
      } else{
        console.log("existing user");
        return done(null,false,{ message:'existing user!' } );
      }
    });
  }));
};

function createhash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function verifypassword(password,savedpassword){
  return bcrypt.compareSync(password,savedpassword);
}
