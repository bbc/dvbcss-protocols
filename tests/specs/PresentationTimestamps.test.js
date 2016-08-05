var PresentationTimestamp  = require("main_node").TimelineSynchronisation.PresentationTimestamp;
var PresentationTimestamps = require("main_node").TimelineSynchronisation.PresentationTimestamps;
var ControlTimestamp = require("main_node").TimelineSynchronisation.ControlTimestamp;

describe("PresentationTimestamps", function() {
    it("exists", function() {
        expect(PresentationTimestamps).toBeDefined();
    });

    it("can be serialised and deserialised without loosing information", function() {

      var ts_before = new PresentationTimestamps(new PresentationTimestamp(1, 2), new PresentationTimestamp(3, 4), new PresentationTimestamp(5, 6));
      var ts_after  = PresentationTimestamps.deserialise(ts_before.serialise());

      expect(ts_before.actual.contentTime).toBe(ts_after.actual.contentTime);
      expect(ts_before.actual.wallClockTime).toBe(ts_after.actual.wallClockTime);

      expect(ts_before.earliest.contentTime).toBe(ts_after.earliest.contentTime);
      expect(ts_before.earliest.wallClockTime).toBe(ts_after.earliest.wallClockTime);

      expect(ts_before.latest.contentTime).toBe(ts_after.latest.contentTime);
      expect(ts_before.latest.wallClockTime).toBe(ts_after.latest.wallClockTime);

    });

    it ("check if ControlTimestamp can be created", function() {

      var cts = new ControlTimestamp();

    });


});
