var express = require('express');
var bodyParser = require('body-parser');
var ElementExplorerClient = require('./elementExplorerClient');

var startServer = function() {
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

  function handleDevToolsRequest(input, res) {
    console.log('Dev tools input', input);

    res.send('dev tool');
  }

// Open a server.
  var server = app.listen(13000, function() {


    console.log('Starting client');
    exClient = new ElementExplorerClient();

    console.log('Elementor is listening at http://localhost:%s',
        server.address().port);
  });
};

module.exports = {
  startServer: startServer
};
