var q = require('q');
var childProcess = require('child_process');

var CLI_PATH = 'node /Users/andresdom/dev/protractor/lib/cli.js ' +
    '--elementExplorer true ' +
    '--debuggerServerPort 6969';

var startProtractor = function() {
  var deferred = q.defer();

  console.log('Starting protractor with command: [%s]', CLI_PATH);
  var ptor = childProcess.exec(CLI_PATH, function(error, stdout, stderr) {
    if (error) {
      console.log('Error starting protractor', error);

      //console.log(error.stack);
      //console.log('Error code:', error.code);
      //console.log('Signal received:', error.signal);
      return deferred.reject(error);
    }
    console.log('Child Process STDOUT:', stdout);
    console.log('Child Process STDERR:', stderr);
    deferred.resolve();
  });

  ptor.on('exit', function(code) {
    console.log('Protractor process exited with exit code', code);
  });

  return deferred.promise;
};

module.exports = {
  startProtractor: startProtractor
};
