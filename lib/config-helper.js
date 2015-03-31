var _ = require('lodash');
var fs = require('fs');
var temp = require('temp');
var path = require('path');
var q = require('q');

var writeTempFile = function(fileContents) {
  var deferred = q.defer();

  // Automatically track and cleanup files at exit.
  temp.track();

  // Create the temporary protractor config file.
  temp.open('protractor-conf', function(err, info) {
    if (err) {
      console.log('Error creating protractor config file', err);
      throw Error('Error creating protractor config file');
    }
    fs.write(info.fd, fileContents);
    fs.close(info.fd, function(err) {
      if (err) {
        console.log('Error closing file', err);
        throw Error('Error closing file');
      }
    });
    deferred.resolve(info.path);
  });

  return deferred.promise;
};

var createProtractorConfig = function(options) {
  var onPrepare = '';
  if (options.url) {
    onPrepare += "browser.get('" + options.url + "');\n";
  }
  if (options.ignoreSynchronization) {
    onPrepare += 'browser.ignoreSynchronization = true;\n';
  }

  // Get the chrome extension path.
  var extensionPath = path.join(__dirname, '../extension'),
      chromeOptions = "'--load-extension=" + extensionPath + "'";

  var configPath = path.join(__dirname, './protractor.conf.js'),
      templateFile = fs.readFileSync(configPath, 'utf-8'),
      replaced = templateFile
          .replace(/\$PREPARE/g, onPrepare)
          .replace(/\$CHROME_OPTIONS/g, chromeOptions);

  return writeTempFile(replaced);
};

module.exports = {
  createProtractorConfig: createProtractorConfig
};

createProtractorConfig({
  ignoreSynchronization: true
});
