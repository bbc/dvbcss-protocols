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
 *     PresentationTimestamp.prototype.equals
*****************************************************************************/

/**
 * @memberof sync-protocols.TimelineSynchronisation
 * @class
 * @description
 * Object representing a presentation timestamp to correlate media timelines with wall clock times.
 *
 * @constructor
 * @param {Number} contentTime   if known a positive integer, null otherwise
 * @param {Number} wallClockTime a value on the wallclock, as a positive integer
 */

var PresentationTimestamp = function(contentTime, wallClockTime) {
  this.contentTime   = Number(contentTime).toString();
  this.wallClockTime = Number(wallClockTime).toString();

  if (isNaN(this.contentTime) || isNaN(this.wallClockTime))
  {
    throw "PresentationTimestamp(): Invalid parameters: not a number.";
  }
}

/**
 * Method intended to be called from PresentationTimestamps.deserialise
 * @returns {PresentationTimestamp} translates an object into a PresentationTimestamp.
 */
PresentationTimestamp.getFromObj = function (o) {
  return new PresentationTimestamp(o.contentTime, o.wallClockTime);
}

/**
 * Compare this PresentationTimestamp with another to check if they are the same.
 * @param {PresentationTimestamp} obj - another PresentationTimestamp to compare with.
 * @returns {boolean} True if this PresentationTimestamp represents the same PresentationTimestamp as the one provided.
 */
PresentationTimestamp.prototype.equals = function(obj) {

    return this.contentTime === obj.contentTime &&
        this.wallClockTime === obj.wallClockTime;
};


module.exports = PresentationTimestamp;
