/****************************************************************************
 * Copyright 2017 British Broadcasting Corporation
 * and contributions Copyright 2017 Institut für Rundfunktechnik.
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
 * --------------------------------------------------------------------------
 * Summary of parts containing contributions
 *   by Institut für Rundfunktechnik (IRT):
 *     TimelineSynchronisation
*****************************************************************************/

/**
 * @module dvbcss-protocols
 * @description
 * Sync protocols for node.js (clients and servers) and the browser (clients only).
 * It contains the following namespaces:
 *
  * <ul>
  *   <li> [CII]{@link dvbcss-protocols.CII}
  *   <li> [TimelineSynchronisation]{@link dvbcss-protocols.TimelineSynchronisation}
  *   <li> [WallClock]{@link dvbcss-protocols.WallClock}
  *   <li> [SocketAdaptors]{@link dvbcss-protocols.SocketAdaptors}
  * </ul>

 * <p>This is the top level module that you should "require":
 * @example
 * <caption>Importing this module and accessing the namespaces within it</caption>
 * var Protocols = require("dvbcss-protocols")
 * var CII = Protocols.CII
 * var CII = Protocols.TimelineSynchronisation
 * var CII = Protocols.WallClock
 */
module.exports = {
    /**
     * Namespace containing the Wall Clock protocol implementation. See [WallClock]{@link dvbcss-protocols.WallClock}
     * @see dvbcss-protocols.WallClock
     */
    WallClock: {
        createClient:                require("./WallClock/createClient"),
        createServer:                require("./WallClock/createServer"),
        createBinaryUdpClient:       require("./WallClock/createBinaryUdpClient"),
        createBinaryUdpServer:       require("./WallClock/createBinaryUdpServer"),
        createBinaryWebSocketServer: require("./WallClock/createBinaryWebSocketServer"),
        createBinaryWebSocketClient: require("./WallClock/createBinaryWebSocketClient"),
        createJsonWebSocketClient:   require("./WallClock/createJsonWebSocketClient"),

        WallClockClientProtocol:     require("./WallClock/WallClockClientProtocol"),
        WallClockServerProtocol:     require("./WallClock/WallClockServerProtocol"),
        Candidate:                   require("./WallClock/Candidate"),
        WallClockMessage:            require("./WallClock/WallClockMessage"),
        JsonSerialiser:              require("./WallClock/JsonSerialiser"),
        BinarySerialiser:            require("./WallClock/BinarySerialiser"),
    },


    /**
    * Namespace containing the TimelineSynchronisation protocol implementation. See [TimelineSynchronisation]{@link dvbcss-protocols.TimelineSynchronisation}
    * @see  dvbcss-protocols.TimelineSynchronisation
    */
    TimelineSynchronisation : {
      PresentationTimestamps :       require ("./TimelineSynchronisation/PresentationTimestamps"),
      PresentationTimestamp :        require ("./TimelineSynchronisation/PresentationTimestamp"),
      ControlTimestamp :             require ("./TimelineSynchronisation/ControlTimestamp"),
      TSSetupMessage :               require ("./TimelineSynchronisation/TSSetupMessage"),
      TSClientProtocol :             require ("./TimelineSynchronisation/TSClientProtocol"),
      createTSClient :               require ("./TimelineSynchronisation/createTSClient"),
    },

    /**
    * Namespace containing the CII protocol implementation. See [CII]{@link dvbcss-protocols.CII}
    * @see dvbcss-protocols.CII
    */
    CII : {
    	CIIMessage :                 require ("./CII/CIIMessage"),
        TimelineProperties :         require ("./CII/TimelineProperties"),
        CIIClientProtocol :          require ("./CII/CIIClientProtocol"),
        createCIIClient :            require ("./CII/createCIIClient")
    },

    /**
     * Namespace containing adaptors between network socket objects and the protocol implementations. See [WallClock]{@link dvbcss-protocols.SocketAdaptors}
     * @see dvbcss-protocols.SocketAdaptors
     */
    SocketAdaptors: {
        WebSocketAdaptor:            require("./SocketAdaptors/WebSocketAdaptor"),
        UdpAdaptor:                  require("./SocketAdaptors/UdpAdaptor"),
    },

};
