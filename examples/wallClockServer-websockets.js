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

var express = require('express');
var app = require('express-ws-routes')();

var Protocols = require("..");
var clocks = require("dvbcss-clocks");
var createServer = Protocols.WallClock.createBinaryWebSocketServer;

var program = require("commander");
var BIND_HOST = '0.0.0.0';
var BIND_PORT = 6677
var RES_PATH = '/'

program
	.version('0.0.1')
	.description(`WebSocket Wall clock server bound to the specified interface (default ${BIND_HOST}) and port (default ${BIND_PORT}) at a given resource path (default ${RES_PATH}).`)
	.arguments('[<bindHost>] [<bindPort>] [<resPath>]')
	.action(function (bindHost, bindPort, resPath) {
		if (bindHost !== undefined) {
			BIND_HOST = String(bindHost)
		}
		if (bindPort !== undefined) {
			BIND_PORT = Number(bindPort)
		}
		if (resPath !== undefined) {
			RES_PATH = String(resPath)
			if (!RES_PATH.startsWith("/")) {
				RES_PATH = "/"+RES_PATH
			}
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

app.websocket(RES_PATH, function(info, cb, next) {
	cb( function(ws) {
		var wcServer = createServer(ws, wallClock, protocolOptions);
		console.log("Client connected. Instantiating wall clock server for this client")
	})
})

app.listen(BIND_PORT, BIND_HOST, 511, function() {
	console.log(`WallClock server listening at ws://${BIND_HOST}:${BIND_PORT}${RES_PATH}`);
})

