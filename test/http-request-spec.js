'use strict';

var http = require('http');
var q = require('q');
var request = require('request');

describe('HTTP', function() {

  var callElementor = function(url) {
    var deferred = q.defer();

    request(url, function(error, response, body) {
      if (error) {
        console.log("Got error: " + error);
        return deferred.reject(error);
      }
      deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
  };

  describe('Popup', function() {
    var callPopup = function(command) {
      var encodedUrl = 'http://localhost:13000/testSelector?popupInput=' +
          encodeURIComponent(command);

      return callElementor(encodedUrl);
    };

    it('should navigate to protractor website', function(done) {
      var url = 'browser.get(\'http://angular.github.io/protractor/#/api\')';

      // Given that you navigate to the protractor website.
      callPopup(url).then(function() {
        // When you get the current URL.
        return callPopup('browser.getCurrentUrl()');
      }).then(function(response) {
        // Then ensure the URL has changed.
        expect(response).toEqual({
          results: {
            'browser.getCurrentUrl()': 'http://angular.github.io/protractor/#/api'
          }
        });
        done();
      });
    });

    it('should transform by input into count expression', function(done) {
      // When you select by css.
      callPopup('by.css(\'#title\')').then(function(response) {
        // Then ensure the input is turned into count expression.
        expect(response).toEqual({
          results: {
            'element.all(by.css(\'#title\')).count()': '1'
          }
        });
        done();
      });
    });

    it('should get element text', function(done) {
      // When you get an element's text.
      var command = '$$(\'.navbar li\').first().getText()';
      callPopup(command).then(function(response) {
        // Then ensure there is text.
        expect(response).toEqual({
          results: {
            '$$(\'.navbar li\').first().getText()': 'Home'
          }
        });
        done();
      });
    });
  });

  describe('Devtools', function() {

    var findSuggestions = function(command) {
      var encodedUrl = 'http://localhost:13000/testSelector?locators=' +
          encodeURIComponent(command);

      return callElementor(encodedUrl);
    };

    it('should find suggestions', function(done) {
      var command = JSON.stringify({
        byCss: {
          nodeName: 'label',
          'for': 'searchInput'
        }
      });

      findSuggestions(command).then(function(response) {
        expect(response).toEqual({
          results: {
            'by.css(\'label[for="searchInput"]\')': '1'
          }
        });
        done();
      });
    });

    it('should find multiple suggestions', function(done) {
      var command = JSON.stringify({
        byCss: {
          nodeName: 'input',
          id: 'searchInput',
          class: 'form-control',
          type: 'search',
          placeholder: 'Enter name',
          'ng-model': 'searchTerm'
        },
        byId: 'searchInput',
        byModel: 'searchTerm'
      });

      findSuggestions(command).then(function(response) {
        expect(response).toEqual({
          results: {
            "by.css('#searchInput')": "1",
            "by.css('input.form-control')": "1",
            "by.css('.form-control')": "1",
            "by.css('input[type=\"search\"]')": "1",
            "by.css('input[placeholder=\"Enter name\"]')": "1",
            "by.css('input[ng-model=\"searchTerm\"]')": "1",
            "by.id('searchInput')": "1",
            "by.model('searchTerm')": "1"
          }
        });
        done();
      });
    });
  });
});
