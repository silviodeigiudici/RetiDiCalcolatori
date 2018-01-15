module.exports = function(app, request, express){
    // modules we use to download image from flickr link
    const download = require('image-downloader');
    const routes = require('./routes.js'); //needs to get isLoggedIn function
    var optionsDown = {
      url: '',
      dest: ''
    }

    // module to use couchdb database
    const NodeCouchDb = require('node-couchdb');
    const couch = new NodeCouchDb();

    couch.listDatabases().then(function(dbs) {
        console.log(dbs);
    });

    //node module amqp (we use topics based queue)
    var amqp = require('amqplib/callback_api');

    //call flickr API
    var Flickr=require('flickrapi'),
        flickrOptions = {
          api_key: "0f2fd3e0083a9506dde252bb3087174f",
          secret: "cb8dd5f580d759e0",
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
                              console.log("Photos found: "+ph_number);
                              for (var i=0; i<ph_number; i++) {
                                var ph=result.photos.photo[i];
                                var link="https://farm"+ph.farm+".staticflickr.com/"+ph.server+"/"+ph.id+"_"+ph.secret+".jpg";
                                links.push(link);
                                optionsDown.url=link;
                                optionsDown.dest=__dirname+'/photo/'+ph.id+'.jpg';
                                download.image(optionsDown)
                                    .then(({ filename, image }) => {
                                        console.log('File saved to', filename)
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
                    }, err =>{
                        console.log(err);
                        res.redirect("/edificio?edificio="+edificio);
                    });
            }, err => {
                console.log(err);
                res.redirect("/edificio?edificio="+edificio);
            });
    });

    app.post("/aula", function(req,res) {
        amqp.connect('amqp://localhost', function(err, conn) {
            conn.createChannel(function(err, ch) {
                var ex = 'direct_logs';
                var msg = req.body.comment;
                console.log(msg);
                var severity =edificio.toString()+";"+numero.toString();

                ch.assertExchange(ex, 'direct', {durable: false});
                ch.publish(ex, severity, new Buffer(msg));
                console.log("Sent "+msg+" on queue with routing key: "+severity);
                res.redirect("/aula?edificio="+edificio+"&aula="+numero);
            });
        });
    });
}
