var WallClockMessage = require("./WallClockMessage");

Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

/**
 * @alias module:sync-protocols/WallClock.BinarySerialiser
 * @description
 * BinarySerialiser message serialiser/deserialiser for Wall Clock protocol messages.
 * The binary format is that defined in ETSI TS 103 286-2 clause 8
 * (the wall clock protocol message format).
 * 
 * @implements {ProtocolSerialiser}
 */
var BinarySerialiser = {
    /**
     * Serialise an object representing a Wall Clock protocol message ready for transmission on the wire
     * @param {WallClockMessage} wcMsg Object representing Wall Clock protocol message.
     * @returns {String|Uint8Array} The serialsed message.
     */
    pack: function(wcMsg) {
        if (wcMsg.version != 0) { throw "Invalid message version"; }
        
		// create the UDP message to send
		var udpMsg = new Uint8Array(32);
		var d = new DataView(udpMsg.buffer);

		d.setUint8(0, wcMsg.version);
		d.setUint8(1, wcMsg.type);
        d.setUint8(2, Math.ceil(Math.log2(wcMsg.precision)));
		d.setUint8(3, 0);  // reserved bits

        d.setUint32( 4, wcMsg.max_freq_error*256);
        
        d.setUint32( 8, wcMsg.originate_timevalue_secs);
	    d.setUint32(12, wcMsg.originate_timevalue_nanos);

        var t2 = WallClockMessage.nanosToSecsAndNanos(wcMsg.receive_timevalue);
        d.setUint32(16, t2[0]);
        d.setUint32(20, t2[1]);

        var t3 = WallClockMessage.nanosToSecsAndNanos(wcMsg.transmit_timevalue);
        d.setUint32(24, t3[0]);
        d.setUint32(28, t3[1]);

        return udpMsg;
    },
    
    /**
     * Deserialise a received Wall Clock protocol message into an object representing it
     * @param {String|Uint8Array} wcMsg The received serialsed message.
     * @returns {WallClockMessage} Object representing the Wall Clock protocol message.
     */
    unpack: function(msg) {
		var data = new DataView(msg)

        var version = data.getUint8(0);
        if (version != 0) { throw "Invalid message version"; }

        return new WallClockMessage(
            version,
            data.getUint8(1),
            Math.pow(2, data.getInt8(2)), // seconds
            data.getUint32(4) / 256, // ppm
            data.getUint32(8),
            data.getUint32(12),
            data.getUint32(16) + data.getUint32(20) / 1000000000,
            data.getUint32(24) + data.getUint32(28) / 1000000000
        );
    }
};

module.exports = BinarySerialiser;
