var EventEmitter    = require("events");
var inherits  = require("inherits");
var WebSocket = require('ws');
var SyncProtocols = require("sync-protocols");
var clocks = require("dvbcss-clocks");
var createClient = SyncProtocols.CII.createCIIClient;
var CIIMessage = SyncProtocols.CII.CIIMessage;
// create an object to consume CII protocol client events
function CIIEventEmitter() {
  EventEmitter.call(this);
}
inherits(CIIEventEmitter, EventEmitter);

const cii_emitter = new CIIEventEmitter();


var cii_callback= function(cii_obj, changemask)
{
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.FIRST_CII_RECEIVED)
		console.log("First CII received: " + JSON.stringify(cii_obj));
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.MRS_URL_CHANGED)
		console.log("MRS Url changed to: " + cii_obj.mrsUrl);
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.CONTENTID_CHANGED)
		console.log("ContentId changed to: " + cii_obj.contentId);
		
	if (changemask & CIIMessage.prototype.CIIChangeMask.CONTENTID_STATUS_CHANGED)
		console.log("contentIdStatus changed to: " + cii_obj.contentIdStatus);
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.PRES_STATUS_CHANGED)
		console.log("presentationStatus changed to: " + cii_obj.presentationStatus);
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.WC_URL_CHANGED)
		console.log("wcUrl changed to: " + cii_obj.wcUrl);
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.TS_URL_CHANGED)
		console.log("tsUrl changed to: " + cii_obj.tsUrl);
	
	if (changemask & CIIMessage.prototype.CIIChangeMask.TIMELINES_CHANGED)
		console.log("timelines changed to: " + JSON.stringify(cii_obj.timelines));
}

var clientOptions = {
	    callback:  cii_callback,
	    dest: { address:"ws://192.168.1.102:7681/cii", port:7681 },
	    
	};

// now create the actual CII protocol client
var ws = new WebSocket('ws://192.168.1.102:7681/cii');

ws.on('open', function() {
    var wcClient = createClient(ws, clientOptions);
    
    console.log("CII client connected to endpoint = " + clientOptions.dest.address);
});
