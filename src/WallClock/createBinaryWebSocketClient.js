var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var WallClockClientProtocol = require("./WallClockClientProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @memberof sync-protocols.WallClock
 * @description
 * Factory function that creates a Wall Clock client that uses a WebSocket
 * and sends/receives protocol messages in binary format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {CorrelatedClock} wallClock
 * @param {Object} clientOptions
 * @returns {sync-protocols.SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createBinaryWebSocketClient = function(webSocket, wallClock, clientOptions) {
    return new WebSocketAdaptor(
        new WallClockClientProtocol(
            wallClock,
            BinarySerialiser,
            clientOptions
        ),
        webSocket);
};


module.exports = createBinaryWebSocketClient;
