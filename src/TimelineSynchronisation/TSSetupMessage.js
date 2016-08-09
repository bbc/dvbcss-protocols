/**
 * @alias module:sync-protocols/TimelineSynchronisation.TSSetupMessage
 * @class
 * @description
 * Object representing the setup message for the timeline synchronistation protocol that is sent from the client to the server initially. See ETSI TS XXX
 *
 * @constructor
 * @param {string} contentIdStem is a string value consisting of a CI stem.
 * @param {string} timelineSelector is a string value consisting of a URI that indicates which Synchronisation Timeline is to be used for Timestamps.
 */

function TSSetupMessage (contentIdStem, timelineSelector) {
  this.contentIdStem = contentIdStem;
  this.timelineSelector = timelineSelector;

  if (typeof contentIdStem !== "string" || typeof timelineSelector !== "string") {
    throw "TSSetupMessage(): Invalid parameters.";
  }
};

TSSetupMessage.prototype.serialise = function () {
  return JSON.stringify(this);
};

TSSetupMessage.deserialise = function (jsonVal) {
  var o = JSON.parse(jsonVal);

  return new TSSetupMessage (o.contentIdStem, o.timelineSelector);
};

module.exports = TSSetupMessage;
