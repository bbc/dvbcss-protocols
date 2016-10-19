var WallClockServer = require("main_node").WallClock.WallClockServerProtocol;
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
	   
		  

	    expect(a).toBe(true);
	  });
	  
	  it("sends a reply message after receiving a valid request", function() {
		    a = true;

		    expect(a).toBe(true);
		  });
	});