var events = require("events");
var inherits = require("inherits");

var WallClockMessage = require("./WallClockMessage");
var Candidate = require("./Candidate");
var CorrelatedClock = require("dvbcss-clocks").CorrelatedClock;

var WeakMap = require('weakmap');
var PRIVATE = new WeakMap();

/**
 * @alias module:sync-protocols/WallClock.WallClockClientProtocol
 * @class
 * @description
 *
 * Protocol handler that implements a Wall Clock Client.
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
 * @param {Number} [options.requestInterval] The minimum interval between requests (in milliseconds)
 * @param {Number} [options.followupTimeout] The timeout on waiting for promised follow-up responses (in milliseconds)
 * @param {*} [options.dest] The destination that the client should use when sending not in response to a received message. The value used here will depend on the {SocketAdaptor} being used.
 *
 */
var WallClockClientProtocol = function(wallClock, serialiser, options) {
    events.EventEmitter.call(this);
    PRIVATE.set(this, {});
    var priv = PRIVATE.get(this);

    priv.serialiser = serialiser;

    priv.wallClock = wallClock;
    priv.parentClock = wallClock.parent;

    // initially unavailable and infinite dispersion
    priv.wallClock.correlation = priv.wallClock.correlation.butWith({initialError:Number.POSITIVE_INFINITY});
    priv.wallClock.speed = 1
    priv.wallClock.availabilityFlag = false;

    priv.altClock = new CorrelatedClock(priv.parentClock, {tickRate:wallClock.tickRate, correlation:wallClock.correlation});

    priv.sendTimer = null;

    priv.requestInterval = (options.requestInterval>0)?options.requestInterval:1000; // default
    priv.followupTimeout = (options.followupTimeout>0)?options.followupTimeout:3000; // default
    
    console.log("WallClockClientProtocol constructor");
    console.log(options);
    priv.dest = (options.dest)?options.dest:null;
    //console.log(priv.dest);

    priv.responseCache =new Map();
    priv.started = false;
}

inherits(WallClockClientProtocol, events.EventEmitter);

/**
 * @inheritdocs
 */
WallClockClientProtocol.prototype.start = function() {
	var priv = PRIVATE.get(this);
	 console.log("in WallClockClientProtocol.prototype.start");
	this._sendRequest();
    
    priv.started = true;
}

/**
 * @inheritdocs
 */
WallClockClientProtocol.prototype.stop = function() {
    var priv = PRIVATE.get(this);

    if (priv.sendTimer) {
        clearTimeout(priv.sendTimer);
        priv.sendTimer = null;
    }
    
    priv.started = false;
}

/**
 * Handle the process of sending a request to the WC server
 * @private
 */
WallClockClientProtocol.prototype._sendRequest = function() {
    var priv = PRIVATE.get(this);

    // cancel any existing timer
    if (priv.sendTimer) {
        clearTimeout(priv.sendTimer);
        priv.sendTimer = null;
    }

    // send a request
    var t = WallClockMessage.nanosToSecsAndNanos(priv.parentClock.getNanos());
    var msg = WallClockMessage.makeRequest(t[0],t[1]);
    msg = priv.serialiser.pack(msg);
    
//   console.log("in WallClockClientProtocol.prototype._sendRequest");
//   console.log(msg);
//   console.log(priv.dest);
    
    this.emit("send", msg, priv.dest);

    // schedule the timer
    priv.sendTimer = setTimeout(this._sendRequest.bind(this), priv.requestInterval);
}

/**
 * Handle a received Wall clock protocol message
 * @param {Object} msg The received message, not already deserialised
 * @param {*} routing Opaque data to be passed back when sending the response, to ensure it is routed back to the sender
 */
WallClockClientProtocol.prototype.handleMessage = function(msg, routing) {
    var priv = PRIVATE.get(this);

    var t4 = priv.parentClock.getNanos();
    
    msg = priv.serialiser.unpack(msg);

    var key = ""+msg.originate_timevalue_secs+":"+msg.originate_timevalue_nanos;

    if (msg.type == WallClockMessage.TYPES.responseWithFollowUp) {

        // follow-up is promised ... set timeout to use it
        var handle = setTimeout(function() {
            priv.responseCache.delete(key);
            this._updateClockIfCandidateIsImprovement(msg, t4);
        }.bind(this), priv.followupTimeout);
        priv.responseCache.set(key, handle);

    } else {
        if (msg.type == WallClockMessage.TYPES.followUp) {
            // followup! cancel the timer, if one is cached
            if (priv.responseCache.has(key)) {
                var handle = priv.responseCache.get(key);
                clearTimeout(handle);
                priv.responseCache.delete(key);
            }
        }
        this._updateClockIfCandidateIsImprovement(msg, t4);
    }
}

WallClockClientProtocol.prototype._updateClockIfCandidateIsImprovement = function(msg,t4) {
    var priv = PRIVATE.get(this);

    var candidate = new Candidate(msg,t4);
    var candidateCorrelation = candidate.toCorrelation(priv.wallClock);

    priv.altClock.setCorrelation(candidateCorrelation);

    var now = priv.wallClock.now();

    var dispersionNew = priv.altClock.dispersionAtTime(now);
    var dispersionExisting = priv.wallClock.dispersionAtTime(now);

    if (dispersionNew < dispersionExisting) {
        priv.wallClock.correlation = priv.altClock.correlation;
        priv.wallClock.availabilityFlag = true;
    }
}

/**
 * Returns true if this protocol handler is started.
 */
WallClockClientProtocol.prototype.isStarted = function() {
	var priv = PRIVATE.get(this);
	
	return priv.started ? true:false;
}

module.exports = WallClockClientProtocol;
