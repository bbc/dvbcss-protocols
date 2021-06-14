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
 * @memberof dvbcss-protocols.SocketAdaptors
 * @class
 * @description
 * Adaptor that manages a websocket connection and interfaces it to a protocol handler.
 *
 * <p>It calls the handleMessage() method of the protocol handler when messages are received.
 * And it listens for {event:send} fired by the protocol handler to send messages.
 *
 * <p>The destination routing information is not used because WebSockets are connection oriented.
 *
 * @implements SocketAdaptor
 * @constructor
 * @param {ProtocolHandler} ProtocolHandler
 * @param {WebSocket} webSocket
 * @listens send
 */
var WebSocketAdaptor = function(protocolHandler, webSocket) {

    var handlers = {
        open: function(evt) {
            protocolHandler.start();
        }.bind(this),

        close: function(evt) {
            protocolHandler.stop();
        }.bind(this),

        message: function(evt) {
//          console.log("WebSocketAdaptor. received msg");
//          //console.log(evt);

            var msg;

            try {
              if (evt.binary || typeof evt.data != "string") {
                  msg = new Uint8Array(evt.data).buffer;
              } else {
                  msg = evt.data;
              }

              protocolHandler.handleMessage(msg, null); // no routing information
            } catch (error) {
              webSocket.close();
            }
          }.bind(this)
    }

    webSocket.addEventListener("open",    handlers.open);
    webSocket.addEventListener("close",   handlers.close);
    webSocket.addEventListener("message", handlers.message);

    // handle requests to send
    var send = function(msg, dest) {

//      console.log(msg);
//      console.log(dest);


        // binary parameter is support for https://github.com/websockets/ws
        // is ignored by W3C compliant websocket libraries

        var isBinary = msg instanceof ArrayBuffer;
        webSocket.send(msg, { binary: isBinary });

    };

    protocolHandler.on("send", send);

    // if already open, commence
    if (webSocket.readyState == 1) {
        protocolHandler.start();
    }

    /**
     * Force this adaptor to stop. Also calls the stop() method of the protocol handlers
     */
    this.stop = function() {
        webSocket.removeEventListener("open",    handlers.open);
        webSocket.removeEventListener("close",   handlers.close);
        webSocket.removeEventListener("message", handlers.message);
        protocolHandler.removeListener("send", send);
        protocolHandler.stop();
    };

    this.isStarted = function(){

        return(protocolHandler.isStarted());
    };

};

module.exports = WebSocketAdaptor;
