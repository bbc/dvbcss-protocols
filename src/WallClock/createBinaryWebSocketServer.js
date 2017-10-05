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

var WebSocketAdaptor = require("../SocketAdaptors/WebSocketAdaptor");
var WallClockServerProtocol = require("./WallClockServerProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @memberof sync-protocols.WallClock
 * @description
 * Factory function that creates a Wall Clock server that uses a WebSocket
 * and sends/receives protocol messages in binary format.
 *
 * @param {webSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {String} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Number} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 * @returns {sync-protocols.SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole server
 */
var createBinaryWebSocketServer = function(webSocket, wallClock, protocolOptions) {
    return new WebSocketAdaptor(
        new WallClockServerProtocol(
            wallClock,
            BinarySerialiser,
            protocolOptions
        ),
        webSocket);
};

module.exports = createBinaryWebSocketServer;
