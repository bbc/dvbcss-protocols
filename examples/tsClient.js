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
var WebSocket = require('ws');
var SyncProtocols = require("..");
var clocks = require("dvbcss-clocks");
var createWcClient = SyncProtocols.WallClock.createBinaryUdpClient;
var createTsClient = SyncProtocols.TimelineSynchronisation.createTSClient;

var program = require("commander");
var TS_URL;
var WC_URL;
var CONTENT_ID_STEM;
var TIMELINE_SELECTOR;
var TICK_RATE;

program
	.version('0.0.1')
	.description(`TS client that connects to a TS server at the specified ws:// URL and to a Wall Clock server at the specified udp://<host>:<port> URL. It then requests a timeline using the specified contentIdStem and timelineSelector and assumes the timeline is running at the specified tickrate.`)
	.arguments('<tsUrl> <wcUrl> <ciStem> <timelineSelector> <ticksPerSecond>')
	.action(function (tsUrl, wcUrl, ciStem, timelineSelector, ticksPerSecond) {
        TS_URL = tsUrl
        WC_URL = wcUrl
        CONTENT_ID_STEM = ciStem
        TIMELINE_SELECTOR = timelineSelector
        TICK_RATE = Number(ticksPerSecond)
	})

program.parse(process.argv)

if ( ! /^wss?:\/\//.exec(TS_URL) ) {
    console.error("Expected ws:// or wss:// URL for TS server")
    process.exit(1)
}

if ( match = /^udp:\/\/([^:]+):([0-9]+)\/?$/.exec(WC_URL) ) {
    WC_HOST = match[1]
    WC_PORT = Number(match[2])
} else {
    console.error("Expected udp://<host>:<port> URL for WC server")
    process.exit(1)
}

if (CONTENT_ID_STEM === undefined) {
    console.error("Expected content ID stem string")
    process.exit(1)
}

if (TIMELINE_SELECTOR === undefined) {
    console.error("Expected timeline selector string")
    process.exit(1)
}

if (TICK_RATE === undefined || isNaN(TICK_RATE) || TICK_RATE <= 0) {
    console.error("Expected tick rate (positive number)")
    process.exit(1)
}

var sysClock = new clocks.DateNowClock();
var wallClock = new clocks.CorrelatedClock(sysClock, {tickRate:1000000000});
var timelineClock = new clocks.CorrelatedClock(wallClock, {tickRate:TICK_RATE});
wallClock.availabilityFlag = false
timelineClock.availabilityFlag = false

// Start Wall Clock Client

var udpSocket = dgram.createSocket({type:'udp4', reuseAddr:true});

udpSocket.on('listening', function() {
    console.log(`Starting Wall Clock client, communicating with udp://${WC_HOST}:${WC_PORT}`)

    var protocolOptions = {
        dest: { address:WC_HOST, port:WC_PORT }
    };

    var wcClient = createWcClient(udpSocket, wallClock, protocolOptions);

});

wallClock.on('available', function() {
    console.log("Wall clock AVAILABLE")
})

wallClock.on('unavailable', function() {
    console.log("Wall clock UNAVAILABLE")
})

udpSocket.bind();

// Start TS client

var ws = new WebSocket(TS_URL);

timelineClock.on('available', function() {
    console.log("Sync timeline AVAILABLE")
})

timelineClock.on('unavailable', function() {
    console.log("Sync timeline UNAVAILABLE")
})

ws.on('open', function() {
    console.log("Connected to TS server")
    
    var options = {
        contentIdStem: CONTENT_ID_STEM,
        timelineSelector: TIMELINE_SELECTOR,
        tickrate: timelineClock.tickRate
    }
    var client = createTsClient(ws, timelineClock, options)
    
    setInterval( function() {
        console.log("Sync timeline position = ",timelineClock.now().toFixed(5), "   speed = ",timelineClock.speed.toFixed(2),   "    Availability = ", timelineClock.isAvailable())
    }, 1000)
})

ws.on('close', function() {
    console.log("TS server connection closed.")
    process.exit(0)
})

ws.on('error', function() {
    console.log("TS server connection error.")
    process.exit(1)
})

