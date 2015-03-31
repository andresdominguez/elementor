var path = require('path');
var spawnHelper = require('./spawnHelper');

var cliPath = path.join(__dirname, '../node_modules/protractor/lib/cli.js'),
    configPath = path.join(__dirname, '../lib/protractor.conf.js');

//var cliPath = '/Users/andresdom/dev/protractor/lib/cli.js';

//cliPath = '/Users/andresdom/dev/elementor/node_modules/protractor/lib/cli.js';

var CLI_COMMAND = 'node ' + cliPath + ' ' +
    '--elementExplorer true ' +
    '--debuggerServerPort 6969 ' +
    configPath;
    //'../protractor.conf.js';

var startProtractor = function() {
  console.log('Starting protractor with command: [%s]', CLI_COMMAND);

  return spawnHelper.runCommand(CLI_COMMAND, 'Server listening on');
};

module.exports = {
  startProtractor: startProtractor
};
