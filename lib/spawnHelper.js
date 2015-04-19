'use strict';

var childProcess = require('child_process');
var q = require('q');

/**
 * Spawn a child process given a command. Wait for the process to start given
 * a regexp that will be matched against stdout.
 *
 * @param {string} command The command to execute.
 * @param {RegExp} waitRegexp An expression used to test when the process has
 *     started.
 * @return {Q.promise} A promise that resolves when the process has stated.
 */
var runCommand = function(command, waitRegexp) {
  var deferred = q.defer();

  console.log('Running command: [%s]', command);

  var commandArray = command.split(/\s/);

  // First arg: command, then pass arguments as array.
  var child = childProcess.spawn(commandArray[0], commandArray.slice(1));

  child.stdout.on('data', function(data) {
    var line = data.toString();
    process.stdout.write(line);

    // Wait until the port is ready to resolve the promise.
    if (line.match(waitRegexp)) {
      deferred.resolve();
    }
  });

  // The process uses stderr for debugging info. Ignore errors.
  child.stderr.on('data', process.stderr.write);

  return deferred.promise;
};

module.exports = {
  runCommand: runCommand
};
