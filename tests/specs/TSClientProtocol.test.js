var WebSocketAdaptor = require("main_node").SocketAdaptors.WebSocketAdaptor;
var TSClientProtocol = require("main_node").TimelineSynchronisation.TSClientProtocol;
var TSSetupMessage = require("main_node").TimelineSynchronisation.TSSetupMessage;
var ControlTimestamp = require("main_node").TimelineSynchronisation.ControlTimestamp;

var CorrelatedClock  = require("dvbcss-clocks").CorrelatedClock;
var DateNowClock  = require("dvbcss-clocks").DateNowClock;

var EventEmitter = require("events");
var inherits = require("inherits");

var MockWebSocket = function(url) {
    var emitter = new EventEmitter();

    this.url = url;

    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;

    this.readyState = this.CONNECTING;

    this.send = jasmine.createSpy("send");
    this.close = jasmine.createSpy("close");

    this.addEventListener    = emitter.addListener.bind(emitter);
    this.removeEventListener = emitter.removeListener.bind(emitter);

    this.triggerEvent = function() {
        var name = arguments[0];
        emitter.emit.apply(emitter, arguments);
        if (typeof this["on"+name] !== "undefined") {
            this["on"+name].apply(this, arguments);
        }
    };
};

inherits(MockWebSocket, EventEmitter);

var MockClock = function() {
    var clock = new CorrelatedClock(new DateNowClock(), {tickRate:2000});
    clock.availabilityFlag = false;
    return clock;
};


describe("TSClientProtocol", function() {
    var ws;
    var clock;
    var options  = {timelineSelector : "urn:", contentIdStem : "http://myserver.org/myvideo.mp4", tickrate : 2000};
//    var protocol;

    beforeEach(function() {
        ws = new MockWebSocket("ws://127.0.0.1");
        clock = new MockClock();
    });

    it("exists", function() {
        expect(TSClientProtocol).toBeDefined();
    });

    it("can be instantiated.", function () {
      spyOn(clock, "setAvailabilityFlag").and.callThrough();

      var tscp = new TSClientProtocol(clock, options);

      expect(tscp).toBeDefined();
      expect(clock.setAvailabilityFlag).toHaveBeenCalled();
    });

    it("sends setup message when start is called from WebSocketAdaptor.", function () {
        var tscp = new TSClientProtocol(clock, options);
        var wsAd = new WebSocketAdaptor(tscp, ws);

        //ws.readyState = ws.OPEN;
        ws.triggerEvent("open", {});
        expect(ws.send).toHaveBeenCalledWith(new TSSetupMessage(options.contentIdStem, options.timelineSelector).serialise(), {binary:false});
    });

    it("initialises the CorrelatedClock object when it receives the first control timestamp.", function() {

      spyOn(clock, "setCorrelationAndSpeed").and.callThrough();
      spyOn(clock, "isChangeSignificant").and.callThrough();
      spyOn(clock, "setAvailabilityFlag").and.callThrough();;

      var tscp = new TSClientProtocol(clock, options);
      var wsAd = new WebSocketAdaptor(tscp, ws);
      var cts = new ControlTimestamp(1, 2, 1.0);

      ws.triggerEvent("message", {data: cts.serialise()});

      expect(clock.setAvailabilityFlag).toHaveBeenCalledWith(true);
      expect(clock.setCorrelationAndSpeed).toHaveBeenCalled();

    });

    it("updates the CorrelatedClock object when it receives a control timestamp with a significant change.", function() {

      spyOn(clock, "isChangeSignificant").and.callThrough();
      spyOn(clock, "setAvailabilityFlag").and.callThrough();

      var tscp = new TSClientProtocol(clock, options);
      var wsAd = new WebSocketAdaptor(tscp, ws);
      var cts1 = new ControlTimestamp(1, 2, 1.0);
      var cts2 = new ControlTimestamp(2000000, 2, 1.0);
      
      console.log(clock.availabilityFlag);

      ws.triggerEvent("message", {data: cts1.serialise()});
      spyOn(clock, "setCorrelationAndSpeed").and.callThrough();
      ws.triggerEvent("message", {data: cts2.serialise()});


      expect(clock.isChangeSignificant).toHaveBeenCalled();
      expect(clock.setAvailabilityFlag).toHaveBeenCalledWith(true);
      expect(clock.setCorrelationAndSpeed).toHaveBeenCalled();

    });


});
