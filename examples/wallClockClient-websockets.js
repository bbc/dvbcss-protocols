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

var WebSocket = require('ws');
var SyncProtocols = require("..");
var clocks = require("dvbcss-clocks");
var createClient = SyncProtocols.WallClock.createBinaryWebSocketClient;

var program = require("commander");
var URL = 'ws://127.0.0.1:6677/';

program
	.version('0.0.1')
	.description(`WebSocket Wall clock client that connects to the specified URL (default ${URL}).`)
	.arguments('[<url>]')
	.action(function (url) {
		if (url !== undefined) {
			URL = String(url)
		}
	})

program.parse(process.argv)

var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock, {tickRate:1000000000});

var ws = new WebSocket(URL);
var protocolOptions = {};


ws.on('open', function() {
    console.log("Connection open")
    var wcClient = createClient(ws, wallClock, protocolOptions);

    setInterval(function() {
        console.log("WallClock (nanos) = ",wallClock.now());
        console.log("dispersion (secs) = ",wallClock.dispersionAtTime(wallClock.now()));
        console.log("")
    },1000);

});

ws.on('error', function() {
    console.log("Connection error")
    process.exit(1)
})
ws.on('close', function() {
    console.log("Connection closed")
    process.exit(1)
})
