/**
 * http://usejsdoc.org/
 */
var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var WallClockServerProtocol = require("./WallClockServerProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @alias module:sync-protocols/WallClock.createBinaryWebSocketServer
 * @description
 * Factory function that creates a Wall Clock server that uses a WebSocket
 * and sends/receives protocol messages in binary format.
 *
 * @param {webSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {String} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Number} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 * @returns {module:sync-protocols/SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole server
 */


var createBinaryWebSocketServer = function(webSocket, wallClock, protocolOptions) {
    return new WebSocketAdaptor(
        new WallClockServerProtocol(
            wallClock,
            BinarySerialiser,
            protocolOptions
        ),
        webSocket);
};

module.exports = createBinaryWebSocketServer;
