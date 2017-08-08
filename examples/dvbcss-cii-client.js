var WebSocket = require('ws');
var SyncProtocols = require("sync-protocols");
var createClient = SyncProtocols.CII.createCIIClient;
var CIIMessage = SyncProtocols.CII.CIIMessage;


var onCiiChange = function(cii_obj, changes, changemask)
{
	if (changemask & CIIMessage.CIIChangeMask.FIRST_CII_RECEIVED)
		console.log("First CII received.");
	
	for(var name in changes) {
		if (changes.hasOwnProperty(name)) {
			if (changes[name]) {
				console.log(name+" changed to: "+JSON.stringify(cii_obj[name]));
			}
		}
	}
};

var clientOptions = {};

// now create the actual CII protocol client
var ws = new WebSocket('ws://127.0.0.1:7681/cii');

ws.on('open', function() {
    var ciiClient = createClient(ws, clientOptions);
    ciiClient.on("change", onCiiChange)
    
    console.log("CII client connected");
});
