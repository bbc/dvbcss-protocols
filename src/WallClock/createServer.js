/**
 * @alias module:sync-protocols/WallClock.createServer
 * @description
 * Factory function that creates a Wall Clock server.
 *
 * @param {Socket} socket Socket object representing the connection e.g. a UDP socket or a WebSocket
 * @param {Adaptor} AdaptorClass Adaptor class for the socket object
 * @param {Serialiser} serialiser Message seraliser
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {Number} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Boolean} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 * @returns {SocketAdaptor} The Socket adaptor wrapping the whole server.
 */
var createServer = function(socket, AdaptorClass, serialiser, wallClock, protocolOptions) {
	return new AdaptorClass(
			new WallClockServerProtocol(
					wallClock,
					serialiser,
					protocolOptions
			),
			socket);
};


module.exports = createServer;
