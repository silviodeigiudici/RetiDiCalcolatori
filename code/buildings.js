const Key=require("./Secrets").map.maps;
var buildings=function(req,res,couch,request){
  var building = req.query.edificio.toLowerCase();
  couch.get('buildingsdb', building).then(({data, headers, status}) => {

    var build_name = data.name;
    var lat = data.addresses.lat;
    var lon = data.addresses.long;
    var address =  data.addresses.address+ "," +data.addresses.house_number + ","+data.addresses.postal_code  +' Rome RM';

    var classes = data.rooms;
    var rooms = data.rooms_number;
    var shops = data.shops;
    var vending_machines = data.vending_machines;
    var drinking_fountains = data.drinking_fountains;
    var study_rooms = data.study_rooms;
    var libraries = data.libraries;
    var wifi = data.wi_fi;

        res.render('building.ejs', {building :building,build_name :build_name ,address : address,lat : lat, lon : lon,classes:classes,num_classes :classes.length,rooms : rooms,
    shops : shops, vending_machines:vending_machines,drinking_fountains:drinking_fountains,study_rooms:study_rooms,libraries:libraries,wifi:wifi,api_key:Key});
  });
}
module.exports.send_page=buildings;
