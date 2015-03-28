var net = require('net');
var EventEmitter = require('events').EventEmitter;
var q = require('q');

/**
 *
 * @constructor
 */
var ElementExplorerClient = function() {
  this.client_ = null;
  this.eventEmitter_ = new EventEmitter();

  this.connect_();
};

ElementExplorerClient.prototype.connect_ = function() {
  var eventEmitter = this.eventEmitter_;

  var client = net.connect({port: 6969}, function() { //'connect' listener
    console.log('Connected to protractor');
  });

  client.on('data', function(data) {
    console.log('Got data from net', data.toString());
    eventEmitter.emit('ptorResponse', data.toString());
  });
  client.on('end', function() {
    console.log('disconnected from server');
  });

  this.client_ = client;
};

ElementExplorerClient.prototype.runCommand = function(cmd) {
  var deferred = q.defer();

  this.eventEmitter_.once('ptorResponse', function(response) {
    console.log('Got response from event');
    deferred.resolve(response);
  });

  this.client_.write(cmd);

  return deferred.promise;
};

ElementExplorerClient.prototype.getSuggestions = function() {
};

module.exports = ElementExplorerClient;
