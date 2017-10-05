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

