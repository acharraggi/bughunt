var http = require("http");
var ScoreProvider = require('./scoreprovider-mongodb').ScoreProvider;
var sp= new ScoreProvider('localhost', 27017);

function onRequest(request,response) {
  //console.log("Request received.");
  console.log(request.url);

  if(request.url == '/crossdomain.xml') {
    response.writeHead(200, {"Content-Type": "text/x-cross-domain-policy"});
    response.write('<?xml version="1.0" ?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>');
    response.end();
  }
  else if(request.url == '/top10') {
    sp.findTop10( function(error, allScores) {
      response.writeHead(200, {"Content-Type": "text/plain"});
      for( var i =0;i< allScores.length;i++ ) {
          response.write(allScores[i].user+","+allScores[i].value+","+allScores[i].created_on.toDateString()+"\n");
      }
      response.end();
    });  
  }
  else if(request.url == '/saveScore') {
      if (request.method == 'POST') {
        //console.log("[200] " + request.method + " to " + request.url);
        var fullBody = '';

        request.on('data', function(chunk) {
          // append the current chunk of data to the fullBody variable
          fullBody += chunk.toString();
        });
        request.on('end', function() {
          //console.log(fullBody);
          response.writeHead(200, "OK", {'Content-Type': 'text/html'});
          response.end();
          var newScore = fullBody.split(',');
          //console.log(newScore);
          sp.save([ {user: newScore[0], value: parseInt(newScore[1]) }],
             function(error, scores){});
        });
      }
      else {
        console.log("[405] " + request.method + " to " + request.url);
        response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
        response.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
      }
  }
  else {  /* invalid request */
    response.writeHead(404);
    response.end();
  }
}
http.createServer(onRequest).listen(8080);
 
console.log("server8080 Bug Hunt Game Server started.");
