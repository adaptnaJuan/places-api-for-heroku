# Google Places API for Heroku

A diy-Google Places API for fun & not-profit.

Info:
* Built with [hapi.js](http://hapijs.com/)
* Templates driven by [Handlebars](http://handlebarsjs.com/)
* API request limiting with [limiter](https://github.com/jhurliman/node-rate-limiter)


## Getting Started
- Sign up for a Google account. https://accounts.google.com/SignUp
- Go to the Google API Console. https://code.google.com/apis/console/
- Create a Simple API Access key.
- Enable the Google Places API on your account.
- Copy the API Key into `credentials.json`
- `npm install` to install dependencies.
- After installing the heroku toolbelt, type `heroku create` in the directory
- `git push heroku master` deploys your app to your heroku account
- Visit your heroku site to view the root

## Tweaks

Change the amount of request limiting in `index.js`. Lines 73 & 93. Available interval options: 'hour', 'second', 'minute', 'day', or a number of milliseconds

    limiters[req.info.remoteAddress] = new RateLimiter(<number of requests>, <period of time>, true);

Modify the root template in `index.html`.

### Questions
* Reach me here: [@ryanmurakami](http://twitter.com/ryanmurakami)
