/****************************************************************************
 * Copyright 2017 Institut für Rundfunktechnik
 * and contributions Copyright 2017 British Broadcasting Corporation.
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
 * --------------------------------------------------------------------------
 * Summary of parts containing contributions
 *   by British Broadcasting Corporation (BBC):
 *     PresentationTimestamps.deserialise : arraybuffer coercion
*****************************************************************************/

var PresentationTimestamp = require("./PresentationTimestamp");

/**
 * @memberof dvbcss-protocols.TimelineSynchronisation
 * @class
 * @description
 * Object representing actual, earliest and latest presentation timestamps sent from a synchronistion client to the MSAS.
 *
 * @constructor
 * @param {PresentationTimestamp} actual optional timestamp, representing the actual presentation on the client
 * @param {PresentationTimestamp} earliest timestamp indicating when the client can present a media sample at the very earliest
 * @param {PresentationTimestamp} latest timestamp indicating when the client can present a media sample at the very latest
 */

var PresentationTimestamps = function(earliest, latest, actual) {
  this.earliest   = earliest;
  this.latest     = latest;
  this.actual     = actual;

  if (!(this.earliest instanceof PresentationTimestamp && this.latest instanceof PresentationTimestamp &&
     (this.actual instanceof PresentationTimestamp || this.actual !== undefined)))
  {
    throw ("PresentationTimestamps(): Invalid parameters.");
  }
}

/**
 * @returns {string} string representation of the PresentationTimestamps as defined by ETSI TS XXX XXX clause 5.7.4
 */
PresentationTimestamps.prototype.serialise = function () {
  return JSON.stringify(this);
}

/**
 * @returns {PresentationTimestamps} actual, earliest and latest presentation timestamps from a JSON formatted string
 */
PresentationTimestamps.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);

  return new PresentationTimestamps (
    PresentationTimestamp.getFromObj(o.earliest),
    PresentationTimestamp.getFromObj(o.latest),
    o.actual ? PresentationTimestamp.getFromObj(o.actual) : undefined
  );
}

module.exports = PresentationTimestamps;
