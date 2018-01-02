// module to take parameters from POST
var bodyParser = require('body-parser')


// modules we use to download image from flickr link
const download = require('image-downloader');

// node module to access to couchdb database
var request=require('request');

//node module amqp (we use topics based queue)
var amqp = require('amqplib/callback_api');

var database='http://127.0.0.1:5984/databaseaule/aula'+numero;
var args = process.argv.slice(2);
var numero=args[0];

var optionsDown = {
  url: '',
  dest: ''
}

//call flickr API
var Flickr=require('flickrapi'),
    flickrOptions = {
      api_key: "YOUR_API",
      secret: "YOUR_SECRET",
      user_id: "139197130@N06"
    };

// array to store all image link found
var array = [];

// Express for set up server
var app=require('express')();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.get("/classroom"+numero, function(req,res) {
    request(database, function(err, ress, body) {
        var classroom_info = JSON.parse(body);
        res.send(classroom_info);
    });
});


app.post("/classroom"+numero+"/photo", function(req,res) {
    console.log("Tag: "+req.body.tag);
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photos.search({
          user_id: flickr.options.user_id,
          page: 1,
          per_page: 100,
          tags: req.body.tag // chiostro is an example (it should be {}
        }, function(err, result) {
          var ph_number=result.photos.total;
          if (ph_number>10) ph_number=10;
          console.log(ph_number);
          for (var i=0; i<ph_number; i++) {
            var ph=result.photos.photo[i];
            console.log(ph);
            res.send(ph);
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
            array.push(link);
          }
          console.log(array);
          });
    });
});

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
                    console.log("["+msg.fields.routingKey"]+: "+msg.content.toString());
                    res.send("["+msg.fields.routingKey"]+: "+msg.content.toString());
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

var server=app.listen(3000,function(req,res) {
    console.log("Server liste on port 3000");
    var host=server.address().address;
    var port=server.address().port;
});
