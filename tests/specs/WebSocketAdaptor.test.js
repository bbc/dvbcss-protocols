var WebSocketAdaptor = require("main_node").SocketAdaptors.WebSocketAdaptor;

var EventEmitter = require("events");
var inherits = require("inherits");

var MockWebSocket = function(url) {
    var emitter = new EventEmitter();
    
    this.url = url;
    
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;
    
    this.readyState = this.CONNECTING;
    
    this.send = jasmine.createSpy("websocket-send");
    this.close = jasmine.createSpy("close");
    
    this.addEventListener = emitter.addListener.bind(emitter);
    this.removeEventListener = emitter.removeListener.bind(emitter);
    
    this.triggerEvent = function() {
        var name = arguments[0];
        emitter.emit.apply(emitter, arguments);
        if (typeof this["on"+name] !== "undefined") {
            this["on"+name].apply(this, arguments);
        }
    };
}

inherits(MockWebSocket, EventEmitter);

var MockProtocol = function() {
    EventEmitter.call(this);
    
    this.start = jasmine.createSpy("start");
    this.stop = jasmine.createSpy("stop");
    this.handleMessage = jasmine.createSpy("handleMessage");
}

inherits(MockProtocol, EventEmitter);

var ThrowingMockProtocol = function() {
    EventEmitter.call(this);

    this.start = jasmine.createSpy("start");
    this.stop = jasmine.createSpy("stop");
    this.handleMessage = jasmine.createSpy("handleMessage", function() { throw new Error('mock error in message handler'); }).and.callThrough();
}

inherits(ThrowingMockProtocol, EventEmitter);


describe("WebSocketAdaptor", function() {
    var ws = new MockWebSocket();
    var protocol, throwingProtocol;
    
    beforeEach(function() {
        ws = new MockWebSocket("ws://127.0.0.1");
        protocol = new MockProtocol();
        throwingProtocol = new ThrowingMockProtocol();
    });
    
    
    it("exists", function() {
        expect(WebSocketAdaptor).toBeDefined();
    });
    
    it("calls start() on the protocol handler if websocket if it is in state OPEN", function() {
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).toHaveBeenCalled();
    });

    it("does not call start() on the protocol handler if websocket if it is in state CONNECTING", function() {
        ws.readyState = ws.CONNECTING;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).not.toHaveBeenCalled();
    });

    it("does not call start() on the protocol handler if websocket if it is in state CLOSING", function() {
        ws.readyState = ws.CLOSING;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).not.toHaveBeenCalled();
    });

    it("does not call start() on the protocol handler if websocket if it is in state CLOSED", function() {
        ws.readyState = ws.CLOSED;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).not.toHaveBeenCalled();
    });

    it("does call start when the websocket transitions from CONNECTING to OPEN", function() {
        ws.readyState = ws.CONNECTING;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).not.toHaveBeenCalled();
        ws.readyState = ws.OPEN;
        ws.triggerEvent("open", {});
        expect(protocol.start).toHaveBeenCalled();
    });
    
    it("does call start when the websocket transitions from CLOSED to OPEN (to support some 'reconnecting' websocket implementations)", function() {
        ws.readyState = ws.CLOSED;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.start).not.toHaveBeenCalled();
        ws.readyState = ws.OPEN;
        ws.triggerEvent("open", {});
        expect(protocol.start).toHaveBeenCalled();
    });
    
    it("does call stop when the websocket transitions from OPEN to CLOSED", function() {
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        expect(protocol.stop).not.toHaveBeenCalled();
        ws.readyState = ws.CLOSED;
        ws.triggerEvent("close", {});
        expect(protocol.stop).toHaveBeenCalled();
    });
    
    it("calls handleMessage on the protocol handler when the websocket receives a message, passing the payload and null routing information", function() {
        var payload = "foo";
        
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        
        var event ={ data:payload, origin:ws.url };
        ws.triggerEvent("message", event);
        expect(protocol.handleMessage).toHaveBeenCalledWith(payload,null);
    });
    
    it("calls send on the websocket when it receives a send event from the protocol handler, to pass on the payload", function() {
        var payload="baa";
        
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        
        protocol.emit("send", payload, null);
        expect(ws.send).toHaveBeenCalledWith(payload, {binary:false});
    });
    
    it("ignores an open event on the websocket after stop() is called, and therefore does not call start() on the protocol handler", function() {
        ws.readyState = ws.CONNECTING;
        var wsa = new WebSocketAdaptor(protocol, ws);
        wsa.stop();
        ws.readyState = ws.OPEN;
        ws.triggerEvent("open", {});
        expect(protocol.start).not.toHaveBeenCalled();
    });

    it("ignores a received message on the websocket after stop() is called, and therefore does not call handleMessage() on the protocol handler", function() {
        var payload="flrob";
        
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        wsa.stop();
        var event ={ data:payload, origin:ws.url };
        ws.triggerEvent("message", event);
        expect(protocol.handleMessage).not.toHaveBeenCalled();
    });

    it("calls stop() on the protocol handler when stop() is called, but ignores a close event on the websocket after stop() is called, and therefore does not call stop() on the protocol handler", function() {
        var payload="flrob";
        
        ws.readyState = ws.OPEN;
        var wsa = new WebSocketAdaptor(protocol, ws);
        wsa.stop();
        expect(protocol.stop).toHaveBeenCalled();
        protocol.stop.calls.reset();
        ws.triggerEvent("close", {});
        expect(protocol.stop).not.toHaveBeenCalled();
    });

    it("catches error in the protocol message handler", function() {
      var payload = "foobar";

      ws.readyState = ws.OPEN;
      var wsa = new WebSocketAdaptor(throwingProtocol, ws);

      var event ={ data:payload, origin:ws.url };
      expect(function() { ws.triggerEvent("message", event); }).not.toThrow();
      expect(throwingProtocol.handleMessage).toHaveBeenCalledWith(payload,null);
    });
});
