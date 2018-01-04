var Local_Strategy =require('passport-local').Strategy;
var request=require('request');
var bcrypt=require("bcrypt-nodejs");

var db='http://172.17.0.1:5984/users';

module.exports = function(passport){
//serialize an user to authenticate its sessions
  passport.serializeUser(function(user,done){
        done(null,user.local.username);
  });

//from the username get all the user info
  passport.deserializeUser(function(username, done) {
    request({
      url: db+'/'+username,
      method:'GET'
    },function (error,response,body){
      if(!error && response.statusCode==200){
        var usr=JSON.parse(body);
        done(null,usr);
      }else {
        done(error);
      }
    });
  });

  //passport Strategy to register a new user
  passport.use("signup", new Local_Strategy( {passReqToCallback : true},function(req, username, password, done){
    //ensure there are only valid values
      if(password==''|| username==''){
          return done(null,false,req.flash('signupMessage','missing username or password!') );
    }
    //create the user
    var usr= {local:{ "username":username,"password":createhash(password)}};
    //make a request to the database to save the user
    request({
      url: db+'/'+username,
      method:'PUT',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usr)
      //callback to check if the user already exists or there were problems
    },function (error,response,body){
      if(!error && response.statusCode==202){
        console.log("created the user");
        return done(null,usr);
      } else{
          if(!error && response.statusCode==409){
            console.log("existing user");
            return done(null,false,req.flash('signupMessage','existing user!') );
          } else {
            return done(error);
        }
      }
    });
  }));

  //passport Strategy to log in a user
  passport.use("login", new Local_Strategy( {passReqToCallback : true},function(req, username, password, done){
      //ensure there are only valid values
      if(password=='' || username==''){
          console.log("invalid fields");
          return done(null,false,req.flash('loginMessage','missing username or password!') );
      }
      //make a request to the database to get the userdata
      request({
          url: db+'/'+username,
          method:'GET'
          //callback to check if the user doensn't exists or there were problems
      },function (error,response,body){
          var usr=JSON.parse(body);
          if(!error && response.statusCode==200){
              if(verifypassword(password,usr.local.password)){
                  console.log("user logged");
                  return done(null,usr);
            } else {
                console.log("wrong password");
                return done(null,false,req.flash('loginMessage','wrong password!'));
            }

          } else{
              if(!error&& response.statusCode==404){
                  console.log("user does not exist");
                  return done(null,false,req.flash('loginMessage','user does not exist!') );
              } else {
                  return done(error);
              }
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
