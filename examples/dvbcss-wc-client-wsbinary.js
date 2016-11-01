var WebSocket = require('ws');
var SyncProtocols = require("sync-protocols");
var clocks = require("dvbcss-clocks");
var createClient = SyncProtocols.WallClock.createBinaryWebSocketClient;
var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock);

var ws = new WebSocket('ws://localhost:6676/wc');
var protocolOptions = {
    dest: { address:"ws://localhost:6676/wc", port:6676 },
};


ws.on('open', function() {
    var wcClient = createClient(ws, wallClock, protocolOptions);

    setInterval(function() {
        console.log("WallClock = ",wallClock.now());
        console.log("dispersion = ",wallClock.dispersionAtTime(wallClock.now()));
    },1000);

});
