/****************************************************************************
 * Copyright 2017 British Broadcasting Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*****************************************************************************/

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
 * @memberof dvbcss-protocols.CII
 * @description
 * Factory function that creates a CII client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {Object} clientOptions
 * @returns {dvbcss-protocols.SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client, but with change event added
 */
var createCIIClient = function(webSocket, clientOptions) {
	
	var protocol = new CIIClientProtocol(clientOptions)
	var wsa = new WebSocketAdaptor(protocol, webSocket);
	
	return new AdaptorWrapper(protocol, wsa);
};


module.exports = createCIIClient;
