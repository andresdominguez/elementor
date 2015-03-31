var _ = require('lodash');
var fs = require('fs');
var temp = require('temp');
var util = require('util');
var path = require('path');
var q = require('q');

var configPath = path.join(__dirname, './protractor.conf.js');

var writeTempFile = function(fileContents) {
  var deferred = q.defer();

  // Automatically track and cleanup files at exit.
  temp.track();

  // Process the data (note: error handling omitted)
  temp.open('myprefix', function(err, info) {
    if (err) {
      console.log('Error creating protractor config file', err);
      throw Error('Error creating protractor config file');
    }
    fs.write(info.fd, fileContents);
    fs.close(info.fd, function(err) {
      if(err) {
        console.log('Error closing file', err);
        throw Error('Error closing file');
      }
    });
    deferred.resolve(info.path);
  });

  return deferred.promise;
};

var createProtractorConfig = function(options) {


  _.defaults(options, {
    url: '',
    ignoreSynchronization: false,
    chromeOptions: {
      args: ['--load-extension=' + path.join(__dirname, '../extension')]
    }
  });

  var templateFile = fs.readFileSync(configPath, 'utf-8');

  var onPrepare = '';
  if (options.url) {
    onPrepare += "browser.get('" + options.url + "');\n";
  }
  if (options.ignoreSynchronization) {
    onPrepare += 'browser.ignoreSynchronization = true;\n';
  }

  var replaced = templateFile.replace(/\$PREPARE/g, onPrepare);

  //console.log(
  //    templateFile.replace(/\$PREPARE/g, onPrepare)
  //        .trim());

  return writeTempFile(replaced);
};

module.exports = {
  createProtractorConfig: createProtractorConfig
};

createProtractorConfig({
  ignoreSynchronization: true
});
