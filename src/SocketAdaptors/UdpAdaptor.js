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
 * @memberof sync-protocols.SocketAdaptors
 * @class
 * @description
 * Adaptor that manages a bound UDP datagram socket and interfaces it to a protocol handler.
 *
 * <p>It calls the handleMessage() method of the protocol handler when messages are received with type {ArrayBuffer}.
 * And it listens for {event:send} fired by the protocol handler to send messages.
 *
 * <p>The destination routing information is an object with "port" and "address" properties.
 *
 * @implements SocketAdaptor
 * @constructor
 * @param {ProtocolHandler} ProtocolHandler
 * @param {dgram_Socket} boundDgramSocket A datagram socket that is already bound.
 * @listens send
 */
var UdpAdaptor = function(protocolHandler, boundDgramSocket) {

    this.protocolHandler = protocolHandler;
    this.dgramSocket = boundDgramSocket;
    this.handlers = {
        close: function() {
            this.stop();
        }.bind(this),

        message: function(msg, rinfo) {
            protocolHandler.handleMessage(new Uint8Array(msg).buffer, rinfo); // no routing information
        }.bind(this)
    }

    boundDgramSocket.on("close", this.handlers.close);
    boundDgramSocket.on("message", this.handlers.message);

    // handle requests to send
    var send = function(msg, rinfo) {
        var buf = new Buffer(msg);
        boundDgramSocket.send(buf, 0, buf.length, rinfo.port, rinfo.address);
    };

    protocolHandler.on("send", send);

    protocolHandler.start();

    /**
     * Force this adaptor to stop. Also calls the stop() method of the protocol handlers
     */
    this.stop = function() {
        boundDgramSocket.removeListener("close", this.handlers.close);
        boundDgramSocket.removeListener("message", this.handlers.message);
        protocolHandler.removeListener("send", send);
        protocolHandler.stop();
    };

    this.isStarted = function(){

        return(protocolHandler.isStarted());
    };

};

module.exports = UdpAdaptor;
