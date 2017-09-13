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
