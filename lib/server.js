'use strict';

var bodyParser = require('body-parser');
var chalk = require('chalk');
var cliHelper = require('./cliHelper');
var explorerClient = require('./elementExplorerClient');
var express = require('express');
var locatorFinder = require('./locatorFinder');

var encode = function(results) {
  return {results: results};
};

var handlePopupRequest = function(input, res) {
  // If the popup input starts with 'by' then execute a count expression.
  if (/^by/.test(input)) {
    input = 'element.all(' + input + ').count()';
  }

  console.log('Popup input [%s]', input);

  explorerClient.runCommand(input).then(function(response) {
    var results = {};
    results[input] = response;

    res.send(encode(results));
  });
};

var handleDevTools = function(devtoolsInput, res) {
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

    var suggestion = suggestionList[index],
        input = suggestion.countExpression;
    explorerClient.runCommand(input).then(function(response) {
      locatorResults[suggestion.locator] = response;
      testNext(index + 1);
    });
  }
  testNext(0);
};

var startExpress = function(options) {
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

  var server = app.listen(13000, function() {
    console.log(chalk.blue('Elementor is listening on http://localhost:%s'),
        server.address().port);

    if (options.url || options.ignoreSynchronization) {
      var commands = '';

      if (options.ignoreSynchronization) {
        console.log(chalk.blue('Running elementor in non-angular mode.'));
        commands += 'browser.ignoreSynchronization = true;';
      }

      if (options.url) {
        console.log(chalk.blue('Getting page at:', options.url));
        commands += "browser.get('" + options.url + "');";
      }

      // TODO: Improve the waiting code.
      setTimeout(function getUrl() {
        explorerClient.runCommand(commands).then(function() {
          console.log(chalk.green('Elementor is ready!'));
        });
      }, 2000);
    } else {
      console.log(chalk.green('Elementor is ready!'));
    }
  });
};

/**
 * Start protractor process, then start the elementor server.
 */
var start = function(options) {
  cliHelper.startProtractor(options).then(function() {
    console.log(chalk.green('Done starting protractor'));
    console.log(chalk.blue('Starting elementor'));
    startExpress(options);
  });
};

module.exports = {
  start: start
};
