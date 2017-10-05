/****************************************************************************
 * Copyright 2017 British Broadcasting Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*****************************************************************************/

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
