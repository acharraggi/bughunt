
/**
 * Module dependencies.
 */

console.log('Start app.js for Bug Hunt');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
      process.nextTick(function () {
      // Find the user by username. If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message. Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

var ScoreProvider = require('./scoreprovider-mongodb').ScoreProvider;
var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'VISA Pencil San' }));
// Initialize Passport! Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var sp= new ScoreProvider('localhost', 27017);

app.get('/', function(req, res){
  res.render('index.jade', { pageTitle: 'Bug Hunt', user: req.user});
});

app.get('/top10', function(req, res){
  sp.findTop10( function(error, allScores) {
    res.render('top10.jade', { pageTitle: 'Bug Hunt',  scores:allScores,  user: req.user}  );
  });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account.jade', {pageTitle: 'Account', user: req.user});
});

app.get('/login', function(req, res){
    res.render('login.jade', { pageTitle: 'Login', user: req.user, message: req.session.messages}  );
});

// POST /login
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
//
// curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
/***** This version has a problem with flash messages
 * app.post('/login',
 * passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
 * function(req, res) {
 * res.redirect('/');
 * });
 * */

// POST /login
// This is an alternative implementation that uses a custom callback to
// acheive the same functionality.
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages = [info.message];
      return res.redirect('/login')
    }
    else {
      req.session.messages = '';
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Bug Hunt Express server listening on port ' + app.get('port'));
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};
 
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
