var config = require('./config.js');
var flock = require('flockos');
var express = require('express');
var Mustache = require('mustache');
var bodyParser = require('body-parser');
var fs = require('fs');
var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: config.consumerKeyYelp,
  consumer_secret: config.consumerSecretYelp,
  token: config.tokenYelp,
  token_secret: config.tokenSecretYelp
});

flock.appId = config.appId;
flock.appSecret = config.appSecret;

var app = express();
app.use(flock.events.tokenVerifier);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/events', flock.events.listener);

app.listen(8080, function() {
  console.log('Listening on 8080');
});

flock.events.on('app.install', function(event, callback) {
  console.log('userId: ' + event.userId);
  console.log('token: ' + event.token);
  console.log('app.install event');
  store.saveToken(event.userId, event.token);
  callback();
});

flock.events.on('client.slashCommand', function(event, callback) {
  
});

flock.events.on('', function() {
  
});

var listTemplate = fs.readFileSync('options.mustache.html', 'utf8');
var first5Restaurants = [];
app.get('/options', function (req, res) {
  console.log('GET /options');
  var event = JSON.parse(req.query.flockEvent);
  var fakeRestaurants = [
    { 'option': 'Italian' },
    { 'option': 'French' },
    { 'option': 'American' },
    { 'option': 'Brazilian' },
    { 'option': 'Greek' }
  ];
  res.set('Content-Type', 'text/html');
  
  var body = Mustache.render(listTemplate, { restaurants: fakeRestaurants, resultSearch: first5Restaurants });
  res.send(body);
});
app.post('/options', function (req, res) {
  // storage.saveToken(userIdw, tokenIdw, req.params.choice );
  console.log('POST /options choice: ' + req.params.choice + ' --');
  console.log('POST /options choice: ' + req.body.choice + ' --');

  // TODO add a process to calculate which restaurants are winners.
  

  yelp.search({
    term: 'food ' + req.body.choice,
    location: 'San Francisco'
  }).then(function (data) {    
    var fakeRestaurants = [
      { 'option': 'Italian' },
      { 'option': 'French' },
      { 'option': 'American' },
      { 'option': 'Brazilian' },
      { 'option': 'Greek' }
    ];
    first5Restaurants = data.businesses;
    console.log(data.businesses[0]);
    res.set('Content-Type', 'text/html');
    var body = Mustache.render(listTemplate, { restaurants: fakeRestaurants, resultSearch: first5Restaurants });
    res.send(body);
  }).catch(function (err) {
    console.error(err);
  });
});