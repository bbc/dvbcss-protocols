var WallClockMessage = require("main_node").WallClock.WallClockMessage;


describe("WallClockMessage", function() {
    it("exists", function() {
        expect(WallClockMessage).toBeDefined();
    })
    
    it("Can be constructed and sets the properties appropriately", function() {
        var msg = new WallClockMessage(0, WallClockMessage.TYPES.response, 0.1, 256.7, 2000, 145245, 3000.35, 4000.12345);

        expect(msg.version).toBe(0);
        expect(msg.type).toBe(1);
        expect(msg.precision).toBe(0.1);
        expect(msg.max_freq_error).toBe(256.7);
        expect(msg.originate_timevalue_secs).toBe(2000);
        expect(msg.originate_timevalue_nanos).toBe(145245);
        expect(msg.receive_timevalue).toBe(3000.35);
        expect(msg.transmit_timevalue).toBe(4000.12345);
    });
    
    it("Can make a request message", function() {
        var msg = WallClockMessage.makeRequest(2000, 145245);

        expect(msg.version).toBe(0);
        expect(msg.type).toBe(0);
        expect(msg.originate_timevalue_secs).toBe(2000);
        expect(msg.originate_timevalue_nanos).toBe(145245);
    });

    it("Can make a request into a response", function() {
        var request = WallClockMessage.makeRequest(2000, 145245);
        var msg = request.toResponse(WallClockMessage.TYPES.response, 0.1, 256.7, 3000.35, 4000.12345)

        expect(msg.version).toBe(0);
        expect(msg.type).toBe(1);
        expect(msg.precision).toBe(0.1);
        expect(msg.max_freq_error).toBe(256.7);
        expect(msg.originate_timevalue_secs).toBe(2000);
        expect(msg.originate_timevalue_nanos).toBe(145245);
        expect(msg.receive_timevalue).toBe(3000.35);
        expect(msg.transmit_timevalue).toBe(4000.12345);
    });

    it("Can check if a message is a response message", function() {
        var msg = new WallClockMessage(0, 0, 0.1, 256.7, 2000, 145245, 3000.35, 4000.12345);
        expect(msg.isResponse()).toBeFalsy();

        [1, 2, 3].forEach(function (type) {
            msg = new WallClockMessage(0, type, 0.1, 256.7, 2000, 145245, 3000.35, 4000.12345);
            expect(msg.isResponse()).toBeTruthy();
        })

    });
    
    it("Has a static helper method for converting nanoseconds into separate seconds and nanos fields", function() {
        var r = WallClockMessage.nanosToSecsAndNanos(394842323214);
        expect(r[0]).toBe(394);
        expect(r[1]).toBe(842323214);
    });

    it("Has a static helper method for converting separate seconds and nanoseconds back into a time value in nanoseconds", function() {
        expect(WallClockMessage.secsAndNanosToNanos(394, 842323214)).toBe(394842323214);
    });

});
