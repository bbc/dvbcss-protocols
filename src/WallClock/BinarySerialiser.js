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

var WallClockMessage = require("./WallClockMessage");

Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

/**
 * @memberof dvbcss-protocols.WallClock
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
     * @returns {ArrayBuffer} The serialsed message.
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

        return udpMsg.buffer;
    },

    /**
     * Deserialise a received Wall Clock protocol message into an object representing it
     * @param {ArrayBuffer} wcMsg The received serialsed message.
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
    },
    toHex: function(buffer)
    {
       if (buffer instanceof ArrayBuffer){


           // create a byte array (Uint8Array) that we can use to read the array buffer
           const byteArray = new Uint8Array(buffer);

           // for each element, we want to get its two-digit hexadecimal representation
           const hexParts = [];
           for(var i = 0; i < byteArray.length; i++) {
               // convert value to hexadecimal
               const hex = byteArray[i].toString(16);

               // pad with zeros to length 2
               const paddedHex = ('00' + hex).slice(-2);

               // push to array
               hexParts.push(paddedHex);
           }

           // join all the hex values of the elements into a single string
           return hexParts.join('');
      }
    }
};

module.exports = BinarySerialiser;
