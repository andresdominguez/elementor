'use strict';

var net = require('net');
var q = require('q');

/**
 * Run a command on protractor by sending it through port 6969.
 * @param {string} cmd Command to execute.
 * @return {Q.promise} A promise that resolves to the command result.
 */
var runCommand = function(cmd) {
  var deferred = q.defer();

  var client = net.connect({port: 6969}, function() {
    console.log('Connected. Sending command:', cmd);
    // Terminate with ENTER.
    client.write(cmd + '\r\n');
  });

  client.on('data', function(data) {
    client.end();
    // Get rid of the carriage return.
    deferred.resolve((data.toString() || '').replace(/\r\n$/, ''));
  });

  return deferred.promise;
};

module.exports = {
  runCommand: runCommand
};
