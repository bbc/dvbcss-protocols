var events = require("events");
var inherits = require("inherits");

var CIIObject = require("./CIIMessage");
var WeakMap   = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
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

function CIIClientProtocol (clientOptions) {
 events.EventEmitter.call(this);
  PRIVATE.set(this, {});
  var priv = PRIVATE.get(this);

  Object.defineProperty(this, "CIIChangeCallback", {value: clientOptions.callback});

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

//  console.log("CIIClientProtocol.prototype.handleMessage() - received CII message: " + msg);

   var receivedCII = CIIObject.prototype.deserialise(msg);

  if (typeof receivedCII !== "undefined")
  {
    if (typeof priv.lastCII === "undefined")
    	changemask |= CIIObject.prototype.CIIChangeMask.FIRST_CII_RECEIVED;
    else
      changemask = receivedCII.compare(priv.lastCII);

//    console.log("changemask: " + changemask);

    if ((changemask > 0)  && (typeof this.CIIChangeCallback !='undefined'))    {
    	this.CIIChangeCallback(receivedCII, changemask);
    }
    priv.lastCII = receivedCII;

  }
};


/**
 * Returns true if this protocol handler is started.
 */
CIIClientProtocol.prototype.isStarted = function() {
	var priv = PRIVATE.get(this);

	return priv.started ? true:false;
};

module.exports = CIIClientProtocol;
