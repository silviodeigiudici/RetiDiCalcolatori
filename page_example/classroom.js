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
//var comments="http://127.0.0.1:5984/comments/comments_"+edificio+numero;
//var comm = [];
// edificio can be "spv" or "diag" for now
var countField=0;

var optionsDown = {
  url: '',
  dest: ''
}

//call flickr API
var Flickr=require('flickrapi'),
    flickrOptions = {
      api_key: "YOUR_KEY",
      secret: "YOUR_SECRET",
      user_id: "139197130@N06"
    };


// Express for set up server
var app=require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/classroom"+numero, function(req,res) {
    couch.get(edificio,"cr"+numero).then(({data, headers, status}) => {
        // data is json response
        console.log(data);
        var info="Name: "+data.name+" - Floor: "+data.floor+" - Seats: "+data.seats+
                " - Type: "+data.type+" - Desk Type: "+data.desk_type+" - Exits: "+data.exits+
                " - Board Type: "+data.board_type+" - Coat Hangers: "+data.coat_hangers+
                " - Projector: "+data.projector+" - Mic: "+data.mic+ " - Wi-Fi: "+data.wi_fi+
                " - Comments: "+data.comments;
        res.send(info);
        // status is statusCode number
        console.log("StatusCode: "+status);
    }, err => {
        console.log(err);
    });
});


app.get("/classroom"+numero+"/photo", function(req,res) {
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photos.search({
          user_id: flickr.options.user_id,
          page: 1,
          per_page: 100,
          tags: numero.toString()
        }, function(err, result) {
          var ph_number=result.photos.total;
          if (ph_number>10) ph_number=10;
          console.log(ph_number);
          for (var i=0; i<ph_number; i++) {
            var ph=result.photos.photo[i];
            var link="https://farm"+ph.farm+".staticflickr.com/"+ph.server+"/"+ph.id+"_"+ph.secret+".jpg";
            optionsDown.url=link;
            optionsDown.dest=__dirname+'/photo/'+ph.id+'.jpg';
            download.image(optionsDown)
                .then(({ filename, image }) => {
                    console.log('File saved to', filename)
                }).catch((err) => {
                    throw err
                })
            console.log(link);
          }
          });
    });
});
/*
function getRev(id) {
    couch.get(edificio,id).then(({data, headers, status}) => {
        var rev=data._rev;
        console.log("StatusCode: "+status);
    }, err => {
        console.log(err);
    });
    return rev;
}

function updateComment(db,id,rev,commment) {
    couch.update(db, {
        _id: id,
        _rev: rev
        comments: comment,
    }).then(({data, headers, status}) => {
        console.log(data)
    }, err => {
        console.log(err);
    });
}

app.get("/classroom"+numero+"/comments", function(req,res) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'direct_logs';

            ch.assertExchange(ex, 'direct', {durable: false});

            ch.assertQueue('', {exclusive: true}, function(err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C');

                args.forEach(function(severity) {
                    ch.bindQueue(q.queue, ex, severity);
                });

                ch.consume(q.queue, function(msg) {
                    var today=new Date();
                    console.log("["+msg.fields.routingKey+"]: "+msg.content.toString());
                    var id="cr"+numero;
                    var rev=getRev(id);
                    var comment={
                                "date": today.getDay()+"/"+today.getMonth()+"/"+today.getFullYear(),
                                "hour": today.getHours()+":"+today.getMinutes()+";",
                                "user": "nil",
                                "comment": msg.content.toString()
                                }
                    comm.push(comment);
                    updateComment(edificio,id,rev,comm);
                    res.send("["+msg.fields.routingKey+"]: "+msg.content.toString());
                }, {noAck: true});
            });
        });
    });
});


app.post("/classroom"+numero+"/comments", function(req,res) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'direct_logs';
            var msg = req.body.data;
            console.log(req.body.data);
            var severity =numero.toString();

            ch.assertExchange(ex, 'direct', {durable: false});
            ch.publish(ex, severity, new Buffer(msg));
            console.log(" [x] Sent %s: '%s'", severity, msg);
            res.send(" [x] Sent %s: '%s'", severity, msg)
        });
    });
});
*/
var server=app.listen(3000,function(req,res) {
    console.log("App listen on port 3000");
    var host=server.address().address;
    var port=server.address().port;
});
