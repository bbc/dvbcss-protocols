/**
 * @memberof sync-protocols
 * @namespace WallClock
 * @description
 * Classes, methods and objects implementing the Wall clock synchronisation protocol.
 *
 * <p>The simplest way to use them is to create the network connection, and {CorrelatedClock}
 * to represent the Wall Clock, then pass both to the appropriate factory function:
 * <ul>
 *   <li> [createBinaryUdpClient(...)]{@link sync-protocols.WallClock.createBinaryUdpClient}
 *   <li> [createBinaryWebSocketClient(...)]{@link sync-protocols.WallClock.createBinaryWebSocketClient}
 *   <li> [createJsonWebSocketClient(...)]{@link sync-protocols.WallClock.createJsonWebSocketClient}
 * </ul>
 *
 * @example
 * <caption>Using a Wall Clock client to synchronise a wall clock to a server via a WebSocket connection using JSON format messages</caption>
 * var WebSocket = require('ws');
 * var clocks = require("dvbcss-clocks");
 * var SyncProtocols = require("sync-protocols");
 * var createClient = SyncProtocols.WallClock.createJsonWebSocketClient;
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
 * var SyncProtocols = require("sync-protocols");
 * var createClient = SyncProtocols.WallClock.createBinaryUdpClient; 
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
