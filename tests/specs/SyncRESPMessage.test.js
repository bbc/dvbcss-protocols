var clocks            = require("dvbcss-clocks");
var Correlation       = clocks.Correlation;
var SyncRESPMessage   = require("main_node").SyncRelay.SyncRESPMessage;
var ControlTimestamp  = require("main_node").TimelineSynchronisation.ControlTimestamp;




describe("Correlation", function() {
    it("exists", function() {
      expect(Correlation).toBeDefined();
    });

    it("check if Correlation can be created, serialised and deserialised", function() {

      var corr_before = new Correlation(10, 20, 0.5, 0.1);
      var o = JSON.parse(JSON.stringify(corr_before));
      var corr_after  = new Correlation(o.parentTime, o.childTime, o.initialError, o.errorGrowthRate);

      expect(corr_before).toEqual(corr_after);

    });
});



describe("ControlTimestamp", function() {
    it("exists", function() {
      expect(ControlTimestamp).toBeDefined();
    });

    it("check if ControlTimestamp can be created, serialised and deserialised", function() {

      var cts_before = new ControlTimestamp(1, 2, 1.0);
      var cts_after  = ControlTimestamp.deserialise(cts_before.serialise());


      expect(cts_before).toEqual(cts_after);

    });
});




describe("SyncRESPMessage", function() {

    it("exists", function() {
      expect(SyncRESPMessage).toBeDefined();
    });

    it ("check if SyncRESPMessage can be created, serialised and deserialised.", function() {

      var otherParams = {
                          syncTLCorr: new Correlation(10, 20, 0.5, 0.1),
                          contentTLCorr: new Correlation(11, 22, 0.5, 0.1),
                          controlTimestamp: new ControlTimestamp(1324234454, 345345345342, 1.0),
                        }

      var resp_before = SyncRESPMessage.createResponse(1, "1254", "123", "urn:dvb:css:timeline:ct",  otherParams);

      console.log(resp_before.serialise());

      var resp_after = SyncRESPMessage.deserialise(resp_before.serialise());

      console.log(resp_after.serialise());


      expect(resp_before.version).toBe(resp_after.version);
      expect(resp_before.type).toBe(resp_after.type);
      expect(resp_before.sessionId).toBe(resp_after.sessionId);
      expect(resp_before.peerId).toBe(resp_after.peerId);
      expect(resp_before.timelineSelector).toBe(resp_after.timelineSelector);
      expect(typeof resp_before.sigChangeThreshold).toBe("undefined");
      // expect(resp_before.sigChangeThreshold).toBe(resp_after.sigChangeThreshold);

      // console.log(JSON.stringify(resp_after.syncTLCorr));
      expect(resp_before.syncTLCorr.equals(resp_after.syncTLCorr)).toBeTruthy();
      expect(resp_before.syncTLCorr).toEqual(resp_after.syncTLCorr);
      expect(resp_before.syncTLCorr.parentTime).toBe(resp_after.syncTLCorr.parentTime);
      expect(resp_before.syncTLCorr.childTime).toBe(resp_after.syncTLCorr.childTime);

      expect(resp_before.syncTLCorr.childTime).toBe(resp_after.syncTLCorr.childTime);
      expect(resp_before.controlTimestamp).toEqual(resp_after.controlTimestamp);



      // check if properties are the same
      expect(resp_after).toEqual(resp_before);
    });


});
