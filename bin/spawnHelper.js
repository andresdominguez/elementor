var childProcess = require('child_process');
var q = require('q');

var runCommand = function(command) {
  var deferred = q.defer();

  console.log('Running command: [%s]', command);

  var commandArray = command.split(/\s/);

  // First arg: command, then pass arguments as array.
  var child = childProcess.spawn(commandArray[0], commandArray.slice(1));

  child.stdout.on('data', function(data) {
    console.log('Data', data.toString());
    deferred.resolve();
  });

  child.stderr.on('data', function(data) {
    console.log('Error', data.toString());
    deferred.reject(data.toString());
  });

  return deferred.promise;
};

module.exports = {
  runCommand: runCommand
};
