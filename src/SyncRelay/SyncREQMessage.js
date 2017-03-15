var TimelineProperties = require("../CII/TimelineProperties");


/**
 * @alias module:sync-protocols/syncrelay.SyncREQ.js
 * @class
 * @description
 * Object for representing a cloud-sync setup message.
 *
 * @constructor
 * @param {Number} version Should be 0.
 * @param {String} sessionId tThe session identifier e.g. lobby service room id.
 * @param {String} peerId Identifier of sender
 * @param {String} contentId Identifier of main content at sender.
 * @param {Array} timelines List of TimelineProperties
 * @param {String} TimelineProperties.timelineSelector Descriptor for timeline type
 * @param {Number} TimelineProperties.unitsPerTick Units per tick
 * @param {Number} TimelineProperties.unitsPerSecond Timeline's tickrate
 * @param {String} syncMasterSecret A secret known only by the synchronisation master
 */
var SyncREQMessage = function(version, sessionId, peerId, contentId, timelines, syncMasterSecret) {

	  const self = this;
	  Object.defineProperty(self, "version",    { enumerable: true, value: version});
	  Object.defineProperty(self, "sessionId",  { enumerable: true, value: sessionId });
	  Object.defineProperty(self, 'peerId',          { enumerable: true, value: peerId });
	  Object.defineProperty(self, 'contentId',    { enumerable: true, value: contentId });
	  Object.defineProperty(self, 'timelines', { enumerable: true, value: timelines });
	  Object.defineProperty(self, 'syncMasterSecret', { enumerable: true, value: syncMasterSecret });
}

/**
 * @returns {string} string representation of the message
 */
SyncREQMessage.prototype.serialise = function () {
  return JSON.stringify(this);
}

SyncREQMessage.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);
  console.log(jsonVal);
  var myTimelines= [];
  var timeline;

  if (Array.isArray(o.timelines))
  {
      o.timelines.forEach(function(timelineObj) {

        timeline = TimelineProperties.getFromObj(timelineObj);

        if (typeof timeline !== "undefined")
        {
          myTimelines.push(timeline);
        }
    });
  }

  return new SyncREQMessage (o.version, o.sessionId, o.peerId, o.contentId, myTimelines, o.syncMasterSecret);
};

module.exports = SyncREQMessage;
