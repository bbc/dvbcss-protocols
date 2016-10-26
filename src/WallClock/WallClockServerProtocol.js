var events = require("events");
var inherits = require("inherits");

var WallClockMessage = require("./WallClockMessage");
var CorrelatedClock = require("dvbcss-clocks").CorrelatedClock;
var WeakMap = require('weakmap');
var PRIVATE = new WeakMap();

require("js-object-clone");


/**
 * @alias module:sync-protocols/WallClock.WallClockServerProtocol
 * @class
 * @description
 *
 * Protocol handler that implements a Wall Clock Server .
 *
 * <p>Emits a {@link event:send} to send messages, and is passed received
 * messages by calling [handleMessage()]{@link WallClockClientProtocol#handleMessage}
 *
 * <p>Is independent of the underlying type of connection (e.g. WebSocket / UDP)
 * and of the message format used on the wire. You provide a {ProtocolSerialiser}
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
//    console.log("WallClockServerProtocol.prototype.handleMessage request received");
//    console.log(routing);
    
    if (routing.binary===true)
    {
    	data = new Uint8Array(msg);
    }
    
//    console.log(data);
    
    // receive time value
    var t2 = priv.wallClock.getNanos();
  
    var request = priv.serialiser.unpack(data.buffer);

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
