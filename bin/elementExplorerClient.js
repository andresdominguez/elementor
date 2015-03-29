var net = require('net');
var q = require('q');

var runCommand = function(cmd) {
  var deferred = q.defer();

  //cmd= "browser.get('http://angular.github.io/protractor/#/');\r\n";

  // Terminate with ENTER.
  cmd += '\r\n';

  var client = net.connect({port: 6969}, function() {
    console.log('Connected. Sending command:', cmd);
    client.write(cmd);
  });

  client.on('data', function(data) {
    //client.end();
    deferred.resolve(data.toString());
  });

  return deferred.promise;
};

var getSuggestions = function() {
};

module.exports = {
  runCommand: runCommand
};
