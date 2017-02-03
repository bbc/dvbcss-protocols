var events    = require("events");
var inherits  = require("inherits");
var ciiObject       = require("./CII");
var WeakMap = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
var PRIVATE   = new WeakMap();
/**
 * @alias module:sync-protocols/CII.CIIClientProtocol
 * @class
 * @description Implementation of the client part of the CII protocol as defined in DVB CSS.
   With start() the protocol is initiated.
 *
 * @implements ProtocolHandler
 *
 * @constructor
 */

function CIIClientProtocol (options) {

  events.EventEmitter.call(this);
  PRIVATE.set(this, {});
  var priv = PRIVATE.get(this);

  //
  // // the clock object this CIIClientProtocol shall manage
  // priv.syncTLClock = syncTLClock;
  //
  // // the content id stem for the setup message
  // priv.contentIdStem = options.contentIdStem;
  // // the timeline selector identifying the synchronisation timeline
  // priv.timelineSelector = options.timelineSelector;
  // // the tickrate of the timeline in ticks per seconds
  // priv.tickrate = options.tickrate;
  //
  // priv.dest = (options.dest)?options.dest:null;
  //
  // priv.syncTLClock.setAvailabilityFlag(false);

    Object.defineProperty(self, 'lastCII', { value: undefined });


}

inherits(CIIClientProtocol, events.EventEmitter);




/**
 * @inheritdocs
 */
CIIClientProtocol.prototype.start = function() {

  var priv = PRIVATE.get(this);
  priv.started = true;
}


/**
 * @inheritdocs
 */
CIIClientProtocol.prototype.stop = function() {
  var priv = PRIVATE.get(this);
  priv.started = false;
}

/**
 * Handle CII messages .
 *
 * @param {string} msg the control timestamp as defined in DVB CSS
 */
CIIClientProtocol.prototype.handleMessage = function (msg) {
  var priv = PRIVATE.get(this);

  var changemask = 0;

  var receivedCII = ciiObject.deserialise(msg);

  if (typeof receivedCII !== "undefined")
  {
    if (typeof this.lastCII === "undefined")
    {
        this.emit("CII_CHANGED", receivedCII, changemask | receivedCII.CIIChangeMask.FIRST_CII_RECEIVED);
    }else {
      changemask = receivedCII.compare(this.lastCII);

      if (changemask > 0)        {
          this.emit("CII_CHANGED", receivedCII, changemask);
      }
  }
};


/**
 * Returns true if this protocol handler is started.
 */
CIIClientProtocol.prototype.isStarted = function() {
	var priv = PRIVATE.get(this);

	return priv.started ? true:false;
}

module.exports = CIIClientProtocol;
