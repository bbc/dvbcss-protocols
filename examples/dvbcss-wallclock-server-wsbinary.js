var WebSocketServer = require("ws").Server;
var SyncProtocols = require("sync-protocols");
var clocks = require("dvbcss-clocks");
var createServer = SyncProtocols.WallClock.createBinaryWebSocketServer;
var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock);


var precision = sysClock.dispersionAtTime(sysClock.now());
var protocolOptions = {
	precision: sysClock.dispersionAtTime(sysClock.now()),
	maxFreqError: sysClock.getRootMaxFreqError(),
	followup: true
};
console.log("WallClock server (binary + websockets) ...");

var wss = new WebSocketServer({ host: "172.20.10.2", port: 6676 });

wss.on('connection', function connection(ws) {

	var wcServer = createServer(ws, wallClock, protocolOptions);
	console.log("Handler created for new connection");

});
