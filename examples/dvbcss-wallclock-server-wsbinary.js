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

var wss = new WebSocketServer({ host: "0.0.0.0", port: 6676 });

wss.on('connection', function connection(ws) {

	var wcServer = createServer(ws, wallClock, protocolOptions);
	console.log("Handler created for new connection");

});
