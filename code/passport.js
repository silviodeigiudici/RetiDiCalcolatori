// passport strategy for local login
const Local_Strategy =require('passport-local').Strategy;
//passport strategy for google oauth login
const Google_Strategy = require('passport-google-oauth20').Strategy;
//data needed to call google api
const OAuth_data=require('./OAuth_Secret');
//user handler module
const User=require('./user');



module.exports = function(passport){
//serialize an user to authenticate its sessions
  passport.serializeUser(function(user,done){
    console.log("[passport.js] serialized user: "+user._id);
    done(null,user._id);
  });

//from the username get all the user info
  passport.deserializeUser(function(id, done) {
    User.get(id,function(found,user){
      if(found){
        console.log("[passport.js] deserialized! :"+user._id);
        done(null,user);
      } else{
        done(null,false);
        console.log("[passport.js] failed to deserialize user "+id);
      }
    });
  });

  //passport Strategy to register a new user
  passport.use("signup", new Local_Strategy( {passReqToCallback : true},function(req, username, password, done){
    //ensure there are only valid values
    var email = req.body.email;
      if(typeof password=='undefined'||typeof username=='undefined' || typeof email == 'undefined'){
        console.log("[passport.js] invalid fields");
        return done(null,false,req.flash('signupMessage','missing username or password!') );
    }
    var number = Math.floor(Math.random() * 100000000000);
    //check if the user doesn't already exist and create it
    var usr= {local:{ "username":username,"password":User.createhash(password),"email": email,"IsConfirmed": false}};
    User.search(username,function(found,user){
      // if the user exists abort and show message on page
      if(found){
        done(null,false,req.flash('signupMessage','existing user!'));
      } else{
        User.create(usr,function(result,user){
          if(result){
            console.log("[passport.js] redirecting to profile");
            return done(null,user);
          }
          return done(null,false,req.flash('signupMessage','server error, failed to create the user!'));
        })
      }
    });
  }));

  //passport Strategy to log in a user
  passport.use("login", new Local_Strategy( {passReqToCallback : true},function(req, username, password, done){
      //ensure there are only valid values
      if(typeof password=='undefined' || typeof username=='undefined'){
        console.log("[passport.js] invalid fields");
        return done(null,false,req.flash('loginMessage','missing username or password!') );
      }
      //make a request to the database to get the userdata
      User.search(username,function(found,user){
        // abort in case of unexisting user
        if(found==false){
          return done(null,false,req.flash('loginMessage','wrong username'));
        } else{
          // verify user password
          User.check(user,password,function(verified){
            if(verified){
              return done(null,user);
            } else {
              return done(null,false,req.flash('loginMessage','wrong password'));
            }
          })
        }
      });

  }));

  passport.use("google",new Google_Strategy({
        // app data to authenticate app on google authentication server
        clientID        : OAuth_data.google.clientID,
        clientSecret    : OAuth_data.google.clientSecret,
        callbackURL     : OAuth_data.google.callbackURL,

  },function(token,refresh,profile,done){
    var usr={ google:{ "name":profile.displayName,"token":token}}
    //check if the user was already saved on the database
    User.search(usr.google.name,function(found,user){
      if(found==true){
        return done(null,user);
      }else{
        //if user doesn't exists create it
        User.create(usr,function(result,user){
          if(result){
            return done(null,user);
          }
          console.log("[passport.js] failed to save google account");
          return done(null,false);
        })
      }
    });
  }));

};
