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
var createClient = Protocols.WallClock.createBinaryUdpClient;

var program = require("commander");
var HOST = '127.0.0.1';
var PORT = 6677

program
	.version('0.0.1')
	.description(`UDP Wall clock client that connects to a server at the specified address (default ${HOST}) and port (default ${PORT}).`)
	.arguments('[<host>] [<port>]')
	.action(function (host, port) {
		if (host !== undefined) {
			HOST = String(host)
		}
		if (port !== undefined) {
			PORT = Number(port)
		}
	})

program.parse(process.argv)

var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock, {tickRate:1000000000});

var udpSocket = dgram.createSocket({type:'udp4', reuseAddr:true});

udpSocket.on('listening', function() {
    console.log(`Starting Wall Clock client, communicating with udp://${HOST}:${PORT}`)

    var protocolOptions = {
        dest: { address:HOST, port:PORT }
    };

    var wcClient = createClient(udpSocket, wallClock, protocolOptions);

    setInterval(function() {
        console.log("WallClock (nanos) = ",wallClock.now());
        console.log("dispersion (secs) = ",wallClock.dispersionAtTime(wallClock.now()));
        console.log("")
    },1000);

});

udpSocket.bind();
