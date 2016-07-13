var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var WallClockClientProtocol = require("./WallClockClientProtocol");
var JsonSerialiser = require("./JsonSerialiser");

/**
 * @alias module:sync-protocols/WallClock.createJsonWebSocketClient
 * @description
 * Factory function that creates a Wall Clock client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API comaptible websocket connection object
 * @param {CorrelatedClock} wallClock
 * @param {Object} clientOptions
 * @returns {module:sync-protocols/SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createJsonWebSocketClient = function(webSocket, wallClock, clientOptions) {
    return new WebSocketAdaptor(
        new WallClockClientProtocol(
            wallClock,
            JsonSerialiser,
            clientOptions
        ),
        webSocket);
};


module.exports = createJsonWebSocketClient;
