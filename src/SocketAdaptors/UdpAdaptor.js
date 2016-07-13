/**
 * @class
 * @alias module:sync-protocols/SocketAdaptors.UdpAdaptor
 * @description
 * Adaptor that manages a bound UDP datagram socket and interfaces it to a protocol handler.
 *
 * <p>It calls the handleMessage() method of the protocol handler when messages are received.
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

    var handlers = {
        close: function() {
            this.stop();
        }.bind(this),

        message: function(msg, rinfo) {
            protocolHandler.handleMessage(new Uint8Array(msg), rinfo); // no routing information
        }.bind(this)
    }

    boundDgramSocket.on("close", handlers.close);
    boundDgramSocket.on("message", handlers.message);

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
        boundDgramSocket.removeListener("close", handlers.close);
        boundDgramSocket.removeListener("message", handlers.message);
        protocolHandler.removeListener("send", send);
        protocolHandler.stop();
    };

};


module.exports = UdpAdaptor;
