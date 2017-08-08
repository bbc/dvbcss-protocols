var events = require("events");
var inherits = require("inherits");

var CIIMessage = require("./CIIMessage");
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
  
  // initial "state" assumed before messages are received.
  priv.cii = new CIIMessage(null, null, null, null, null, null, null, null);

  if (clientOptions instanceof Object) {
      priv.CIIChangeCallback = clientOptions.callback
  }

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
  var changemask;
  var changeNames = {};

//  console.log("CIIClientProtocol.prototype.handleMessage() - received CII message: " + msg);

   var receivedCII = CIIMessage.deserialise(msg);

  if (typeof receivedCII !== "undefined")
  {
    changemask = priv.cii.compare(receivedCII, changeNames);

    if (priv.lastCII === undefined) {
    	changemask |= CIIMessage.prototype.CIIChangeMask.FIRST_CII_RECEIVED;
    }
    priv.lastCII = receivedCII;
    priv.cii = priv.cii.merge(receivedCII);

    if ((changemask != 0) ) {
        if (priv.CIIChangeCallback !== undefined) {
        	priv.CIIChangeCallback(priv.cii, changemask);
        }
        this.emit("change", priv.cii, changeNames, changemask);
    }

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
