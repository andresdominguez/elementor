var express = require('express');
var bodyParser = require('body-parser');
var ElementExplorerClient = require('./elementExplorerClient');
var cliHelper = require('./cliHelper');

var startExpress = function() {
  var exClient;

  var app = express();
  app.use(bodyParser.json());

  app.get('/testSelector', function(req, res) {
    var query = req.query;

    if (query.popupInput) {
      return handlePopupRequest(query.popupInput, res);
    }

    console.log('Got', query);
    res.send('Hello World!');
  });

  function handlePopupRequest(input, res) {
    console.log('popup input', input);

    exClient.runCommand(input).then(function(response) {
      res.send(response);
    });
  }

  var server = app.listen(13000, function() {
    console.log('Starting client');
    exClient = new ElementExplorerClient();

    console.log('Elementor is listening at http://localhost:%s',
        server.address().port);
  });
};

var startProtractor = function() {
  console.log('Starting protractor');

  var protractorPromise = cliHelper.startProtractor();

  protractorPromise.then(function() {
    console.log('Protractor started');
    console.log('Starting elementor server');
  });

  protractorPromise.catch(function(error) {
    console.log('Error starting protractor', e);
  });

  return protractorPromise;
};

var startServer = function() {
  startProtractor().then(function() {
    startExpress();
  });
};

module.exports = {
  start: startServer
};
