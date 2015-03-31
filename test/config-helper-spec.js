var configHelper = require('../lib/config-helper');
var fs = require('fs');

describe('config-helper', function() {

  var ensureOnPrepareMatches = function(filePath, expected) {
    // Read the file
    var templateFile = fs.readFileSync(filePath, 'utf-8'),
        startIndex = templateFile.indexOf('onPrepare: function'),
        endIndex = templateFile.indexOf('}', startIndex),
        onPrepare = templateFile.substring(startIndex, endIndex);

    expect(onPrepare).toMatch(expected);
  };

  it('should go to url', function(done) {
    // When you create a configuration with url.
    var promise = configHelper.createProtractorConfig({
      url: 'https://www.google.com'
    });

    // Then ensure onPrepare has a browser.get
    promise.then(function(path) {
      ensureOnPrepareMatches(path, "browser.get('https://www.google.com');");
      done();
    })
  });
});
