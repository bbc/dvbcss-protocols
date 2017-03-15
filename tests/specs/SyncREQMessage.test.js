
var TimelineProperties = require("main_node").CII.TimelineProperties;
var SyncREQMessage = require("main_node").SyncRelay.SyncREQMessage;

describe("TimelineProperties", function() {
    it("exists", function() {
      expect(TimelineProperties).toBeDefined();
    });

    it("check if TimelineProperties can be created, serialised and deserialised", function() {

      var tp_before = new TimelineProperties("tag:rd.bbc.co.uk,2015-12-08:dvb:css:timeline:simple-elapsed-time:1000", 1, 1000, 0.0);
      var tp_after  = TimelineProperties.deserialise(tp_before.serialise());

      expect(tp_before.timelineSelector).toBe(tp_after.timelineSelector);
      expect(tp_before.unitsPerTick).toBe(tp_after.unitsPerTick);
      expect(tp_before.unitsPerSecond).toBe(tp_after.unitsPerSecond);
      expect(tp_before.accuracy).toBe(tp_after.accuracy);
    });
});

describe("SyncREQMessage", function() {
    it("exists", function() {
      expect(SyncREQMessage).toBeDefined();
    });

    it ("check if SyncREQMessage can be created, serialised and deserialised.", function() {
      var tp1_before = new TimelineProperties("tag:rd.bbc.co.uk,2015-12-08:dvb:css:timeline:simple-elapsed-time:1000", 1, 1000, 0.0);
      var tp2_before = new TimelineProperties("tag:rd.bbc.co.uk,2015-12-08:dvb:css:timeline:simple-elapsed-time:1000000", 1, 1000000, 0.0);
      var timelines_before = [tp1_before,  tp2_before];
      var req_before = new SyncREQMessage(0, "123", "device123", "http://mydomain.org/video.mp4", timelines_before, "234AB");
      console.log(req_before.serialise());
      var req_after  = SyncREQMessage.deserialise(req_before.serialise());

      expect(req_before).toBeDefined();
      expect(req_after).toBeDefined();

      expect(req_before.version).toBe(req_after.version);
      expect(req_before.sessionId).toBe(req_after.sessionId);
      expect(req_before.peerId).toBe(req_after.peerId);
      expect(req_before.contentId).toBe(req_after.contentId);

      expect(req_after.timelines).toContain(req_before.timelines[0]);
      expect(req_after.timelines).toContain(req_before.timelines[1]);

      expect(req_before.syncMasterSecret).toBe(req_after.syncMasterSecret);
    });
});

// describe("TSSetupMessage", function() {
//
//     it("exists", function() {
//       expect(TSSetupMessage).toBeDefined();
//     });
//
//     it ("check if TSSetupMessage can be created, serialised and deserialised.", function() {
//       var contentIdStem = "http://mydomain.org/video.mp4";
//       var timelineSelector = "urn:dvb:css:timeline:ct";
//
//       var tssetup_before = new TSSetupMessage(contentIdStem, timelineSelector);
//       var tssetup_after  = TSSetupMessage.deserialise(tssetup_before.serialise());
//
//       // do a type check
//       expect(tssetup_before).toEqual(jasmine.any(TSSetupMessage));
//       expect(tssetup_after).toEqual(jasmine.any(TSSetupMessage));
//
//       // check if properties are the same
//       expect(tssetup_after).toEqual(tssetup_before);
//
//       // check if the right property has been set.
//       expect(tssetup_after.contentIdStem).toEqual(contentIdStem);
//       expect(tssetup_after.timelineSelector).toEqual(timelineSelector);
//
//
//     });
//
//
// });
