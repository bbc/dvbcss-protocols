
var clocks            = require("dvbcss-clocks");
var Correlation       = clocks.Correlation;
var ControlTimestamp  = require("../TimelineSynchronisation/ControlTimestamp");

/**
 * @alias module:sync-protocols/syncrelay.SyncRESPMessage.js
 * @class
 * @description
 * Object for representing cloud-sync response messages: response, responseWithFollowUp and followUp.
 *
 * @constructor
 * @param {Number} version Should be 0.
 * @param {SyncRESPMessage.TYPES} type.
 * @param {String} sessionId tThe session identifier e.g. lobby service room id.
 * @param {String} peerId Identifier of the sender of the request that triggered this response
 * @param {String} timelineSelector descriptor of selected timeline for sync
 * @param {Number} sigChangeThreshold Threshold value in milliseconds
 * @param {dvbcss-clocks.Correlation} syncTLCorr Correlation {WallClock time, SyncTimeline time}
*  @param {dvbcss-clocks.Correlation} contentTLCorr Correlation {SyncTimeline time, Content time}
 * @param {TimelineSynchronisation.ControlTimestamp} controlTimestamp a control timestamp to correlate media timelines with wall clock times.
 */
var SyncRESPMessage = function(version, type, sessionId, peerId, otherParams) {

	  const self = this;
	  Object.defineProperty(self, "version",    { enumerable: true, value: version});
    Object.defineProperty(self, "type",    { enumerable: true, value: type});
	  Object.defineProperty(self, "sessionId",  { enumerable: true, value: sessionId });
	  Object.defineProperty(self, 'peerId',          { enumerable: true, value: peerId });

    if (typeof otherParams.timelineSelector !== "undefined")
	     Object.defineProperty(self, 'timelineSelector',    { enumerable: true, value: otherParams.timelineSelector });

    if (typeof otherParams.sigChangeThreshold !== "undefined")
      Object.defineProperty(self, 'sigChangeThreshold', { enumerable: true, value: otherParams.sigChangeThreshold });

    if (typeof otherParams.syncTLCorr !== "undefined")
	   Object.defineProperty(self, 'syncTLCorr', { enumerable: true, value: otherParams.syncTLCorr });

    if (typeof otherParams.contentTLCorr !== "undefined")
	   Object.defineProperty(self, 'contentTLCorr', { enumerable: true, value: otherParams.contentTLCorr });

    if (typeof otherParams.controlTimestamp !== "undefined")
	   Object.defineProperty(self, 'controlTimestamp', { enumerable: true, value: otherParams.controlTimestamp });
}


/**
 * Values permitted for the 'type' field in a sync setup response message
 * @enum {Number}
 */
SyncRESPMessage.TYPES = {
    /** 1 - response **/
    response: 1,
    /** 2 - response with follow-up promised **/
    responseWithFollowUp: 2,
    /** 3 - follow-up response **/
    followUp: 3
};


/**
 * @returns {string} string representation of the message
 */
SyncRESPMessage.prototype.serialise = function () {
  return JSON.stringify(this);
}

exports.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal,  function (key, value) {
    if ((key == "syncTLCorr") || (key == "contentTLCorr")) {

				var c = JSON.parse(value);
        return new Correlation(c.parentTime, c.childTime, c.initialError, c.errorGrowthRate);
    }else if (key == "controlTimestamp") {

        return new ControlTimestamp(value.contentTime, value.wallClockTime, value.timelineSpeedMultiplier);
    }
     else {
        return value;
    }
  });


  var p = new Object();
  if (typeof o.timelineSelector !== "undefined") p.timelineSelector = o.timelineSelector;
  if (typeof o.sigChangeThreshold !== "undefined") p.sigChangeThreshold = o.sigChangeThreshold;
  if (typeof o.syncTLCorr !== "undefined") p.syncTLCorr = o.syncTLCorr;
  if (typeof o.contentTLCorr !== "undefined") p.contentTLCorr = o.contentTLCorr;
  if (typeof o.controlTimestamp !== "undefined") p.controlTimestamp = o.controlTimestamp;

  return new SyncRESPMessage(o.version,
                              o.type,
                              o.sessionId,
                              o.peerId,
                              p);
};

exports.createResponse = function(version, sessionId, peerId,  timelineSel, otherParams)
{
  //sigChangeThreshold, syncTLCorr, contentTLCorr, controlTimestamp

  var p = new Object();

	console.log(timelineSel);

  p.timelineSelector = timelineSel;

  if (typeof otherParams.sigChangeThreshold !== "undefined") p.sigChangeThreshold = otherParams.sigChangeThreshold;
  if (typeof otherParams.syncTLCorr !== "undefined") p.syncTLCorr = otherParams.syncTLCorr;
  if (typeof otherParams.contentTLCorr !== "undefined") p.contentTLCorr = otherParams.contentTLCorr;
  if (typeof otherParams.controlTimestamp !== "undefined") p.controlTimestamp = otherParams.controlTimestamp;

  return new SyncRESPMessage(version,
                              SyncRESPMessage.TYPES.response,
                              sessionId,
                              peerId,
                              p);
};

exports.createResponseWithFollowUp = function(version, sessionId, peerId)
{
  var p = new Object();
  return new SyncRESPMessage(version,
                              SyncRESPMessage.TYPES.responseWithFollowUp,
                              sessionId,
                              peerId,
                              p);
};

// TODO: refine message definition, test for compulsory params in otherParams e.g. syncTLCorr and contentTLCorr
exports.createFollowUp = function(version, sessionId, peerId,  timelineSel, otherParams)
{
  var p = new Object();
  p.timelineSelector = timelineSel;

  if (typeof otherParams.sigChangeThreshold !== "undefined") p.sigChangeThreshold = otherParams.sigChangeThreshold;
  if (typeof otherParams.syncTLCorr !== "undefined") p.syncTLCorr = otherParams.syncTLCorr;
  if (typeof otherParams.contentTLCorr !== "undefined") p.contentTLCorr = otherParams.contentTLCorr;
  if (typeof otherParams.controlTimestamp !== "undefined") p.controlTimestamp = otherParams.controlTimestamp;

  return new SyncRESPMessage(version,
                              SyncRESPMessage.TYPES.followUp,
                              sessionId,
                              peerId,
                              p);
};
