var dgram = require("dgram");
var SyncProtocols = require("sync-protocols");
var clocks = require("dvbcss-clocks");
var createServer = SyncProtocols.WallClock.createBinaryUdpServer; 
var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock);


var precision = sysClock.dispersionAtTime(sysClock.now());
var protocolOptions = {
	precision: sysClock.dispersionAtTime(sysClock.now()),
	maxFreqError: sysClock.getRootMaxFreqError(),
	followup: true
};

var udpSocket = dgram.createSocket({type:'udp4', reuseAddr:true});

udpSocket.on('listening', function() {
    var wcServer = createServer(udpSocket, wallClock, protocolOptions);

    var address = udpSocket.address();
    console.log(`wallclock server listening ${address.address}:${address.port}`);
    
    console.log(wcServer.isStarted());

});

udpSocket.bind(6677);

