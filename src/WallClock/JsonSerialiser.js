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

/**
 * @memberof sync-protocols.WallClock
 * @description
 * JsonSerialiser message serialiser/deserialiser for Wall Clock protocol messages
 * 
 * @implements {ProtocolSerialiser}
 */
var JsonSerialiser = {
    /**
     * Serialise an object representing a Wall Clock protocol message ready for transmission on the wire
     * @param {WallClockMessage} wcMsg Object representing Wall Clock protocol message.
     * @returns {String} The serialsed message.
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
     * @param {String|ArrayBuffer} wcMsg The received serialsed message.
     * @returns {WallClockMessage} Object representing the Wall Clock protocol message.
     */
    unpack: function(jsonMsg) {
        // coerce from arraybuffer,if needed
        if (jsonMsg instanceof ArrayBuffer) {
            jsonMsg = String.fromCharCode.apply(null, new Uint8Array(jsonMsg));
        }

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
