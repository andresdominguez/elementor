var elementorApp = angular.module('elementorApp', ['ngResource']);

// HTTP resource to call the element explorer's server.
elementorApp.factory('locatorTester', function($resource) {
  var testSelector = $resource('http://localhost:13000/testSelector');

  return {
    get: function(input) {
      return testSelector.get({popupInput: input}).$promise;
    }
  };
});

// A service to persist the locator history when you close the popup.
elementorApp.factory('history', function() {
  var bgPage = chrome.extension.getBackgroundPage();

  return {
    save: function(history) {
      bgPage.saveHistory(angular.copy(history));
    },
    restore: function(app) {
      app.history = bgPage.getLocatorHistory();
    }
  };
});

elementorApp.controller('LocatorCtrl', function($scope, history, locatorTester) {
  var app = this,
      maxElements = 50;

  // Restore the history, if there is any.
  history.restore(app);

  // Copy a history into the input field.
  app.copyToInput = function(row) {
    app.locator = row.expression;
  };

  // Get the url of the current tab and send it to the element explorer.
  app.syncUrl = function() {
    chrome.tabs.getSelected(null, function(tab) {
      locatorTester.get('browser.get(\'' + tab.url + '\')');
    });
  };

  // Clear the history list.
  app.clearHistory = function() {
    app.history = [];
    history.save(app.history);
  };

  // Remove an element.
  app.remove = function(index) {
    app.history.splice(index, 1);
    history(app.history);
  };

  // Test the locator.
  app.testLocator = function() {
    locatorTester.get(app.locator).then(function(data) {
      // Add results to history.
      angular.forEach(data.results, function(result, expression) {
        app.history.unshift({
          expression: expression,
          result: result
        });
      });

      // Check for max length.
      if (app.history.length > maxElements) {
        app.history.length = maxElements;
      }
      history.save(app.history);
    });
  };
});
