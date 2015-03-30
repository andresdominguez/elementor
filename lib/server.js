var bodyParser = require('body-parser');
var cliHelper = require('./cliHelper');
var elementExplorerClient = require('./elementExplorerClient');
var express = require('express');
var locatorFinder = require('./locatorFinder');

var startExpress = function() {
  var app = express();
  app.use(bodyParser.json());

  var encode = function(results) {
    return {results: results};
  };

  app.get('/testSelector', function(req, res) {
    var query = req.query;

    if (query.popupInput) {
      return handlePopupRequest(query.popupInput, res);
    }

    if (query.locators) {
      return handleDevTools(query.locators, res);
    }

    res.send(encode({error: 'Invalid input'}));
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

      res.send(encode(results));
    });
  }

  function handleDevTools(devtoolsInput, res) {
    var locatorResults = {},
        locators = JSON.parse(devtoolsInput),
        suggestionList = locatorFinder.buildLocatorList(locators);

    console.log('Testing suggestions', suggestionList);

    function testNext(index) {
      // Is it done testing locators?
      if (index === suggestionList.length) {
        console.log('Done testing suggestions, returning', locatorResults);
        return res.send(encode(locatorResults));
      }

      var input = suggestionList[index].countExpression;
      elementExplorerClient.runCommand(input).then(function(response) {
        locatorResults[input] = response;
        testNext(index + 1);
      });
    }
    testNext(0);
  }

  var server = app.listen(13000, function() {
    console.log('Elementor is listening on http://localhost:%s',
        server.address().port);
  });
};

var startServer = function() {
  cliHelper.startProtractor().then(function() {
    console.log('Done starting protractor');
    startExpress();
  });
};

module.exports = {
  start: startServer
};
