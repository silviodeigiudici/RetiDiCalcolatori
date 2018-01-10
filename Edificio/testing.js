const express = require('express');
  const request = require('request');
const server_port = 8080;

const app = express();
const NodeCouchDb = require('node-couchdb');

// node-couchdb instance with default options
const couch = new NodeCouchDb();
var classes;
app.set('view engine', 'ejs'); //set ejs

app.use(express.static('views')); //to use files of web pages

app.listen(server_port, () => {
    console.log('Server in ascolto');
    });

app.get("/edificio",(req,res) => {
  var building = req.query.edificio;

  couch.get('buildings', building).then(({data, headers, status}) => {
	var build_name = data.name;
 	var num_classes = data.rooms;
    	var lat = data.addresses.lat;
    	var lon = data.addresses.long;
        var address =  data.addresses.address+ "," +data.addresses.house_number + ","+data.addresses.postal_code  +' Rome RM';
	fillArray(building,num_classes);
	console.log("hi"+classes[0]);
  	res.render('edificio.ejs', {building :building,build_name :build_name ,address : address,lat : lat, lon : lon,classes:classes,num_classes :num_classes});})
}, err => { console.log(err);
});


function fillArray(building,num_classes){
couch.get(building.toLowerCase()+'classrooms', "_all_docs").then(({data, headers, status}) => {
	classes = new Array();
	for(i = 0;i < num_classes;i++){
	classes.push(data.rows[i].id);
	console.log(classes[i]);}
});}




