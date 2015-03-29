var childProcess = require('child_process');
var q = require('q');

var runCommand = function(command) {
  var deferred = q.defer();

  console.log('Running command: [%s]', command);

  var commandArray = command.split(/\s/);

  // First arg: command, then pass arguments as array.
  var child = childProcess.spawn(commandArray[0], commandArray.slice(1));

  child.stdout.on('data', function(data) {
    var line = data.toString();
    process.stdout.write(line);

    // Wait until the port is ready to resolve the promise.
    if (line.match(/Server listening on/g)) {
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
