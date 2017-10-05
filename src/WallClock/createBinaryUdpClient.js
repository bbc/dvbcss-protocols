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

var UdpAdaptor = require("../SocketAdaptors/UdpAdaptor");
var WallClockClientProtocol = require("./WallClockClientProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @memberof sync-protocols.WallClock
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
 * @returns {sync-protocols.SocketAdaptors.UdpAdaptor} The UDP adaptor wrapping the whole client
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
