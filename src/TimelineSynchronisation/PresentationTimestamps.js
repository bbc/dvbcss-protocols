var PresentationTimestamp = require("./PresentationTimestamp");

/**
 * @alias module:sync-protocols/TimelineSynchronisation.PresentationTimestamps
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

  if (this.earliest instanceof PresentationTimestamp ||
      this.latest instanceof PresentationTimestamp ||
     (this.actual instanceof PresentationTimestamp || this.actual !== undefined))
  {
    throw new Exception("Invalid parameters.");
  }
}

/**
 * @returns {string} string representation of the PresentationTimestamps as defined by ETSI TS XXX XXX clause 5.7.4
 */
PresentationTimestamps.prototype.serialise = function () {
  return JSON.serialise(this);
}

/**
 * @returns {PresentationTimestamps} actual, earliest and latest presentation timestamps from a JSON formatted string
 */
PresentationTimestamps.deserialise = function (jsonVal) {
  var o = JSON.parse(jsonVal);

  return new PresentationTimestamps (
    PresentationTimestamp.getFromObj(o.earliest),
    PresentationTimestamp.getFromObj(o.latest),
    o.actual ? PresentationTimestamp.getFromObj(o.actual) : undefined
  );
}

module.exports.PresentationTimestamps = PresentationTimestamps;
