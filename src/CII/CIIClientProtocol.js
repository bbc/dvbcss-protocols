/****************************************************************************
 * Copyright 2017 British Broadcasting Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*****************************************************************************/

var events = require("events");
var inherits = require("inherits");

var CIIMessage = require("./CIIMessage");
var WeakMap   = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
var PRIVATE   = new WeakMap();


/**
 * CII Client callback
 * @callback ciiChangedCallback
 * @param {sync-protocols.CII.CIIMessage} cii The current CII state
 * @param {Number} changemask A [bitfield mask]{@link sync-protocols.CII.CIIMessage.CIIChangeMask} describing which CII properties have just changed
 */


/**
 * @memberof sync-protocols.CII
 * @class
 * @description Implementation of the client part of the CII protocol as defined in DVB CSS.
   With start() the protocol is initiated.
 *
 * @implements ProtocolHandler
 * @fires sync-protocols.CII.CIIClientProtocol#change
 *
 * @constructor
 * @param {Object} [clientOptions] Optional. Parameters for this protocol client.
 * @param {ciiChangedCallback} [clientOptions.callback] Optional. Specify a callback function that will be passed the 
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

  /**
   * The current CII state, as shared by the server (the TV).
   * This is not the most recently received message (since that may only
   * describe changes since the previous message). Instead this is the result
   * of applying those changes to update the client side model of the server
   * side CII state.
   * @property {CIIMessage}
   * @name sync-protocols.CII.CIIClientProtocol#cii
   */
  Object.defineProperty(this, 'cii', {
      enumerable: true,
      get: function() { return priv.cii }
  })
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
        /**
         * @memberof sync-protocols.CII.CIIClientProtocol
         * @event change
         * @description
         * The CII state of the server has changed.
         * @param {sync-protocols.CII.CIIMessage} cii The current CII state of the server
         * @param {Object} changedNames 
         * @param {number} changeMask A [bitfield mask]{@link sync-protocols.CII.CIIMessage.CIIChangeMask} describing which CII properties have just changed
         */
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

