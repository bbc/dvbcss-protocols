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
var WallClockClientProtocol = require("./WallClockClientProtocol");
var BinarySerialiser = require("./BinarySerialiser");

/**
 * @memberof dvbcss-protocols.WallClock
 * @description
 * Factory function that creates a Wall Clock client that uses a WebSocket
 * and sends/receives protocol messages in binary format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API compatible websocket connection object
 * @param {CorrelatedClock} wallClock
 * @param {Object} clientOptions
 * @returns {dvbcss-protocols.SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createBinaryWebSocketClient = function(webSocket, wallClock, clientOptions) {
    return new WebSocketAdaptor(
        new WallClockClientProtocol(
            wallClock,
            BinarySerialiser,
            clientOptions
        ),
        webSocket);
};


module.exports = createBinaryWebSocketClient;
