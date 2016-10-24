var WebSocket = require('ws');
var SyncProtocols = require("sync-protocols");
var clocks = require("dvbcss-clocks");
var createClient = SyncProtocols.WallClock.createBinaryWebSocketClient;
var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock);

var ws = new WebSocket('ws://192.168.0.11:6675/wc');
var protocolOptions = {
    dest: { address:"ws://192.168.0.11:6675/wc", port:6675, format: { binary: true, mask: true }},
};


ws.on('open', function() {
    var wcClient = createClient(ws, wallClock, protocolOptions);

    setInterval(function() {
        console.log("WallClock = ",wallClock.now());
        console.log("dispersion = ",wallClock.dispersionAtTime(wallClock.now()));
    },1000);

});
