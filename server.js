var express = require("express");
var app = express();
var settings = require('./settings');
var io = require('socket.io').listen(app.listen(settings.appPort));
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.static( __dirname + '/views'));
    app.use(express.errorHandler());
    app.set('view engine', 'jade');
    app.engine('.jade', require('jade').__express);
});

app.get('/', function(req, res) {
    MongoClient.connect(settings.mongoDBURL, function(err, db) {
        assert.equal(null, err);
        findElements(db, function(err, image) {
            assert.equal(null, err);
            if (image) {
                res.render('eval', image);
            } /*else {
                res.status(500).send(err);
            }*/
            res.end();
            db.close();
        });
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('event', function(data){
        (function(dataa) {
            MongoClient.connect(settings.mongoDBURL, function(err, db) {
                assert.equal(null, err);
                updateElements(db, dataa.id, dataa.value);
                
                findElements(db, function(err, image) {
                    assert.equal(null, err);
                    if (image) {
                        socket.emit('newimage', { id: image._id, uri: image.uri});
                    }
                    db.close();
                });
            });
        })(data);
    });
});

var findElements = function(db, callback) {
    var cursor = db.collection(settings.collection_MongoDB).find({"gt": {$eq: ""}}).limit(1);
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        callback(err,doc);
    });
};

var updateElements = function(db, id, value) {
    db.collection(settings.collection_MongoDB).updateOne(
        { '_id': ObjectID(id)  },
        {
            $set: { gt: value }
        }
    );
};

console.log("Listening on port " + settings.appPort);