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
var TSClientProtocol = require("./TSClientProtocol");

/**
 * @memberof sync-protocols.TimelineSynchronisation
 * @description
 * Factory function that creates a TS protocol client that uses a WebSocket
 * and sends/receives protocol messages in JSON format.
 *
 * @param {WebSocket} webSocket A W3C WebSockets API comaptible websocket connection object
 * @param {CorrelatedClock} syncTLClock The clock to represent the timeline. It will be updated according to the timestamp messages received.
 * @param {Object} clientOptions
 * @param {string} clientOptions.contentIdStem The Content Identifier stem is considered to match the timed content currently being presented by the TV Device
 * @param {string} clientOptions.timelineSelector The Timeline Selector describes the type and location of timeline signalling to be derived from the Timed Content
currently being presented by the TV Device
 * @param {Number} clientOptions.tickrate The tickrate of the timeline that is specified by the timelineSelector.
 * @returns {sync-protocols.SocketAdaptors.WebSocketAdaptor} The WebSocket adaptor wrapping the whole client
 */
var createTSClient = function(webSocket, syncTLClock, clientOptions) {
    return new WebSocketAdaptor(
        new TSClientProtocol(
            syncTLClock,
            clientOptions
        ),
        webSocket);
};


module.exports = createTSClient;
