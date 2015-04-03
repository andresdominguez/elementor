#!/usr/bin/env node

var minimist = require('minimist');
var path = require('path');

var args = minimist(process.argv.slice(2), {
  string: 'chrome',
  alias: {h: 'help', v: 'version'}
});

if (args.help) {
  var cmd = require('path').basename(process.argv[1]);
  console.log(require('fs')
      .readFileSync(path.join(__dirname, '../help.txt'), 'utf-8')
      .replace(/\$0/g, cmd)
      .trim());
  process.exit();
}

if (args.version) {
  console.log(require('../package.json').version);
  process.exit();
}

var getOptions = function() {
  // Test for flags
  var options = {};

  // Ignore synchronization?
  if (args.nonAngular) {
    options.ignoreSynchronization = true;
  }

  // Chrome arguments?
  if (args.chrome) {
    options.chromeOptions = args.chrome;
  }

  // Is there a url?
  if (args._[0]) {
    options.url = args._[0];
  }

  return options;
};


// Start elementor.
var options = getOptions();
require('../lib/server').start(options);
