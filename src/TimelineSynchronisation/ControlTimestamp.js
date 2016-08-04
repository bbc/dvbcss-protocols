/**
 * @alias module:sync-protocols/TimelineSynchronisation.ControlTimestamp
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
}

/**
 * @return a string representation of this ControlTimestamp as defined by ETSI TS XXX XXX clause 5.7.5
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
  @returns {ControlTimestamp} Creates a ControlTimestamp from a JSON formatted string as defined by ETSI TS XXX clause 5.7.5
*/
ControlTimestamp.deserialise = function (jsonVal) {
  var o = JSON.parse(jsonVal);

  return new ControlTimestamp(
      o.contentTime,
      o.wallClockTime,
      o.timelineSpeedMultiplier
  );
}

module.exports.ControlTimestamp = ControlTimestamp;
