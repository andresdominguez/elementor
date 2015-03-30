var spawnHelper = require('./spawnHelper');

var CLI_COMMAND = 'node /Users/andresdom/dev/protractor/lib/cli.js ' +
    '--elementExplorer true ' +
    '--debuggerServerPort 6969 ' +
    '../protractor.conf.js';

var startProtractor = function() {
  console.log('Starting protractor with command: [%s]', CLI_COMMAND);

  return spawnHelper.runCommand(CLI_COMMAND, 'Server listening on');
};

module.exports = {
  startProtractor: startProtractor
};
