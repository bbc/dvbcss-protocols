/****************************************************************************
 * Copyright 2017 Institut für Rundfunktechnik
 * and contributions Copyright 2017 British Broadcasting Corporation.
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
 * --------------------------------------------------------------------------
 * Summary of parts containing contributions
 *   by British Broadcasting Corporation (BBC):
 *     TSClientProtocol.prototype.handleMessage :
 *         availablility and change significance checks
*****************************************************************************/

var events = require("events");
var inherits = require("inherits");

var TSSetupMessage         = require("./TSSetupMessage");
var ControlTimestamp       = require("./ControlTimestamp");
var PresentationTimestamp  = require("./PresentationTimestamp");
var PresentationTimestamps = require("./PresentationTimestamps");

var clocks          = require("dvbcss-clocks");
var Correlation     = clocks.Correlation;
var CorrelatedClock = clocks.CorrelatedClock;

var WeakMap = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
var PRIVATE = new WeakMap();

/**
 * @memberof dvbcss-protocols.TimelineSynchronisation
 * @class
 * @description Implementation of the client part of the timeline synchroniation protocol as defined in DVB CSS.
   With start() the protocol is initiated. The CorrelatedClock object passed into the constructor is updated with ControlTimestamps
   send by the server (MSAS).
 *
 * @implements ProtocolHandler
 *
 * @constructor
 * @param {CorrelatedClock} syncTLClock The clock to represent the timeline. It will be updated according to the timestamp messages received.
 * @param {Object} options Options for this TSClientProtocol handler
 * @param {string} options.contentIdStem The Content Identifier stem is considered to match the timed content currently being presented by the TV Device
 * @param {string} options.timelineSelector The Timeline Selector describes the type and location of timeline signalling to be derived from the Timed Content
currently being presented by the TV Device
 * @param {Number} [options.tickrate] The tickrate of the timeline that is specified by the timelineSelector. If specified, then will be used to set the tickrate of teh provided clock.
 * @param {*} [options.dest] The destination that the client should use when sending not in response to a received message. The value used here will depend on the {SocketAdaptor} being used.
 */

function TSClientProtocol (syncTLClock, options) {
  if (!(
      typeof syncTLClock.setCorrelation == "function" &&
      typeof options.contentIdStem == "string" &&
      typeof options.timelineSelector == "string"
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
  var tr = Number(options.tickRate);
  if (!isNaN(tr) && tr > 0) {
      syncTLClock.tickRate = tr;
  }

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
      var correlation = new Correlation(syncTLClock.parent.fromNanos(cts.wallClockTime), cts.contentTime);
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
