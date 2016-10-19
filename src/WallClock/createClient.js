/**
 * @alias module:sync-protocols/WallClock.createClient
 * @description
 * Factory function that creates a Wall Clock client.
 *
 * @param {Socket} socket Socket object representing the connection
 * @param {Adaptor} AdaptorClass Adaptor class for the socket object
 * @param {Serialiser} serialiser Message seraliser
 * @param {CorrelatedClock} wallClock
 * @param {Object} clientOptions
 * @returns {WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createClient = function(socket, AdaptorClass, serialiser, wallClock, clientOptions) {
    return new AdaptorClass(
        new WallClockClientProtocol(
            wallClock,
            serialiser,
            clientOptions 
        ),
        socket);
};


module.exports = createClient;
