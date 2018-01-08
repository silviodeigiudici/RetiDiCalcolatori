const express = require('express');
const server_port = 8080;

const app = express();

app.set('view engine', 'ejs'); //set ejs

app.use(express.static('views')); //to use files of web pages

app.listen(server_port, () => {
    console.log('Server in ascolto');
    });

app.get("/spv",(req,res) => {
  //changing those 3 will let you choose how many classrooms,which and what building
  //var building = 'spv';
  var num_classes = 3;
  var classes = ["3", "4", "24"];
  res.render('edificio.ejs', {num_classes :num_classes, classes:classes,building:'spv'});
});
app.get("/diag",(req,res) => {
  //changing those 3 will let you choose how many classrooms,which and what building
  //var building = 'DIAG';
  var num_classes = 3;
  var classes = ["3", "4", "24"];
  res.render('edificio.ejs', {num_classes :num_classes, classes:classes,building:'DIAG'});
});
