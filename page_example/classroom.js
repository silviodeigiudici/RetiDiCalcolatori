// module to take parameters from POST
var bodyParser = require('body-parser')

// modules we use to download image from flickr link
const download = require('image-downloader');

// module to use couchdb database
const NodeCouchDb = require('node-couchdb');
const couch = new NodeCouchDb();

couch.listDatabases().then(function(dbs) {
    console.log(dbs);
});

// node module to access to couchdb database
var request=require('request');

//node module amqp (we use topics based queue)
var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);
var edificio=args[0];
var numero=args[1];
//var database="http://127.0.0.1:5984/"+edificio+"/cr"+numero;
//var database="http://127.0.0.1:5984/"+edificio+"/cr"+numero+"comments";
// edificio can be "spv" or "diag" for now

var optionsDown = {
  url: '',
  dest: ''
}

//call flickr API
var Flickr=require('flickrapi'),
    flickrOptions = {
      api_key: "KEY",
      secret: "SECRET",
      user_id: "139197130@N06"
    };


// Express for set up server
var app=require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

var info="";
var links=[];

app.get("/"+edificio+"/classroom"+numero, function(req,res) {
    // RETRIEVE CLASSROOM INFO
    couch.get(edificio,"cr"+numero).then(({data, headers, status}) => {
        // data is json response
        console.log(data);
            info="Name: "+data.name+" - Floor: "+data.floor+" - Seats: "+data.seats+
            " - Type: "+data.type+" - Desk Type: "+data.desk_type+" - Exits: "+data.exits+
            " - Board Type: "+data.board_type+" - Coat Hangers: "+data.coat_hangers+
            " - Projector: "+data.projector+" - Mic: "+data.mic+ " - Wi-Fi Signal: "+data.wi_fi;
            //RETRIEVE COMMENTS

            couch.get(edificio,"cr"+numero+"comments").then(({data, headers, status}) => {
                var i=0;
                var comms=data.comments;
                for (i=0;i<comms.length;i++) {
                    console.log(comms[i]);
                }
                // RETRIEVE PHOTO FROM FLICKR
                Flickr.tokenOnly(flickrOptions, function(error, flickr) {
                    flickr.photos.search({
                      user_id: flickr.options.user_id,
                      page: 1,
                      per_page: 100,
                      tags: numero
                    }, function(err, result) {
                      var ph_number=result.photos.total;
                      if (ph_number>10) ph_number=10;
                      console.log("Photos found": ph_number);
                      for (var i=0; i<ph_number; i++) {
                        var ph=result.photos.photo[i];
                        var link="https://farm"+ph.farm+".staticflickr.com/"+ph.server+"/"+ph.id+"_"+ph.secret+".jpg";
                        links.push(link);
                        optionsDown.url=link;
                        optionsDown.dest=__dirname+'/photo/'+ph.id+'.jpg';
                        download.image(optionsDown)
                            .then(({ filename, image }) => {
                                console.log('File saved to', filename)
                                images.push(image);
                            }).catch((err) => {
                                throw err
                            })
                      }
                      res.render('./pages/classroom.ejs', {
                          edif: edificio,
                          number: numero,
                          infos: info,
                          n_links: links.length,
                          image: links,
                          comm_length: comms.length,
                          comments: comms
                      });
                    });
                });
            });
    }, err => {
        console.log(err);
    });


});

app.post("/classroom"+numero, function(req,res) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'direct_logs';
            var msg = req.body.comment;
            console.log(msg);
            var severity =edificio.toString()+";"+numero.toString();

            ch.assertExchange(ex, 'direct', {durable: false});
            ch.publish(ex, severity, new Buffer(msg));
            console.log("Sent "+msg+" on queue with routing key: "+severity);
            res.redirect("/"+edificio+"/classroom"+numero);
        });
    });
});

var server=app.listen(3000,function(req,res) {
    console.log("App listen on port 3000");
    var host=server.address().address;
    var port=server.address().port;
});
