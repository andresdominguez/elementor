var express = require('express');
var bodyParser = require('body-parser');
var elementExplorerClient = require('./elementExplorerClient');
var cliHelper = require('./cliHelper');

var startExpress = function() {
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
    // If the popup input starts with 'by' then execute a count expression.
    if (/^by/.test(input)) {
      input = 'element.all(' + input + ').count()';
    }

    console.log('Popup input [%s]', input);

    elementExplorerClient.runCommand(input).then(function(response) {
      var results = {};
      results[input] = response;

      res.send(JSON.stringify({
        results: results
      }));
    });
  }

  var server = app.listen(13000, function() {
    console.log('Elementor is listening on http://localhost:%s',
        server.address().port);
  });
};

var startProtractor = function() {
  return cliHelper.startProtractor();
};

var startServer = function() {
  startProtractor().then(function() {
    console.log('Done starting protractor');
    startExpress();
  });
};

module.exports = {
  start: startServer
};
