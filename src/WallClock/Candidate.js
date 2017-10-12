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

var Correlation = require("dvbcss-clocks").Correlation;
var WallClockMessage = require("./WallClockMessage");

/**
 * @memberof dvbcss-protocols.WallClock
 * @description
 * Reperesents a measurement candidate. Is derived from a response {WallClockMessage}
 *
 * <p>All values in units of nanoseconds or ppm
 *
 * @constructor
 * @param {WallClockMessage} WallClockMessage A response message from which the candidate will be based.
 * @param {Number} nanosRx Time the message was received (in nanoseconds)
 */
var Candidate = function(wcMsg, nanosRx) {
    if (!wcMsg.isResponse()) {
        throw "Not a response message";
    }
    
    /**
     * @type Number
     * @desc Request sent time (in nanoseconds)
     */
    this.t1 = WallClockMessage.secsAndNanosToNanos(wcMsg.originate_timevalue_secs, wcMsg.originate_timevalue_nanos);
    /**
     * @type Number
     * @desc Request received time (in nanoseconds)
     */
    this.t2 = wcMsg.receive_timevalue * 1000000000;
    /**
     * @type Number
     * @desc Response sent time (in nanoseconds)
     */
    this.t3 = wcMsg.transmit_timevalue * 1000000000;
    /**
     * @type Number
     * @desc Response received time (in nanoseconds)
     */
    this.t4 = nanosRx;
    /**
     * @type Number
     * @desc Clock precision (in nanoseconds)
     */
    this.precision = wcMsg.precision * 1000000000;
    /**
     * @type Number
     * @desc Maximum frequency error (in ppm)
     */
    this.mfe = wcMsg.max_freq_error;
    /**
     * @type Number
     * @desc The WallClockMessage from which this candidate was derived
     */
    this.msg = wcMsg;
};

/**
 * Returns a Correlation that corresponds to the measurement represented by this Candidate
 *
 * @param {CorrelatedClock} clock The clock that the correlation will be applied to
 * @returns {Correlation} correlation representing the candidate, including error/uncertainty information
 */
Candidate.prototype.toCorrelation = function(clock) {
    var t1 = clock.parent.fromNanos(this.t1);
    var t4 = clock.parent.fromNanos(this.t4);
    var t2 = clock.fromNanos(this.t2);
    var t3 = clock.fromNanos(this.t3);
    
    var rtt = (this.t4-this.t1) - (this.t3-this.t2);
    
    var mfeC = clock.getRootMaxFreqError() / 1000000; // ppm to fraction
    var mfeS = this.mfe / 1000000; // ppm to fraction
    
    var c = new Correlation({
        parentTime: (t1+t4)/2,
        childTime:  (t2+t3)/2,
        initialError: ( 
                this.precision +
                rtt / 2 + 
                mfeC*(this.t4-this.t1) + mfeS*(this.t3-this.t2)
            ) / 1000000000, // nanos to secs
        errorGrowthRate: mfeC+mfeS
    });
    return c;
};

module.exports = Candidate;
