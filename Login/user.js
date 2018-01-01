const request=require('request');
const bcrypt=require("bcrypt-nodejs");
const host='http://127.0.0.1:5984';
const db=host+"/users";

var search=function(username,done){
  var query={ "selector":{
    "$or":[
      {"local.username":username},
      {"google.name":username}
    ]
  }};
  request({
    url: db+'/_find',
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(query)
  },function (error,response,body){
    if(!error && response.statusCode==200){
      var usr=JSON.parse(body);
      if(typeof usr.docs[0]!='undefined'){
        return done(true,usr.docs[0])
      } else {
        console.log("user doesn't exists");
        return done(false,null);
      }
    }else {
      console.log(error);
      return done(false,null);
    }
  });
}

var get=function(id,done){
  request({
    url:db+'/'+id,
    method:'GET'
  },function(error,response,body){
    if(!error && response.statusCode==200){
      console.log(body);
     done(true,JSON.parse(body));
    }else {
      console.log("get error:"+error);
      done(false,null);
    }
  });
}

var create=function(usr,done){
  get_new_id(function(result,id){
    if(result==false){
      console.log("failed to get an id");
      return done(false);
    }
    //make a request to the database to save the user
    request({
      url: db+'/'+id,
      method:'PUT',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usr)
      //callback to check if the user already exists or there were problems
    },function (error,response,body){
      if(!error && response.statusCode==202){
        request({
          url:db+'/'+id,
          method:'GET'
        },function(error,response,body){
          if(!error && response.statusCode==200){
            console.log("created the user");
            done(true,JSON.parse(body));
          }else {
            console.log(error);
            done(false,null);
          }
        });
      } else{
          if(!error && response.statusCode==409){
            console.log("existing user");
            return done(false,null);
          } else {
            console.log("response on creation:"+response.statusCode);
            return done(false,null);
        }
      }
    });
  });

}

var check=function(user,password,done){
  return done(verifypassword(password,user.local.password));
}

var createhash=function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function verifypassword(password,savedpassword){
  return bcrypt.compareSync(password,savedpassword);
}

function get_new_id(done){
  request({
    url:host+'/_uuids',
    method:'GET'
  },function(error,response,body){
    if(!error && response.statusCode==200){
     done(true,JSON.parse(body).uuids[0]);
    }else {
      console.log(error);
      done(false,null);
    }
  });
}

module.exports.check=check;
module.exports.search=search;
module.exports.create=create;
module.exports.createhash=createhash;
module.exports.get=get;
