module.exports= function(app,express) {
const request = require('request');

const NodeCouchDb = require('node-couchdb');
const routes = require('./routes.js'); //needs to get isLoggedIn function
// module to take parameters from POST
var bodyParser = require('body-parser')

// node-couchdb instance with default options
const couch = new NodeCouchDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs'); //set ejs

app.use(express.static('./views')); //to use files of web pages

app.get("/edificio",routes.isLoggedIn,(req,res) => {
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

            res.render('edificio.ejs', {building :building,build_name :build_name ,address : address,lat : lat, lon : lon,classes:classes,num_classes :classes.length,rooms : rooms,
        shops : shops, vending_machines:vending_machines,drinking_fountains:drinking_fountains,study_rooms:study_rooms,libraries:libraries,wifi:wifi});
      }, err => {
          res.redirect('/home');
      });

});

}
