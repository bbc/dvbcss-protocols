var UdpAdaptor = require("../SocketAdaptors/UdpAdaptor");
var WallClockClientProtocol = require("./WallClockClientProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @alias module:sync-protocols/WallClock.createBinaryUdpClient
 * @description
 * Factory function that creates a Wall Clock client that uses a UDP socket
 * and sends/receives protocol messages in binary format.
 *
 * @param {dgram_Socket} boundDgramSocket Bound UDP datagram socket
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Object} protocolOptions.dest Object describing destination server
 * @param {String} protocolOptions.dest.address Address of server, e.g. "1.2.3.4"
 * @param {Number} protocolOptions.dest.port Port number of server
 * @returns {module:sync-protocols/SocketAdaptors.UdpAdaptor} The UDP adaptor wrapping the whole client
 */
var createBinaryUdpClient = function(boundDgramSocket, wallClock, protocolOptions) {
    return new UdpAdaptor(
        new WallClockClientProtocol(
            wallClock,
            BinarySerialiser,
            protocolOptions
        ),
        boundDgramSocket);
};

module.exports = createBinaryUdpClient;
