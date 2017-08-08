var events = require("events");
var inherits = require("inherits");

var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var CIIMessage = require("./CIIMessage");
var CIIClientProtocol = require("./CIIClientProtocol");

function AdaptorWrapper(ciiClientProtocol, adaptor) {
	events.EventEmitter.call(this)

	var self = this
	ciiClientProtocol.on("change", function(cii, changes, mask) {
		self.emit("change", cii, changes, mask);
	});
	
	this.stop = function() { return adaptor.stop() }
	this.isStarted = function() { return adaptor.isStarted() }
}

inherits(AdaptorWrapper, events.EventEmitter);


/**
 * @alias module:sync-protocols/CII.createJsonWebSocketClient
 * @description
 * Factory function that creates a CII client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {Object} clientOptions
 * @returns {module:sync-protocols/SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client, but with change event added
 */
var createCIIClient = function(webSocket, clientOptions) {
	
	var protocol = new CIIClientProtocol(clientOptions)
	var wsa = new WebSocketAdaptor(protocol, webSocket);
	
	return new AdaptorWrapper(protocol, wsa);
};


module.exports = createCIIClient;
