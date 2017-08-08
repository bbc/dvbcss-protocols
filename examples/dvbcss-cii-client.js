var WebSocket = require('ws');
var SyncProtocols = require("sync-protocols");
var createClient = SyncProtocols.CII.createCIIClient;
var CIIMessage = SyncProtocols.CII.CIIMessage;


var onCiiChange = function(cii_obj, changemask)
{
	
	if (changemask & CIIMessage.CIIChangeMask.FIRST_CII_RECEIVED)
		console.log("First CII received: " + JSON.stringify(cii_obj));
	
	if (changemask & CIIMessage.CIIChangeMask.MRS_URL_CHANGED)
		console.log("MRS Url changed to: " + cii_obj.mrsUrl);
	
	if (changemask & CIIMessage.CIIChangeMask.CONTENTID_CHANGED)
		console.log("ContentId changed to: " + cii_obj.contentId);
		
	if (changemask & CIIMessage.CIIChangeMask.CONTENTID_STATUS_CHANGED)
		console.log("contentIdStatus changed to: " + cii_obj.contentIdStatus);
	
	if (changemask & CIIMessage.CIIChangeMask.PRES_STATUS_CHANGED)
		console.log("presentationStatus changed to: " + cii_obj.presentationStatus);
	
	if (changemask & CIIMessage.CIIChangeMask.WC_URL_CHANGED)
		console.log("wcUrl changed to: " + cii_obj.wcUrl);
	
	if (changemask & CIIMessage.CIIChangeMask.TS_URL_CHANGED)
		console.log("tsUrl changed to: " + cii_obj.tsUrl);
	
	if (changemask & CIIMessage.CIIChangeMask.TIMELINES_CHANGED)
		console.log("timelines changed to: " + JSON.stringify(cii_obj.timelines));
};

var clientOptions = {};

// now create the actual CII protocol client
var ws = new WebSocket('ws://192.168.1.102:7681/cii');

ws.on('open', function() {
    var ciiClient = createClient(ws, clientOptions);
    ciiClient.on("change", onCiiChange)
    
    console.log("CII client connected");
});
