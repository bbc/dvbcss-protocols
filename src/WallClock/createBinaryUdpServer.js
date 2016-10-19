var UdpAdaptor = require("../SocketAdaptors/UdpAdaptor");
var WallClockServerProtocol = require("./WallClockServerProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @alias module:sync-protocols/WallClock.createBinaryUdpServer
 * @description
 * Factory function that creates a Wall Clock server that uses a UDP socket
 * and sends/receives protocol messages in binary format.
 *
 * @param {dgram_Socket} boundDgramSocket UDP datagram socket bound to protocol designated port number
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {String} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Number} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 * @returns {module:sync-protocols/SocketAdaptors.UdpAdaptor} The UDP adaptor wrapping the whole server
 */


var createBinaryUdpServer = function(boundDgramSocket, wallClock, protocolOptions) {
    return new UdpAdaptor(
        new WallClockServerProtocol(
            wallClock,
            BinarySerialiser,
            protocolOptions
        ),
        boundDgramSocket);
};

module.exports = createBinaryUdpServer;