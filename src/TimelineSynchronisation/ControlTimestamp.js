/**
 * @memberof sync-protocols.TimelineSynchronisation
 * @class
 * @description
 * Object representing a control timestamp to correlate media timelines with wall clock times.
 *
 * @constructor
 * @param {Number} contentTime if known a positive integer, null otherwise
 * @param {Number} wallClockTime a value on the wallclock, as a positive integer
 * @param {Number} timelineSpeedMultiplier if known a floating point number, null otherwise
 *
 * @implements {Serialisable}
 */

var ControlTimestamp = function(contentTime, wallClockTime, timelineSpeedMultiplier) {
  this.contentTime = (contentTime !== null) ? Number(contentTime) : null;
  this.wallClockTime = Number(wallClockTime);
  this.timelineSpeedMultiplier = (timelineSpeedMultiplier !== null) ? Number(timelineSpeedMultiplier) : null;

  if (!((Number.NaN !== this.contentTime && Number.NaN !== this.timelineSpeedMultiplier) ||
        (this.contentTime === null && this.timelineSpeedMultiplier === null)) &&
        (Number.isInteger(this.wallClockTime)))
  {
    throw "Invalid parameters";
  }
}

/**
 * @return a string representation of this ControlTimestamp as defined by ETSI TS 103 286 clause 5.7.5
 */
ControlTimestamp.prototype.serialise = function () {
  return JSON.stringify(
    {
      contentTime : this.contentTime.toString(),
      wallClockTime : this.wallClockTime.toString(),
      timelineSpeedMultiplier : this.timelineSpeedMultiplier
    }
  );
}

/**
  @returns {ControlTimestamp} Creates a ControlTimestamp from a JSON formatted string as defined by ETSI TS 103 286 clause 5.7.5
*/
ControlTimestamp.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }

  var o = JSON.parse(jsonVal);

  return new ControlTimestamp(
      o.contentTime,
      o.wallClockTime,
      o.timelineSpeedMultiplier
  );
}

ControlTimestamp.prototype.toJson = function() {
  return this.serialise.call(this);
};

module.exports = ControlTimestamp;
