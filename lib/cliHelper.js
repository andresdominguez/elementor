var configHelper = require('./config-helper');
var path = require('path');
var spawnHelper = require('./spawnHelper');

var buildCliCommand = function(configPath) {
  var cliPath = path.join(
      __dirname, '../node_modules/protractor-elementor/lib/cli.js');

  return 'node ' + cliPath + ' ' +
      '--elementExplorer true ' +
      '--debuggerServerPort 6969 ' +
      configPath;
};

var startProtractor = function(options) {
  console.log('Creating protractor configuration file');
  return configHelper.createProtractorConfig(options).then(function(configPath) {
    var cliCommand = buildCliCommand(configPath);
    console.log('Starting protractor with command: [%s]', cliCommand);

    return spawnHelper.runCommand(cliCommand, 'Server listening on');
  });
};

module.exports = {
  startProtractor: startProtractor
};
