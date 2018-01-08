const express = require('express');
const server_port = 8080;

const app = express();

app.set('view engine', 'ejs'); //set ejs

app.use(express.static('views')); //to use files of web pages

app.listen(server_port, () => {
    console.log('Server in ascolto');
    });

app.get("/edificio",(req,res) => {
  var building = req.query.edificio;
  //changing those 2 will let you choose how many and which classrooms
  var num_classes = 3;
  var classes = ["3", "4", "24"];
  res.render('edificio.ejs', {num_classes :num_classes, classes:classes,building:building});
});
