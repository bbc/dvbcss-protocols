/**
 * @interface
 * @description
 * Interface for socket adaptors that provide glue between some kind of network connection
 * and a {ProtocolHandler}
 *
 * <p>It calls the handleMessage() method of the protocol handler when messages are received.
 * And it listens for {event:send} fired by the protocol handler to send messages.
 *
 * @listens send
 */
var SocketAdaptor =  {
    /**
     * Stops the adaptor
     * @abstract
     */
    stop: function() { throw "Not implemented"; },    
    
}

module.exports = SocketAdaptor;
