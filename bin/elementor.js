(function() {
  var express = require('express');
  var bodyParser = require('body-parser');
  var ElementExplorerClient = require('./elementExplorerClient');

  var app = express();

  var exClient;

  app.use(bodyParser.json());


  app.get('/testSelector', function(req, res) {
    var query = req.query;

    if (query.popupInput) {
      return handlePopupRequest(query.popupInput, res);
    }

    console.log('Got', query);
    res.send('Hello World!')
  });

  function handlePopupRequest(input, res) {
    console.log('popup input', input);

    exClient.runCommand(input).then(function(response) {
      res.send(response);
    });
  }

  function handleDevToolsRequest(input, res) {
    console.log('Dev tools input', input);

    res.send('dev tool');
  }

// Open a server.
  var server = app.listen(13000, function() {
    console.log('Starting client');
    exClient = new ElementExplorerClient();

    //var cmd = "browser.get('http://angular.github.io/protractor/#/api');\r\n";
    //exClient.runCommand(cmd).then(function(res) {
    //  console.log('res', res);
    //  return exClient.runCommand("$$('div').count();\r\n").then(function(theCount) {
    //    console.log('The count', theCount);
    //  });
    //});

    console.log('Elementor is listening at http://localhost:%s',
        server.address().port);
  });
})();
