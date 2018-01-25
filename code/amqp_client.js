// module to use couchdb database
module.exports = function(){
    const NodeCouchDb = require('node-couchdb');
    const couch = new NodeCouchDb();

    //node module amqp (we use topics based queue)
    var amqp = require('amqplib/callback_api');

    var startup_flag=true;

    // array that stores comments
    var comms = [];
    var keys=["spv.24.*","spv.11.*","spv.40.*","diag.B2.*"];

    function updateComment(db,data,comment) {
        couch.update(db, {
            _id: data._id,
            _rev: data._rev,
            comments: comment
        }).then(({data, headers, status}) => {
            console.log(data)
        }, err => {
            console.log(err);
        });
    }

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'topic_logs';

            ch.assertExchange(ex, 'topic', {durable: false});

            ch.assertQueue('', {exclusive: true}, function(err, q) {
                console.log('[amqp_client.js] [*] Waiting for logs. To exit press CTRL+C');

                keys.forEach(function(severity) {
                    ch.bindQueue(q.queue, ex, severity);
                });

                ch.consume(q.queue, function(msg) {
                    var today=new Date();
                    var m=today.getMonth()+1;
                    console.log("[amqp_client.js] received ["+msg.fields.routingKey+"]: "+msg.content.toString());
                    var key=msg.fields.routingKey.split(".");
                    var db=key[0];
                    var cr_num=key[1];
                    var id="cr"+cr_num+"comments";
                    var rev="";
                    couch.get(db,id).then(({data, headers, status}) => {
                        if (startup_flag) {
                            comm=data.comments;
                            startup_flag=0;
                        }
                        var comment={
                                    "date": today.getDay()+"/"+m+"/"+today.getFullYear(),
                                    "hour": today.getHours()+":"+today.getMinutes()+";",
                                    "user": key[2],
                                    "comment": msg.content.toString()
                                    }
                        comm.push(comment);
                        updateComment(db,data,comm);
                    }, err => {
                        console.log("[amqp_client.js] "+err);
                    });
                }, {noAck: true});
            });
        });
    });
}
