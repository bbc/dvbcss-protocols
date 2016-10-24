/**
 * @interface
 * @description
 * Interface for protocol message serialisation/deserialisation
 *
 */
var ProtocolSerialiser = {
    /**
     * Serialise an object representing a protocol message ready for transmission on the wire
     * @param {Object} wcMsg Object representing protocol message.
     * @returns {String|Uint8Array} The serialsed message.
     */
    pack: function(wcMsg) { throw "Not implemented"; },
    /**
     * Deserialise a received protocol message into an object representing it
     * @param {String|Uint8Array} wcMsg The received serialised message.
     * @returns {object} Object representing the protocol message.
     */
    unpack: function(msg) { throw "Not implemented"; },
}

module.exports = ProtocolSerialiser;
