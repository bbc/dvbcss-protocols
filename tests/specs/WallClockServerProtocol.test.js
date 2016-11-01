var WallClockServerProtocol = require("main_node").WallClock.WallClockServerProtocol;
var WallClockMessage = require("main_node").WallClock.WallClockMessage;
var BinarySerialiser = require("main_node").WallClock.BinarySerialiser;
var clocks = require("dvbcss-clocks");




describe("WallClockServerProtocol UDP", function() {
	  
	var wc_server;
	var sysClock;
	var wallClock;
	var precision;
	var protocolOptions;

	  beforeAll(function() {
		sysClock = new clocks.DateNowClock();
		wallClock = new clocks.CorrelatedClock(sysClock);

		precision = sysClock.dispersionAtTime(sysClock.now());
		protocolOptions = {
		  	precision: sysClock.dispersionAtTime(sysClock.now()),
		  	maxFreqError: sysClock.getRootMaxFreqError(),
		  	followup: false
		  };
		
		wc_server =  new WallClockServerProtocol(
	            wallClock,
	            BinarySerialiser,
	            protocolOptions
	        );
	  });

	  it("exists", function() {
	        expect(WallClockServerProtocol).toBeDefined();
	    });

	  it("sends a reply after receiving a valid request", function() {
		  var wcMsg = new WallClockMessage(0, WallClockMessage.TYPES.request, 2, 3, 4, 5, 6, 7);
		  var msg = BinarySerialiser.pack(wcMsg);
		  var routing = { "a":5 };
		  
		  var eventHandler = jasmine.createSpy("eventhandler");
		  
		  wc_server.on("send", eventHandler);
		  wc_server.handleMessage(msg, routing);

		  expect(eventHandler).toHaveBeenCalled();
		  expect(eventHandler.calls.count()).toEqual(1);
		  
		  var args = eventHandler.calls.argsFor(0);
		  expect(args.length).toEqual(2);
		  expect(args[1]).toEqual(routing);
		  var reply = BinarySerialiser.unpack(args[0]);
		  expect(reply.type).toEqual(WallClockMessage.TYPES.response);
	  });
	  
	});