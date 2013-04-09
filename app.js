
/**
 * Module dependencies.
 */

console.log('Start app.js for Bug Hunt');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var ScoreProvider = require('./scoreprovider-mongodb').ScoreProvider;
var app = express();

console.log('after require for /scoreprovider-mongodb');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);

console.log('about to call new ScoreProvider');

var sp= new ScoreProvider('localhost', 27017);

//bootstrap some data
//sp.save([
//  {user: 'Mike', value: 30000},
//  {user: 'Mike', value: 10000}
//], function(error, scores){});

app.get('/', function(req, res){
  sp.findAll( function(error, allScores) {
    res.render('index.jade', { pageTitle: 'Bug Hunt',  scores:allScores}  );
  //  res.render('index.jade', { locals: {
  //    pageTitle: 'Bug Hunt',
  //    scores:allScores}  });
    //res.send(allScores);
  });
});

//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
