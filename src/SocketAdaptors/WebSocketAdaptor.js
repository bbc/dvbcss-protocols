/**
 * @class
 * @alias module:sync-protocols/SocketAdaptors.WebSocketAdaptor
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
            protocolHandler.handleMessage(evt.data, {binary: evt.binary}); // no routing information
        }.bind(this)
    }

    webSocket.addEventListener("open",    handlers.open);
    webSocket.addEventListener("close",   handlers.close);
    webSocket.addEventListener("message", handlers.message);

    // handle requests to send
    var send = function(msg, dest) {

      //console.log(dest);
      
      if (dest.format){
        webSocket.send(msg, dest.format);
        
      }else if (dest.binary === true){
    	  webSocket.send(msg, { binary: true, mask: true });
      }
      else {
        webSocket.send(msg);
      }

    };

    protocolHandler.on("send", send);

    // if already open, commence
    if (webSocket.readyState == webSocket.OPEN) {
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
