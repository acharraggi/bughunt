var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ScoreProvider = function(host, port) {
  this.db= new Db('node-mongo-highScores', new Server(host, port, {auto_reconnect: true}, {}), {safe:false});
  this.db.open(function(){});
};


ScoreProvider.prototype.getCollection= function(callback) {
  this.db.collection('highScores', function(error, score_collection) {
    if( error ) callback(error);
    else callback(null, score_collection);
  });
};

ScoreProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, score_collection) {
      if( error ) callback(error)
      else {
        score_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


ScoreProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, score_collection) {
      if( error ) callback(error)
      else {
        score_collection.findOne({_id: score_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

ScoreProvider.prototype.save = function(highScores, callback) {
    this.getCollection(function(error, score_collection) {
      if( error ) callback(error)
      else {
        if( typeof(highScores.length)=="undefined")
          highScores= [highScores];

        for( var i =0;i< highScores.length;i++ ) {
          score = highScores[i];
          score.created_on = new Date();
        }

        score_collection.insert(highScores, function() {
          callback(null, highScores);
        });
      }
    });
};

/* Lets bootstrap with dummy data */
//new ScoreProvider().save([
//  {user: 'Mike', score: '30000'},
//  {user: 'Mike', score: '10000'}
//], function(error, scores){});

exports.ScoreProvider = ScoreProvider;

