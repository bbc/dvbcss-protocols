/**
 * @alias module:sync-protocols/TimelineSynchronisation.PresentationTimestamp
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
    throw "Invalid parameters: not a number.";
  }
}

/**
 * Method intended to be called from PresentationTimestamps.deserialise
 * @returns {PresentationTimestamp} translates an object into a PresentationTimestamp.
 */
PresentationTimestamp.getFromObj = function (o) {
  return new PresentationTimestamp(o.contentTime, o.wallClockTime);
}

module.exports = PresentationTimestamp;
