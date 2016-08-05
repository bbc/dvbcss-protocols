/**
 * @module sync-protocols
 * @description
 * Sync protocols for node.js (clients and servers) and the browser (clients only).
 *
 * <p>This is the top level module that you should "require":
 * @example
 * var SyncProtocols = require("sync-protocols");
 */
module.exports = {
    /**
     * Sub-module providing the Wall Clock protocol. See [WallClock]{@link module:sync-protocols/WallClock}
     * @see module:sync-protocols/WallClock
     */
    WallClock: {
        createClient:                require("./WallClock/createClient"),
        createBinaryUdpClient:       require("./WallClock/createBinaryUdpClient"),
        createBinaryWebSocketClient: require("./WallClock/createBinaryWebSocketClient"),
        createJsonWebSocketClient:   require("./WallClock/createJsonWebSocketClient"),

        WallClockClientProtocol:     require("./WallClock/WallClockClientProtocol"),
        Candidate:                   require("./WallClock/Candidate"),
        WallClockMessage:            require("./WallClock/WallClockMessage"),
        JsonSerialiser:              require("./WallClock/JsonSerialiser"),
        BinarySerialiser:            require("./WallClock/BinarySerialiser"),
    },


    /**
    * Sub-module providing the TimelineSynchronisation protocol. See [TimelineSynchronisation]{@link module:sync-protocols/TimelineSynchronisation}
    * @see  module:sync-protocols/TimelineSynchronisation
    */
    TimelineSynchronisation : {
      PresentationTimestamps : require ("./TimelineSynchronisation/PresentationTimestamps"),
      PresentationTimestamp :  require ("./TimelineSynchronisation/PresentationTimestamp"),
      ControlTimestamp :       require ("./TimelineSynchronisation/ControlTimestamp")
    },


    /**
     * Sub-module providing adaptors between network socket objects and the protocol implementations. See [WallClock]{@link module:sync-protocols/SocketAdaptors}
     * @see module:sync-protocols/SocketAdaptors
     */
    SocketAdaptors: {
        WebSocketAdaptor:            require("./SocketAdaptors/WebSocketAdaptor"),
        UdpAdaptor:                  require("./SocketAdaptors/UdpAdaptor"),
    },
};
