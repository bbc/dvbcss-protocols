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
 * @memberof dvbcss-protocols.WallClock
 * @class
 * @description
 * Object for representing a wall clock message. User a {@link ProtocolSerialiser} to convert to/from the format in which the message is carried on the wire.
 *
 * @constructor
 * @param {Number} version Should be 0.
 * @param {dvbcss-protocols.WallClock.WallClockMessage.TYPES} type.
 * @param {Number} precision Clock precision (in seconds and fractions of a second).
 * @param {Number} max_freq_error Clock maximum frequency error (in ppm).
 * @param {Number} originate_timevalue_secs Request sent time (seconds part)
 * @param {Number} originate_timevalue_nanos Request sent time (nanoseconds part)
 * @param {Number} receive_timevalue Request received time (seconds+fractions of second)
 * @param {Number} transmit_timevalue Response sent time (seconds+fractions of second)
 */
var WallClockMessage = function(version, type, precision, max_freq_error, originate_timevalue_secs, originate_timevalue_nanos, receive_timevalue, transmit_timevalue) {
    
    /**
     * @type Number
     * @desc Protocol message format version.
     */
    this.version = version;
    /**
     * @type WallClockMessage.TYPES
     * @desc Message type
     */
    this.type = type;
    /**
     * @type Number
     * @desc Clock precision (in seconds and fractions of a second).
     */
    this.precision = precision;
    /**
     * @type Number
     * @desc Clock maximum frequency error (in ppm).
     */
    this.max_freq_error = max_freq_error;
    /**
     * @type Number
     * @desc Request sent time (seconds part)
     */
    this.originate_timevalue_secs = originate_timevalue_secs;
    /**
     * @type Number
     * @desc Request sent time (nanoseconds part)
     */
    this.originate_timevalue_nanos = originate_timevalue_nanos;
    /**
     * @type Number
     * @desc Request received time (seconds+fractions of second)
     */
    this.receive_timevalue = receive_timevalue;
    /**
     * @type Number
     * @desc Response sent time (seconds+fractions of second)
     */
    this.transmit_timevalue = transmit_timevalue;
}

/**
 * Values permitted for the 'type' field in a wall clock message
 * @enum {Number}
 */ 
WallClockMessage.TYPES = {
    /** 0 - request **/
    request: 0,
    /** 1 - response **/
    response: 1,
    /** 2 - response with follow-up promised **/
    responseWithFollowUp: 2,
    /** 3 - follow-up response **/
    followUp: 3
};

/**
 * @returns True if this message object represents a response message
 */
WallClockMessage.prototype.isResponse = function() {
    switch (this.type) {
        case WallClockMessage.TYPES.response:
        case WallClockMessage.TYPES.responseWithFollowUp:
        case WallClockMessage.TYPES.followUp:
            return true;
        default:
            return false;
    }
};

/**
 * Make an object representing a wall clock protocol request
 * @param {Number} localSendtimeSecs The seconds part of the send time
 * @param {Number} localSendTimeNanos The nanoseconds part of the send time
 * @returns {WallClockMessage} object representing Wall Clock protocol message
 */
WallClockMessage.makeRequest = function(localSendtimeSecs, localSendTimeNanos) {
    return new WallClockMessage(0, WallClockMessage.TYPES.request, 0, 0, localSendtimeSecs, localSendTimeNanos, 0, 0);
};

/**
 * Create a response message based on this request message
 * @param {WallClockMessage} requestMsg object representing received wall clock request message
 * @param {WC_MSG_TYPES} responseType the type field for the message
 * @param {Number} rxTime The time at which the request was received (in nanoseconds)
 * @param {Number} txTime The time at which this response is being sent (in nanoseconds)
 * @returns {WallClockMessage} New object representing the response message
 */
WallClockMessage.prototype.toResponse = function(responseType, precision, max_freq_error, rxTime, txTime) {
    return new WallClockMessage(
        this.version,
        responseType,
        precision,
        max_freq_error,
        this.originate_timevalue_secs,
        this.originate_timevalue_nanos,
        rxTime,
        txTime
    );
};


/**
 * @returns True if the properties of this object match this one
 */
WallClockMessage.prototype.equals = function(obj) {
    if (typeof obj === "undefined" || obj == null) { return false; }
    
    return this.version === obj.version &&
        this.type === obj.type &&
        this.precision === obj.precision &&
        this.max_freq_error === obj.max_freq_error &&
        this.originate_timevalue_secs === obj.originate_timevalue_secs &&
        this.originate_timevalue_nanos === obj.originate_timevalue_nanos &&
        this.receive_timevalue === obj.receive_timevalue &&
        this.transmit_timevalue === obj.transmit_timevalue;
}


/**
 * convert a timevalue (in units of nanoseconds) into separate values representing a seconds part and a fractional nanoseconds part
 * @param {Number} time value in nanoseconds
 * @returns {Number[]} array of two numbers [secs, nanos] containing the seconds and the nanoseconds
 */
WallClockMessage.nanosToSecsAndNanos = function(n) {
    var secs = Math.trunc(n / 1000000000);
    var nanos = Math.trunc(n % 1000000000);
    return [secs,nanos]
};

/**
 * convert separate seconds and nanoseconds values into a single nanosecond time value
 * @param {Number} secs Seconds part only
 * @param {Number} nanos Nanoseconds part only
 * @return {Number} combined time value (in nanoseconds)
 */
WallClockMessage.secsAndNanosToNanos = function(secs, nanos) {
    return (Math.trunc(secs)*1000000000) + Math.trunc(nanos % 1000000000);
};


module.exports = WallClockMessage;
