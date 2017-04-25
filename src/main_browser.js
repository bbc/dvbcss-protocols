
module.exports = {
    WallClock: {
        createClient:                require("./WallClock/createClient"),
        createBinaryWebSocketClient: require("./WallClock/createBinaryWebSocketClient"),
        createJsonWebSocketClient:   require("./WallClock/createJsonWebSocketClient"),
        WallClockClientProtocol:     require("./WallClock/WallClockClientProtocol"),
        Candidate:                   require("./WallClock/Candidate"),
        WallClockMessage:            require("./WallClock/WallClockMessage"),
        JsonSerialiser:              require("./WallClock/JsonSerialiser"),
        BinarySerialiser:            require("./WallClock/BinarySerialiser"),
    },

    TimelineSynchronisation : {
      PresentationTimestamps :       require ("./TimelineSynchronisation/PresentationTimestamps"),
      PresentationTimestamp :        require ("./TimelineSynchronisation/PresentationTimestamp"),
      ControlTimestamp :             require ("./TimelineSynchronisation/ControlTimestamp"),
      TSSetupMessage :               require ("./TimelineSynchronisation/TSSetupMessage"),
      TSClientProtocol :             require ("./TimelineSynchronisation/TSClientProtocol"),
      createTSClient :               require ("./TimelineSynchronisation/createTSClient"),
    },

    CII : {
         CIIMessage :       		    require ("./CII/CIIMessage"),
        TimelineProperties :         require ("./CII/TimelineProperties"),
        CIIClientProtocol :          require ("./CII/CIIClientProtocol"),
        createCIIClient :            require ("./CII/createCIIClient")
    },

    SocketAdaptors: {
        WebSocketAdaptor:            require("./SocketAdaptors/WebSocketAdaptor"),
    },
};
