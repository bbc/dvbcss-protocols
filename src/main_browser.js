
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
    
    SocketAdaptors: {
        WebSocketAdaptor:            require("./SocketAdaptors/WebSocketAdaptor"),
    },
};
