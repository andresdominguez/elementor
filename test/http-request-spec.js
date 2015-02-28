var http = require('http');
var q = require('q');
var request = require('request');

describe('HTTP', function() {

  var encode = function(command) {
    var host = 'http://localhost:13000/testSelector';
    return host + '?popupInput=' + encodeURIComponent(command);
  };

  var callElementor = function(command) {
    var deferred = q.defer();

    var url = encode(command);
    request(url, function(error, response, body) {
      if (error) {
        console.log("Got error: " + error);
        return deferred.reject(error);
      }
      deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
  };

  it('should navigate to protractor website', function(done) {
    var url = 'browser.get(\'http://angular.github.io/protractor/#/api\')';

    callElementor(url).then(function(response) {
      expect(response).toEqual({
        results: {
          'browser.get(\'http://angular.github.io/protractor/#/api\')': null
        }
      });
      return callElementor('browser.getCurrentUrl()');
    }).then(function(response) {
      expect(response).toEqual({
        results: {
          'browser.getCurrentUrl()': 'http://angular.github.io/protractor/#/api'
        }
      });
      done();
    });
  });
})
;
