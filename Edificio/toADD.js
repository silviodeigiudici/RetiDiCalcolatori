/*var shops;
var vending_machines;
var drinking_fountain;
var study_rooms;
var libraries;*/

	

//console.log(classes);
		//console.log(data.shops[1].shop);
	//other informations
	//fillShops(building);
	//console.log( shops);
	/*fillVending(building);
	fillFountain(building); 
	fillStudy(building);
	fillLibrary(building);


console.log( vending_machines);
console.log( drinking_fountain);
console.log( study_rooms);
console.log( libraries);*/
  	
res.render('edificio.ejs', {building :building,build_name :build_name ,address : address,lat : lat, lon : lon,classes:classes,num_classes :num_classes,
	shops : shops, vending_machines:vending_machines,drinking_fountain:drinking_fountain,study_rooms:study_rooms,libraries:libraries,wifi:wifi});})
}, err => { console.log(err);
});

function fillShops(building){
couch.get('buildings', building).then(({data, headers, status}) => {
		shops = new Array();
		var i = 0;
		while(data.shops[i]!=undefined){
		shops.push(data.shops[i].shop + data.shops[i].location);
		i++;}
});}

function fillVending(building){
couch.get('buildings', building).then(({data, headers, status}) => {
		vending_machines = new Array();
		var i = 0;
		while(data.vending_machines[i]!=undefined){
		vending_machines.push(data.vending_machines[i].machine);
		i++;}
});}

function fillFountain(building){
couch.get('buildings', building).then(({data, headers, status}) => {
		drinking_fountains = new Array();
		var i = 0;
		while(data.drinking_fountains[i]!=undefined){
		drinking_fountains.push(data.drinking_fountains[i].fountain);
		i++;}
});}
function fillStudy(building){
couch.get('buildings', building).then(({data, headers, status}) => {
		study_rooms = new Array();
		var i = 0;
		while(data.study_rooms[i]!=undefined){
		study_rooms.push(data.study_rooms[i].room);
		i++;}
});}
function fillLibrary(building){
couch.get('buildings', building).then(({data, headers, status}) => {
		libraries = new Array();
		var i = 0;
		while(data.libraries[i]!=undefined){
		libraries.push(data.libraries[i].library);
		i++;}
});}
