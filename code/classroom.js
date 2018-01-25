var info="";
var links=[];
var edificio="";
var numero="";
const flickrOptions=require("./Secrets").flickr;

var send_page=function(req,res,couch,Flickr) {
  edificio=req.query.edificio;
  numero=req.query.aula;
  // RETRIEVE CLASSROOM INFO
  couch.get(edificio,"cr"+numero).then(({data, headers, status}) => {
    //RETRIEVE COMMENTS

    couch.get(edificio,"cr"+numero+"comments").then(({data, headers, status}) => {
      var i=0;
      var comms=data.comments;
      // RETRIEVE PHOTO FROM FLICKR
      var tag=edificio+numero+"";
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
          res.render('../views/classroom.ejs', {
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
}

var send_comment= function(req,res,amqp) {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'topic_logs';
      var msg = req.body.comment;
      var username;
      if(req.isAuthenticated()){
        if(req.user.local){
          username = req.user.local.username;
        }
        else {
          username = req.user.google.name;
        }
      }
      var severity =edificio.toString()+"."+numero.toString()+"."+username;

      ch.assertExchange(ex, 'topic', {durable: false});
      ch.publish(ex, severity, new Buffer(msg));
      console.log("[classroom.js] Sent "+msg+" on queue with topic: "+severity);
      res.redirect("/aula?edificio="+edificio+"&aula="+numero);
    });
  });
}

module.exports.send_page=send_page;
module.exports.send_comment=send_comment;
