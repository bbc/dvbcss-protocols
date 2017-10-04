/**
 * @module sync-protocols
 * @description
 * Sync protocols for node.js (clients and servers) and the browser (clients only).
 * It contains the following namespaces:
 *
  * <ul>
  *   <li> [CII]{@link sync-protocols.CII}
  *   <li> [TimelineSynchronisation]{@link sync-protocols.TimelineSynchronisation}
  *   <li> [WallClock]{@link sync-protocols.WallClock}
  *   <li> [SocketAdaptors]{@link sync-protocols.SocketAdaptors}
  * </ul>

 * <p>This is the top level module that you should "require":
 * @example
 * <caption>Importing this module and accessing the namespaces within it</caption>
 * var SyncProtocols = require("sync-protocols")
 * var CII = SyncProtocols.CII
 * var CII = SyncProtocols.TimelineSynchronisation
 * var CII = SyncProtocols.WallClock
 */
module.exports = {
    /**
     * Namespace containing the Wall Clock protocol implementation. See [WallClock]{@link sync-protocols.WallClock}
     * @see sync-protocols.WallClock
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
    * Namespace containing the TimelineSynchronisation protocol implementation. See [TimelineSynchronisation]{@link sync-protocols.TimelineSynchronisation}
    * @see  sync-protocols.TimelineSynchronisation
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
    * Namespace containing the CII protocol implementation. See [CII]{@link sync-protocols.CII}
    * @see sync-protocols.CII
    */
    CII : {
    	CIIMessage :                 require ("./CII/CIIMessage"),
        TimelineProperties :         require ("./CII/TimelineProperties"),
        CIIClientProtocol :          require ("./CII/CIIClientProtocol"),
        createCIIClient :            require ("./CII/createCIIClient")
    },

    /**
     * Namespace containing adaptors between network socket objects and the protocol implementations. See [WallClock]{@link sync-protocols.SocketAdaptors}
     * @see sync-protocols.SocketAdaptors
     */
    SocketAdaptors: {
        WebSocketAdaptor:            require("./SocketAdaptors/WebSocketAdaptor"),
        UdpAdaptor:                  require("./SocketAdaptors/UdpAdaptor"),
    },

};
