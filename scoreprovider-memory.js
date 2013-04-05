var scoreCounter = 1;

ScoreProvider = function(){};
ScoreProvider.prototype.dummyData = [];

ScoreProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

ScoreProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

ScoreProvider.prototype.save = function(scores, callback) {
  var score = null;

  if( typeof(scores.length)=="undefined")
    scores = [scores];

  for( var i =0;i< scores.length;i++ ) {
    score = scores[i];
    score._id = scoreCounter++;
    score.created_on = new Date();

    this.dummyData[this.dummyData.length]= score;
  }
  callback(null, scores);
};

/* Lets bootstrap with dummy data */
new ScoreProvider().save([
  {user: 'User1', value: 1000},
  {user: 'Mike', value: 10100},
  {user: 'Somebody', value: 2000}
], function(error, scores){});

exports.ScoreProvider = ScoreProvider;
