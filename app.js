
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

var sp= new ScoreProvider('localhost', 27017);

app.get('/', function(req, res){
  sp.findTop10( function(error, allScores) {
    res.render('index.jade', { pageTitle: 'Bug Hunt',  scores:allScores}  );
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Bug Hunt Express server listening on port ' + app.get('port'));
});
 
/*  couldnt get crossdomain.xml to serve from express or from public as static
 *  went back to using server8080
 *
app.get('/top10/crossdomain.xml', function(req,res) {
   res.writeHead(200, {"Content-Type": "text/x-cross-domain-policy"});
   res.write('<?xml version="1.0" ?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>');
   res.end();
});

app.get('/top10', function(req, res) {
    sp.findAll( function(error, allScores) {
      res.writeHead(200, {"Content-Type": "text/plain"});
      for( var i =0;i< allScores.length;i++ ) {
          res.write(allScores[i].user+", "+allScores[i].value+", "+
              allScores[i].created_on.toDateString()+"\n");
      }
      res.end();
    });
});
***/


// stuff no longer used
//
//bootstrap some data
//sp.save([
//  {user: 'Mike', value: 30000},
//  {user: 'Mike', value: 10000}
// ], function(error, scores){});
