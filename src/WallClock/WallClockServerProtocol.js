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

var WallClockMessage = require("./WallClockMessage");
var CorrelatedClock = require("dvbcss-clocks").CorrelatedClock;
var WeakMap = (typeof window !== "undefined" && window.WeakMap) || require('weak-map');
var PRIVATE = new WeakMap();

require("js-object-clone");


/**
 * @memberof dvbcss-protocols.WallClock
 * @class
 * @description
 *
 * Protocol handler that implements a Wall Clock Server .
 *
 * <p>Emits a {@link event:send} to send messages, and is passed received
 * messages by calling [handleMessage()]{@link dvbcss-protocols.WallClock.WallClockClientProtocol#handleMessage}
 *
 * <p>Is independent of the underlying type of connection (e.g. WebSocket / UDP)
 * and of the message format used on the wire. You provide a {@link ProtocolSerialiser}
 *
 * <p>Message payloads for sending or receiving are accompanied by opaque "destination"
 * routing data that this class uses as an opaque handle for the server being interacted
 * with.
 *
 * @implements ProtocolHandler
 *
 * @constructor
 * @param {CorrelatedClock} wallClock
 * @param {ProtocolSerialiser} serialiser Object with pack() and unpack() methods, suitable for this particular protocol
 * @param {object} [options] Protocol handler options
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {String} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Number} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 */
var WallClockServerProtocol = function(wallClock, serialiser, protocolOptions) {
    events.EventEmitter.call(this);
    PRIVATE.set(this, {});
    var priv = PRIVATE.get(this);

    priv.serialiser = serialiser;

    priv.wallClock = wallClock;
    priv.parentClock = wallClock.parent;

    // initially unavailable and infinite dispersion
    priv.wallClock.speed = 1
    priv.wallClock.availabilityFlag = true;


    priv.precision = (protocolOptions.precision)?protocolOptions.precision:wallClock.dispersionAtTime(wallClock.now());
    priv.maxFreqError = (protocolOptions.maxFreqError)?protocolOptions.maxFreqError:wallClock.getRootMaxFreqError();
    priv.followup = (protocolOptions.followup)?protocolOptions.followup:false;

    priv.started = false;

}

inherits(WallClockServerProtocol, events.EventEmitter);

/**
 * @inheritdocs
 */
WallClockServerProtocol.prototype.start = function() {
    var priv = PRIVATE.get(this);
    priv.started = true;
}

/**
 * @inheritdocs
 */
WallClockServerProtocol.prototype.stop = function() {
    var priv = PRIVATE.get(this);
    priv.started = false;
}

/**
 * Handle a received Wall clock protocol request message. Sends back a response and if followup flag set to true, it sends back a followup
 * @param {Object} msg The received message, not already deserialised
 * @param {*} routing Opaque data to be passed back when sending the response, to ensure it is routed back to the sender
 */
WallClockServerProtocol.prototype.handleMessage = function(msg, routing) {
    var priv = PRIVATE.get(this);
    var reply;
    var data = msg;
    priv.started = true;

    // receive time value
    var t2 = priv.wallClock.getNanos();

    var request = priv.serialiser.unpack(data);

    if (request.type == WallClockMessage.TYPES.request) {

        if (priv.followup)
        {
            reply = request.toResponse(WallClockMessage.TYPES.responseWithFollowUp, priv.precision, priv.maxFreqError, t2,  priv.wallClock.getNanos());
        }else
        {
            reply = request.toResponse(WallClockMessage.TYPES.response, priv.precision, priv.maxFreqError, t2,  priv.wallClock.getNanos());
        }
//        console.log("WallClockServerProtocol.prototype.handleMessage reply");
//        console.log(reply);

        var serialised_reply = priv.serialiser.pack(reply);
        this.emit("send", serialised_reply, routing);


        if (priv.followup)
        {
            var followupReply = Object.clone(reply);
            followupReply.type = WallClockMessage.TYPES.followUp;
            followupReply.transmit_timevalue = priv.wallClock.getNanos();

            serialised_reply = priv.serialiser.pack(followupReply);
            this.emit("send", serialised_reply, routing);
        }


    } else {
        console.error("WallClockServerProtocol.handlerMessage: received a non-request message");
    }
}

/**
 * Returns true if this protocol handler is started.
 */
WallClockServerProtocol.prototype.isStarted = function() {
    var priv = PRIVATE.get(this);
    return priv.started ? true:false;
}

module.exports = WallClockServerProtocol;
