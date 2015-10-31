'use strict';

var chalk = require('chalk');
var configHelper = require('./config-helper');
var path = require('path');
var spawnHelper = require('./spawnHelper');

var buildCliCommand = function(configPath) {
  var cliPath = path.join(
      __dirname, '../node_modules/protractor/lib/cli.js');

  return 'node ' + cliPath + ' ' +
      '--elementExplorer true ' +
      '--debuggerServerPort 6969 ' +
      configPath;
};

var startProtractor = function(options) {
  console.log('Creating protractor configuration file');
  var promise = configHelper.createProtractorConfig(options);
  return promise.then(function(configPath) {
    console.log(chalk.blue('Starting protractor'));
    var cliCommand = buildCliCommand(configPath);
    return spawnHelper.runCommand(cliCommand, /Server listening on/g);
  });
};

module.exports = {
  startProtractor: startProtractor
};
