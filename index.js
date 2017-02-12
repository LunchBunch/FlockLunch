var config = require('./config.js');
var flock = require('flockos');
var express = require('express');
var Mustache = require('mustache');
var bodyParser = require('body-parser');
var fs = require('fs');

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
  console.log(event.userId);
  console.log(event.token);
  console.log('app.install event');
  callback();
});

flock.events.on('client.slashCommand', function(event, callback) {
  
});

flock.events.on('', function() {
  
});

var listTemplate = fs.readFileSync('options.mustache.html', 'utf8');
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
  var body = Mustache.render(listTemplate, { restaurants: fakeRestaurants });
  res.send(body);
});

app.post('/options', function (req, res) {
  console.log('POST /options choice: ' + req.params.choice + ' --');
  console.log('POST /options choice: ' + req.body.choice + ' --');
});