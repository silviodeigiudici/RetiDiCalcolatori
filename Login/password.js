bcrpyt=require("bcrypt-nodejs");
module.export = function(){
  
function createhash(password){
  return bcrypt(password,bcrypt.genHashSync(8),null);
}

function verifypassword(password,savedpassword){
  return bcrypt.compareSync(password,savedpassword);
}

}
