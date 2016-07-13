var WallClockMessage = require("./WallClockMessage");

/**
 * @alias module:sync-protocols/WallClock.JsonSerialiser
 * @description
 * JsonSerialiser message serialiser/deserialiser for Wall Clock protocol messages
 * 
 * @implements {ProtocolSerialiser}
 */
var JsonSerialiser = {
    /**
     * Serialise an object representing a Wall Clock protocol message ready for transmission on the wire
     * @param {WallClockMessage} wcMsg Object representing Wall Clock protocol message.
     * @returns {String|Uint8Array} The serialsed message.
     */
    pack: function(wcMsg) {

        if (wcMsg.version != 0) { throw "Invalid message version"; }
        
        return JSON.stringify({
            v:    Number(wcMsg.version),
            t:    Number(wcMsg.type),
            p:    Number(wcMsg.precision),
            mfe:  Number(wcMsg.max_freq_error),
            otvs: Number(wcMsg.originate_timevalue_secs),
            otvn: Number(wcMsg.originate_timevalue_nanos),
            rt:   Number(wcMsg.receive_timevalue),
            tt:   Number(wcMsg.transmit_timevalue)
        });
    },
    
    /**
     * Deserialise a received Wall Clock protocol message into an object representing it
     * @param {String|Uint8Array} wcMsg The received serialsed message.
     * @returns {WallClockMessage} Object representing the Wall Clock protocol message.
     */
    unpack: function(jsonMsg) {
        var parsedMsg = JSON.parse(jsonMsg);

        if (parsedMsg.v != 0) { throw "Invalid message version"; }

        return new WallClockMessage(
            parseInt(parsedMsg.v),
            parseInt(parsedMsg.t),
            Number(parsedMsg.p),
            Number(parsedMsg.mfe),
            parseInt(parsedMsg.otvs),
            parseInt(parsedMsg.otvn),
            Number(parsedMsg.rt),
            Number(parsedMsg.tt)
        );
    }
};

module.exports = JsonSerialiser;
