var Hapi = require('hapi');
var querystring = require('querystring');
var fs = require('fs');
var https = require('https');
var RateLimiter = require('limiter').RateLimiter;

//load yelp api v2.0 credentials
var credentials = JSON.parse(fs.readFileSync('credentials.json'));

var limiters = {};

function googlePlaceSearch(creds, params, callback) {
  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 
    querystring.stringify(params) +
    "&key=" + creds.key;
  https.get(
    url, 
    function(response) {
      response.on('data', function (data) {
        data = JSON.parse(data);
        callback(null, data, response);
      });
  }).on('error', function(err) {
    callback(err);
  });
}

function yelpBusiness(creds, id, callback) {
  var url = 'http://api.yelp.com/v2/business/' + id;
  https.get(
    url, 
    function(response) {
      data = JSON.parse(data);
      callback(error, data, response);
  }).on('error', function(err) {
    callback(err);
  });
}

// Config for our handlebars views
var options = {
    views: {
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    }
};

// Create a server with a host and port
var server = new Hapi.Server(+process.env.PORT || 8080, options);

// Search route
server.route({
  method: 'GET',
  path: '/',
  handler: function(req, reply) {
    reply.view("index", {});
  }
});

// Search route
server.route({
  method: 'GET',
  path: '/search',
  handler: function (req, reply) {
    if(!limiters[req.info.remoteAddress]) {
      limiters[req.info.remoteAddress] = new RateLimiter(100, 'hour', true);
    }
    limiters[req.info.remoteAddress].removeTokens(1, function(err, remainingRequests) {
      if(remainingRequests < 0) {
        reply('You have requested more than the allowed requests. Please wait for another hour before requesting again');
      } else {
        googlePlaceSearch(credentials, req.query, function(err, data, res) {
          reply(data);
        });
      }
    });
  }
});

// Business route
server.route({
  method: 'GET',
  path: '/business/{id}',
  handler: function (req, reply) {
    if(!limiters[req.info.remoteAddress]) {
      limiters[req.info.remoteAddress] = new RateLimiter(100, 'hour', true);
    }
    limiters[req.info.remoteAddress].removeTokens(1, function(err, remainingRequests) {
      if(remainingRequests < 0) {
        reply('You have requested more than the allowed requests. Please wait for another hour before requesting again');
      } else {
        yelpBusiness(credentials, req.params.id, function(err, data, res) {
          reply(data);
        });
      }
    });
  }
});

// styles
server.route({
    path: "/css/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./css",
            listing: false,
            index: false
        }
    }
});

// Start the server
server.start();
console.log('Listening on port ' + server.info.uri);