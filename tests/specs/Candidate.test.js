var WallClockMessage = require("main_node").WallClock.WallClockMessage;
var Candidate = require("main_node").WallClock.Candidate;


describe("Candidate", function() {
    it("exists", function() {
        expect(Candidate).toBeDefined();
    });
    
    it("is created from a response message and encapsulates data in units of nanoseconds", function() {
        var msg = new WallClockMessage(0, WallClockMessage.TYPES.response, 0.1, 256.7, 2000, 145245, 3000.35, 4000.12345);
        
        var candidate = new Candidate(msg, 4000000145245);
        expect(candidate.t1).toBe(2000000145245);
        expect(candidate.t2).toBe(3000350000000);
        expect(candidate.t3).toBe(4000123450000);
        expect(candidate.t4).toBe(4000000145245);
        expect(candidate.precision).toBe(100000000);
        expect(candidate.mfe).toBe(256.7);
        expect(candidate.msg).toBe(msg);
        
    });


    it("can be converted to a correlation", function() {
        var mockClock = {
            getRootMaxFreqError: function() { return 20; },
            fromNanos: function(v) { return v / 1000000.0; },  // uses milliseconds
            parent: {
                fromNanos: function(v) { return v / 1000.0; }  /// parent uses microseconds
            }
        }
        
        var msg = new WallClockMessage(0, WallClockMessage.TYPES.response, 0.1, 50.0, 2000, 0, 5050, 5060);
        
        var candidate = new Candidate(msg, 2070000000000);
        var correlation = candidate.toCorrelation(mockClock);
        
        expect(correlation.parentTime).toBe(2035000000);
        expect(correlation.childTime).toBe(5055000);
        expect(correlation.initialError).toBeCloseTo(0.1 + 30 + 20/1000000*70 + 50/1000000*10, 10);
        expect(correlation.errorGrowthRate).toBeCloseTo((20+50)/1000000,10);
    });
});

