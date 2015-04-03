var configHelper = require('../lib/config-helper');
var fs = require('fs');
var path = require('path');

describe('config-helper', function() {

  describe('onPrepare', function() {

    var ensureOnPrepareMatches = function(filePath, expected) {
      // Read the file.
      var templateFile = fs.readFileSync(filePath, 'utf-8'),
          startIndex = templateFile.indexOf('onPrepare: function'),
          endIndex = templateFile.indexOf('}', startIndex),
          onPrepare = templateFile.substring(startIndex, endIndex);

      expect(onPrepare).toContain(expected);
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

    it('should ignore synchronization', function(done) {
      // When you create a configuration that ignores synchronization.
      var promise = configHelper.createProtractorConfig({
        ignoreSynchronization: true
      });

      // Then ensure onPrepare ignores synchronization.
      promise.then(function(path) {
        ensureOnPrepareMatches(path, 'browser.ignoreSynchronization = true;');
        done();
      });
    });
  });

  describe('chromeOptions', function() {

    var ensureChromeOptionsContains = function(filePath, expected) {
      // Read the file.
      var templateFile = fs.readFileSync(filePath, 'utf-8'),
          startIndex = templateFile.indexOf('chromeOptions'),
          endIndex = templateFile.indexOf('}', startIndex),
          onPrepare = templateFile.substring(startIndex, endIndex);

      expect(onPrepare).toContain(expected);
    };

    it('should resolve extension path', function(done) {
      // When you create a default config file.
      var promise = configHelper.createProtractorConfig({});

      // Then ensure the extension path was resolved.
      promise.then(function(file) {
        var extensionDir = path.resolve(__dirname, '../extension');
        ensureChromeOptionsContains(file,
            "'--load-extension=" + extensionDir + "'");
        done();
      });
    });

    it('should add chrome options', function(done) {
      // When you create a config file with chrome options.
      var promise = configHelper.createProtractorConfig({
        chromeOptions: '--remote-debugging-port=9222 --disable-web-security'
      });

      // Then ensure the options are passed to the output file.
      promise.then(function(file) {
        ensureChromeOptionsContains(file,
            "'--remote-debugging-port=9222', '--disable-web-security"
        );
        done();
      });
    });
  });
});
