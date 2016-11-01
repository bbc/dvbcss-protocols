var UdpAdaptor = require("main_node").SocketAdaptors.UdpAdaptor;

var EventEmitter = require("events");
var inherits = require("inherits");

var MockDgramSocket = function() {
    var emitter = new EventEmitter();
    
    this.send = jasmine.createSpy("websocket-send");
    
    this.addEventListener = emitter.addListener.bind(emitter);
    this.removeEventListener = emitter.removeListener.bind(emitter);
}

inherits(MockDgramSocket, EventEmitter);

var MockProtocol = function() {
    EventEmitter.call(this);
    
    this.start = jasmine.createSpy("start");
    this.stop = jasmine.createSpy("stop");
    this.handleMessage = jasmine.createSpy("handleMessage");
}

inherits(MockProtocol, EventEmitter);


describe("UdpAdaptor", function() {
    var sock = new MockDgramSocket();
    var protocol;
    
    beforeEach(function() {
        sock = new MockDgramSocket();
        protocol = new MockProtocol();
    });
    
    
    it("exists", function() {
        expect(UdpAdaptor).toBeDefined();
    });
    
    it("calls start() on the protocol handler", function() {
        var udpa = new UdpAdaptor(protocol, sock);
        expect(protocol.start).toHaveBeenCalled();
    });

    it("does call stop when the socket is closed", function() {
        var udpa = new UdpAdaptor(protocol, sock);
        expect(protocol.stop).not.toHaveBeenCalled();
        sock.emit("close", {});
        expect(protocol.stop).toHaveBeenCalled();
    });
    
    it("calls handleMessage on the protocol handler when the socket receives a message, passing the payload and routing information, with the payload converted to a Uint8Array", function() {
        var payload = "foo";
        var rinfo = { address:"1.2.3.4", port:5678 };
        var payloadExpected = new Uint8Array("foo").buffer;
        
        var udpa = new UdpAdaptor(protocol, sock);
        
        sock.emit("message", payload, rinfo);
        expect(protocol.handleMessage).toHaveBeenCalledWith(payloadExpected,rinfo);
    });
    
    it("calls send on the dgram socket when it receives a send event from the protocol handler, to pass on the payload as a buffer object", function() {
        var payload="baa";
        var rinfo = { address:"1.2.3.4", port:5678 };
        var payloadExpected = new Buffer("baa");
        
        var udpa = new UdpAdaptor(protocol, sock);
        
        protocol.emit("send", payload, rinfo);
        expect(sock.send).toHaveBeenCalledWith(payloadExpected, 0, payloadExpected.length, 5678, "1.2.3.4");
    });
    
    it("ignores a received message on the socket after stop() is called, and therefore does not call handleMessage() on the protocol handler", function() {
        var payload="flrob";
        var rinfo = { address:"1.2.3.4", port:5678 };
        
        var udpa = new UdpAdaptor(protocol, sock);
        udpa.stop();
        sock.emit("message", payload, rinfo);
        expect(protocol.handleMessage).not.toHaveBeenCalled();
    });

    it("calls stop() on the protocol handler when stop() is called, but ignores a close event on the socket after stop() is called, and therefore does not call stop() on the protocol handler", function() {
        
        var udpa = new UdpAdaptor(protocol, sock);
        udpa.stop();
        expect(protocol.stop).toHaveBeenCalled();
        protocol.stop.calls.reset();
        sock.emit("close", {});
        expect(protocol.stop).not.toHaveBeenCalled();
    });
});
