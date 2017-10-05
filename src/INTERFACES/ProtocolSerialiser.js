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
