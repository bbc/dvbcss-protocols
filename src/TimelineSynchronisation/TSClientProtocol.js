var events = require("events");
var inherits = require("inherits");

var TSSetupMessage         = require("./TSSetupMessage");
var ControlTimestamp       = require("./ControlTimestamp");
var PresentationTimestamp  = require("./PresentationTimestamp");
var PresentationTimestamps = require("./PresentationTimestamps");

var Correlation     = require("dvbcss-clocks").Correlation;
var CorrelatedClock = require("dvbcss-clocks").CorrelatedClock;

var WeakMap = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
var PRIVATE = new WeakMap();
/**
 * @alias module:sync-protocols/TimelineSynchronisation.TSClientProtocol
 * @class
 * @description Implementation of the client part of the timeline synchroniation protocol as defined in DVB CSS.
   With start() the protocol is initiated. The CorrelatedClock object passed into the constructor is updated with ControlTimestamps
   send by the server (MSAS).
 *
 * @implements ProtocolHandler
 *
 * @constructor
 * @param {CorrelatedClock} syncTLClock a "fresh" CorrelatedClock
 * @param {Object} options Options for this TSClientProtocol handler
 * @param {string} options.contentIdStem The Content Identifier stem is considered to match the timed content currently being presented by the TV Device
 * @param {string} options.timelineSelector The Timeline Selector describes the type and location of timeline signalling to be derived from the Timed Content
currently being presented by the TV Device
 * @param {Number} options.tickrate The tickrate of the timeline that is specified by the timelineSelector.
 * @param {*} [options.dest] The destination that the client should use when sending not in response to a received message. The value used here will depend on the {SocketAdaptor} being used.
 */

function TSClientProtocol (syncTLClock, options) {
  if (!(
      syncTLClock instanceof CorrelatedClock &&
      typeof options.contentIdStem == "string" &&
      typeof options.timelineSelector == "string" &&
      !isNaN(options.tickrate)
  ))
  {
    throw "TSClientProtocol(): Invalid parameters";
  }

  events.EventEmitter.call(this);
  PRIVATE.set(this, {});
  var priv = PRIVATE.get(this);

  // the clock object this TSClientProtocol shall manage
  priv.syncTLClock = syncTLClock;

  // the content id stem for the setup message
  priv.contentIdStem = options.contentIdStem;
  // the timeline selector identifying the synchronisation timeline
  priv.timelineSelector = options.timelineSelector;
  // the tickrate of the timeline in ticks per seconds
  priv.tickrate = options.tickrate;

  priv.dest = (options.dest)?options.dest:null;

  priv.syncTLClock.setAvailabilityFlag(false);
}

inherits(TSClientProtocol, events.EventEmitter);

/**
 * @inheritdocs
 */
TSClientProtocol.prototype.start = function() {
    this._sendSetupMessage();
}


/**
 * @inheritdocs
 */
TSClientProtocol.prototype.stop = function() {
  var priv = PRIVATE.get(this);
  var syncTLClock = priv.syncTLClock;
  syncTLClock.setAvailabilityFlag(false);
}

/*
 * Start the protocol by sending the setup message to the server.
 */
TSClientProtocol.prototype._sendSetupMessage = function () {
  var priv = PRIVATE.get(this);

  var setupMsg = new TSSetupMessage(priv.contentIdStem, priv.timelineSelector);
  this.emit("send", setupMsg.serialise(), priv.dest);
}

/**
 * Handle control timestamps and update CorrelatedClock that represents the synchronisation timeline.
 *
 * @param {string} msg the control timestamp as defined in DVB CSS
 */
TSClientProtocol.prototype.handleMessage = function (msg) {
  var priv = PRIVATE.get(this);
  var syncTLClock = priv.syncTLClock;

  try {
    var cts = ControlTimestamp.deserialise(msg);
    priv.prevControlTimestamp = cts;

    var isAvailable = (cts.contentTime !== null);

    if (isAvailable) {
      var correlation = new Correlation(cts.wallClockTime, cts.contentTime);
      var speed = cts.timelineSpeedMultiplier;

      if (!syncTLClock.availabilityFlag || syncTLClock.isChangeSignificant(correlation, speed, 0.010)) {
        syncTLClock.setCorrelationAndSpeed(correlation, speed);
      }
    }

    syncTLClock.setAvailabilityFlag(isAvailable);

  } catch (e) {

    throw "TSCP handleMessage: exception: " + e + " -- msg: " + msg;
  }
};


module.exports = TSClientProtocol;
