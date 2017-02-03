var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var CIIClientProtocol = require("./CIIClientProtocol");
var CIIObject = require("./CII");

/**
 * @alias module:sync-protocols/CII.createJsonWebSocketClient
 * @description
 * Factory function that creates a CII client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API comaptible websocket connection object
 * @param {Object} clientOptions
 * @returns {module:sync-protocols/SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createCIIClient = function(webSocket, clientOptions) {
    return new WebSocketAdaptor(
        new CIIClientProtocol(
            clientOptions
        ),
        webSocket);
};


module.exports = createCIIClient;
