'use strict';

var config = require('config'),
    url = require('url'),
    netrc = require('netrc')(),
    App = require('./App'),
    endpoint = config.get('endpoint'),
    parsedEndpoint = url.parse(endpoint.url),
    netrcAuth = netrc[parsedEndpoint.hostname],
    app, opts;

opts = {
   endpoint: {
      url: endpoint.url,
   },
};

if (endpoint.auth) {
   opts.endpoint.auth = {
      username: endpoint.auth.username,
      password: endpoint.auth.password,
   };
} else if (netrcAuth) {
   opts.endpoint.auth = {
      username: netrcAuth.login,
      password: netrcAuth.password,
   };
}

app = new App(opts);

app.fetchAndPutMenu().done();
