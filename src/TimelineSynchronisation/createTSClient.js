var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var TSClientProtocol = require("./TSClientProtocol");

/**
 * @alias module:sync-protocols/TimelineSynchronisation.createTSClient
 * @description
 * Factory function that creates a TS protocol client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API comaptible websocket connection object
 * @param {CorrelatedClock} syncTLClock
 * @param {Object} clientOptions
 * @param {string} clientOptions.contentIdStem The Content Identifier stem is considered to match the timed content currently being presented by the TV Device
 * @param {string} clientOptions.timelineSelector The Timeline Selector describes the type and location of timeline signalling to be derived from the Timed Content
currently being presented by the TV Device
 * @param {Number} clientOptions.tickrate The tickrate of the timeline that is specified by the timelineSelector.
 * @returns {module:sync-protocols/SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createTSClient = function(webSocket, syncTLClock, clientOptions) {
    return new WebSocketAdaptor(
        new TSClientProtocol(
            syncTLClock,
            clientOptions
        ),
        webSocket);
};


module.exports = createTSClient;
