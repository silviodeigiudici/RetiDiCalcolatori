module.exports = function(app, express){

  const request = require('request');

  const routes = require('./routes.js'); //needs to get isLoggedIn function

  const url_weather = "http://api.openweathermap.org/data/2.5/weather";
  const city = "Roma";
  const state = "IT"
  const appid = "bc1ddf2e6211920bf9d7988a7d67348f"

  const meteo = {
      url: url_weather + "?q=" + city + "," + state + "&appid=" + appid //meteo's url
      }

  const url_couchdb = "http://127.0.0.1:5984/buildingsdb"

  const couchdb_buildings = {
      url: url_couchdb + "/_all_docs" //use _all_docs to get all buildings in database
      }

  app.use(express.static('./views/support')); //to use files of web pages


  app.get('/edifici', routes.isLoggedIn, (req, res) => {

      send_page(couchdb_buildings, request, req, res, meteo, couchdb_buildings);

    });

}

function send_page(couchdb_buildings, request, req, res, meteo){

  request.get(meteo, (error_meteo, response_meteo, body_meteo) => { //here i get meteo's information

    var info = JSON.parse(body_meteo);
    var weather = info.weather[0].main
    var temperature = info.main.temp
    var wind = info.wind.speed

    request.get(couchdb_buildings, (error_couch, response_couch, body_couch) => { //here i get all buildings and create links to marco's page

      var json = JSON.parse(body_couch);
      var num_edifici = json.total_rows;
      var edifici = json.rows;

      if(!error_meteo && !error_couch){
        res.render('index.ejs', {weather: weather, temp: temperature, wind: wind, num_edifici: num_edifici, edifici:edifici}); //pass variables to ejs
        }
      });

    });

  }


