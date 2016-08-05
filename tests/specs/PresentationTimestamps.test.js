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
});

describe("ControlTimestamp", function() {

    it ("check if ControlTimestamp can be created, serialised and deserialed.", function() {

      var cts_before = new ControlTimestamp(1, 2, 0.5);
      var cts_after  = ControlTimestamp.deserialise(cts_before.serialise());

      expect(cts_before).toBeDefined();
      expect(cts_after).toBeDefined();

      expect(cts_before.contentTime).toBe(cts_after.contentTime);
      expect(cts_before.wallClockTime).toBe(cts_after.wallClockTime);
      expect(cts_before.timelineSpeedMultiplier).toBe(cts_after.timelineSpeedMultiplier);

    });


});
