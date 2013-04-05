var scoreCounter = 1;

scoreProvider = function(){};
scoreProvider.prototype.dummyData = [];

scoreProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

scoreProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

scoreProvider.prototype.save = function(scores, callback) {
  var score = null;

  if( typeof(scores.length)=="undefined")
    scores = [scores];

  for( var i =0;i< scores.length;i++ ) {
    score = scores[i];
    score._id = scoreCounter++;
    score.created_at = new Date();

    this.dummyData[this.dummyData.length]= score;
  }
  callback(null, scores);
};

/* Lets bootstrap with dummy data */
new scoreProvider().save([
  {user: 'User1', value: '1000'},
  {user: 'Mike', value: '10123'},
  {user: 'Somebody', value: '2000'}
], function(error, scores){});

exports.scoreProvider = scoreProvider;
