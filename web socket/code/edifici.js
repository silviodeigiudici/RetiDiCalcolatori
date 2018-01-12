module.exports = function(app, request, express, dict_req){

  const url_weather = "http://api.openweathermap.org/data/2.5/weather";
  const city = "Roma";
  const state = "IT"
  const appid = "bc1ddf2e6211920bf9d7988a7d67348f"

  const meteo = {
      url: url_weather + "?q=" + city + "," + state + "&appid=" + appid
      }

  const url_couchdb = "http://127.0.0.1:5984/db"

  const couchdb_buildings = {
      url: url_couchdb + "/_all_docs" //use _all_docs to get all buildings in database
      }

  app.use(express.static('../views/support')); //to use files of web pages

  //app.set('view engine', 'ejs'); //set ejs


  app.get('/edifici', (req, res) => {

    if(req.isAuthenticated()){
      dict_req[req.user._id] = req; //add req in dictionary
      send_page(couchdb_buildings, request, req, res, meteo, couchdb_buildings);
      }
    else{
        res.redirect('/login'); //redirect to the login's page written from mattia
        }

    });

}

function send_page(couchdb_buildings, request, req, res, meteo){

  request.get(meteo, (error_meteo, response_meteo, body_meteo) => {

    var info = JSON.parse(body_meteo);
    var weather = info.weather[0].main
    var temperature = info.main.temp
    var wind = info.wind.speed

    request.get(couchdb_buildings, (error_couch, response_couch, body_couch) => {

      var json = JSON.parse(body_couch);
      var num_edifici = json.total_rows;
      var edifici = json.rows;

      if(!error_meteo && !error_couch){
        res.render('index.ejs', {weather: weather, temp: temperature, wind: wind, num_edifici: num_edifici, edifici:edifici});
        }
      });

    });

  }
