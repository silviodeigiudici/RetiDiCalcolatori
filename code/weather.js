

  //constants to get the weather info from OpenWeathermap API
  const url_weather = "http://api.openweathermap.org/data/2.5/weather";
  const city = "Roma";
  const state = "IT"
  const appid = require('./Secrets').weather.openweathermap;

  const meteo = {
      url: url_weather + "?q=" + city + "," + state + "&appid=" + appid //meteo's url
    }

  const url_couchdb = "http://127.0.0.1:5984/buildingsdb"

  const couchdb_buildings = {
    url: url_couchdb + "/_all_docs" //use _all_docs to get all buildings in database
  }

var send_page=function(request, req, res){


  request.get(meteo, (error_meteo, response_meteo, body_meteo) => { //here i get meteo's information

    var info = JSON.parse(body_meteo);
    var weather = info.weather[0].main
    var temperature = Math.floor(info.main.temp-273.15)
    var wind = info.wind.speed

    request.get(couchdb_buildings, (error_couch, response_couch, body_couch) => { //here i get all buildings and create links to marco's page

      var json = JSON.parse(body_couch);
      var num_edifici = json.total_rows;
      var edifici = json.rows;

      if(!error_meteo && !error_couch){
        res.render('home.ejs', {weather: weather, temp: temperature, wind: wind, num_edifici: num_edifici, edifici:edifici}); //pass variables to ejs
        }
      });

    });

  }

  module.exports.send_page=send_page
