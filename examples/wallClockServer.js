#!/usr/bin/env node
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
var Protocols = require("..");
var clocks = require("dvbcss-clocks");
var createServer = Protocols.WallClock.createBinaryUdpServer; 

var program = require("commander");
var BIND_HOST = '0.0.0.0';
var BIND_PORT = 6677

program
	.version('0.0.1')
	.description(`UDP Wall clock server bound to the specified interface (default ${BIND_HOST}) and port (default ${BIND_PORT}).`)
	.arguments('[<bindHost>] [<bindPort>]')
	.action(function (bindHost, bindPort) {
		if (bindHost !== undefined) {
			BIND_HOST = String(bindHost)
		}
		if (bindPort !== undefined) {
			BIND_PORT = Number(bindPort)
		}
	})

program.parse(process.argv)

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
    console.log(`Wallclock server listening on udp://${address.address}:${address.port}`);
    
    console.log("Server started? ",wcServer.isStarted());

});
console.log(`Binding to ${BIND_HOST} port ${BIND_PORT}`)
udpSocket.bind(BIND_PORT, BIND_HOST);

