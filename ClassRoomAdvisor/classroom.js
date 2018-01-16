module.exports = function(app, request, express){
    const routes = require('./routes.js'); //needs to get isLoggedIn function

    // module to use couchdb database
    const NodeCouchDb = require('node-couchdb');
    const couch = new NodeCouchDb();

    couch.listDatabases().then(function(dbs) {
        console.log("[classroom.js] "+dbs);
    });

    //node module amqp (we use topics based queue)
    var amqp = require('amqplib/callback_api');

    //call flickr API
    var Flickr=require('flickrapi'),
        flickrOptions = {
          api_key: "API_KEY",
          secret: "SECRET",
          user_id: "139197130@N06"
        };


    var info="";
    var links=[];
    var edificio="";
    var numero="";

    //app.use(express.static('./views')); //to use files of web pages

    app.get("/aula",routes.isLoggedIn, function(req,res) {
            var id_user;
            if(req.user.local) {
              id_user = req.user.local.username; //user is logged with local passport
            }
            else {
              id_user = req.user.google.name; //user is logged with oauth
            }
            require('./amqp_client.js')(id_user);
            edificio=req.query.edificio;
            numero=req.query.aula;
            // RETRIEVE CLASSROOM INFO
            couch.get(edificio,"cr"+numero).then(({data, headers, status}) => {
                // data is json response
                console.log("[classroom.js] "+data);
                    info="Name: "+data.name+" - Floor: "+data.floor+" - Seats: "+data.seats+
                    " - Type: "+data.type+" - Desk Type: "+data.desk_type+" - Exits: "+data.exits+
                    " - Board Type: "+data.board_type+" - Coat Hangers: "+data.coat_hangers+
                    " - Projector: "+data.projector+" - Mic: "+data.mic+ " - Wi-Fi Signal: "+data.wi_fi;
                    //RETRIEVE COMMENTS

                    couch.get(edificio,"cr"+numero+"comments").then(({data, headers, status}) => {
                        var i=0;
                        var comms=data.comments;
                        for (i=0;i<comms.length;i++) {
                            console.log("[classroom.js] "+comms[i]);
                        }

                        // RETRIEVE PHOTO FROM FLICKR
                        var tag=edificio+numero+"";
                        console.log("[classroom.js] "+tag);
                        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
                            flickr.photos.search({
                              user_id: flickr.options.user_id,
                              page: 1,
                              per_page: 100,
                              tags: tag
                            }, function(err, result) {
                              var ph_number=result.photos.total;
                              if (ph_number>10) ph_number=10;
                              console.log("[classroom.js] Photos found: "+ph_number);
                              for (var i=0; i<ph_number; i++) {
                                var ph=result.photos.photo[i];
                                var link="https://farm"+ph.farm+".staticflickr.com/"+ph.server+"/"+ph.id+"_"+ph.secret+".jpg";
                                links.push(link);
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
                              links=[];
                          });
                        });
                    }, err =>{
                        console.log("[classroom.js] "+err);
                        res.redirect("/edificio?edificio="+edificio);
                    });
            }, err => {
                console.log("[classroom.js] "+err);
                res.redirect("/edificio?edificio="+edificio);
            });
    });

    app.post("/aula", function(req,res) {
        amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
                var ex = 'direct_logs';
                var msg = req.body.comment;
                console.log("[classroom.js] "+msg);
                var severity =edificio.toString()+";"+numero.toString();

                ch.assertExchange(ex, 'direct', {durable: false});
                ch.publish(ex, severity, new Buffer(msg));
                console.log("[classroom.js] Sent "+msg+" on queue with routing key: "+severity);
                res.redirect("/aula?edificio="+edificio+"&aula="+numero);
            });
        });
    });
}
