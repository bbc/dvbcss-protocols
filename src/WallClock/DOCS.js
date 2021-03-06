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

/**
 * @memberof dvbcss-protocols
 * @namespace WallClock
 * @description
 * Classes, methods and objects implementing the [Wall clock synchronisation protocol]{@tutorial protocol-wc}.
 *
 * <p>The simplest way to use them is to create the network connection, and {CorrelatedClock}
 * to represent the Wall Clock, then pass both to the appropriate factory function:
 * <ul>
 *   <li> [createBinaryUdpClient(...)]{@link dvbcss-protocols.WallClock.createBinaryUdpClient}
 *   <li> [createBinaryWebSocketClient(...)]{@link dvbcss-protocols.WallClock.createBinaryWebSocketClient}
 *   <li> [createJsonWebSocketClient(...)]{@link dvbcss-protocols.WallClock.createJsonWebSocketClient}
 * </ul>
 *
 * @example
 * <caption>Using a Wall Clock client to synchronise a wall clock to a server via a WebSocket connection using JSON format messages</caption>
 * var WebSocket = require('ws');
 * var clocks = require("dvbcss-clocks");
 * var Protocols = require("dvbcss-protocols");
 * var createClient = Protocols.WallClock.createJsonWebSocketClient;
 * 
 * var ws = new WebSocket("ws://127.0.0.1:7681/wall-clock-server");
 * 
 * var root = new clocks.DateNowClock();
 * var wallClock = new clocks.CorrelatedClock(root);
 * 
 * var client = createClient(ws, wallClock);
 * 
 * // Then at some point later, just close the WebSocket connection to stop the client:
 * ws.close();
 * 
 * @example
 * <caption>Using a Wall Clock client in node.js to synchronise a DVB-CSS wall clock via UDP</caption>
 * var dgram = require("dgram");
 * var clocks = require("dvbcss-clocks");
 * var Protocols = require("dvbcss-protocols");
 * var createClient = Protocols.WallClock.createBinaryUdpClient; 
 * var sysClock = new clocks.DateNowClock();
 * var wallClock = new clocks.CorrelatedClock(sysClock);
 * 
 * var udpSocket = dgram.createSocket({type:'udp4', reuseAddr:true});
 * 
 * var protocolOptions = { dest: { address:"127.0.0.1", port:6677 }};
 * 
 * udpSocket.on('listening', function() {
 *     var wcClient = createClient(udpSocket, wallClock, protocolOptions);
 * 
 *     setInterval(function() {
 *         console.log("WallClock = ",wallClock.now());
 *         console.log("dispersion = ",wallClock.dispersionAtTime(wallClock.now()));
 *     },1000);
 * 
 * });
 * 
 * udpSocket.bind();

 
 */
