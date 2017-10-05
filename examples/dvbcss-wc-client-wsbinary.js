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
