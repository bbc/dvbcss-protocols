# Pure JS sync protocols library

An implementation of synchronisation protocols in JS intended for use in the
browser (WebSocket based clients only) and node.js (UDP and WebSocket clients+servers)

## Getting started

### 1. Download and install dependencies

First download and then install dependencies:

    $ cd sync-protocols
    $ npm install

Note that NPM install might fail if NPM is not able to access your credentials for the
project repository.

(NPM 'link' is no longer required for project private packages. This is
because the dependency entry in package.json now points directly to the 
repository URL)


### 2. EITHER: Build for the browser

If you wish to build it into a single JS file suitable for the browser (i.e. 
for including in a webpage) then do this:

    $ grunt
    
Resulting library is placed in `dist/browser/sync-protocols.js`.

### OR: use in another nodejs project

Alternatively, use this as a dependency in the package.json of your own
project. First make it available to your local npm installation.

    $ npm link
    
Make sure it is included as a dependency in package.json:

    ...
    "dependencies": {
        ...
        "sync-protocols": "^0.0.1",
        ...
    }
    
Ask npm to link it:

    $ npm link sync-protocols



## Documentation

JSDoc documentation can be built:

    $ grunt jsdoc

Documentation is generated and output as HTML into the `doc` subfolder.

    
## Unit tests

Unit tests are written using the jasmine unit test framework.

    $ grunt test


## Simple example

Creating a wall clock client using JSON format messages via a WebSocket
connection:
    
    var WebSocket = require('ws');
    
    var clocks = require("dvbcss-clocks");
    var SyncProtocols = require("sync-protocols");
    var createClient = SyncProtocols.WallClock.createJsonWebSocketClient;
    
    var ws = new WebSocket("ws://127.0.0.1:7681/wall-clock-server");
    
    var root = new clocks.DateNowClock();
    var wallClock = new clocks.CorrelatedClock(root);
    
    var client = createClient(ws, wallClock);
    
Then at some point later, just close the WebSocket connection to stop the client:

    ws.close();
    
There are also functions to create other variants:

* `SyncProtocols.WallClock.createJsonWebSocketClient` - JSON protocol via WebSocket
* `SyncProtocols.WallClock.createBinaryWebSocketClient` - binary protocol via WebSocket
* `SyncProtocols.WallClock.createBinaryUdpClient` - binary protocol via UDP (nodejs only)


## Library architecture

The library is designed to be modular and allow protocols (clients/servers) 
to be separated from on-the-wire message formats (Json/Binary etc)
and the type of network transport (UDP/Websockets etc).

Protocol Handlers implement the protocol:

* `sync-protocols.WallClock.WallClockClientProtocol` - implements a WallClock protocol client

These have a handler function that is called when a message is received, and they
emit a `send` event to request a message be sent.

Internally they use objects represent protocol messages in the abstract:

* `SyncProtocols.WallClock.WallClockMessage` - object representing a Wall Clock protocol message
 
But the protocol handler also uses serialisers to *pack* or *unpack* then to/from on-the-wire formats:

* `SyncProtocols.WallClock.BinarySerialiser` - packs/unpacks to the binary format used in [DVB CSS](http://www.etsi.org/deliver/etsi_ts/103200_103299/10328602/01.01.01_60/ts_10328602v010101p.pdf)
* `SyncProtocols.WallClock.JsonSerialiser` - packs/unpacks to a JSON format

Adaptors provide the glue between the underlying network connection (represented usually by
some kind of 'socket' object) and the Protocol Handler. They notify the handler of
received messages and they listen for the 'send' events.

* `SyncProtocols.SocketAdapators.UdpAdaptor` - for node.js UDP [dgram](https://nodejs.org/api/dgram.html) object
* `SyncProtocols.SocketAdaptors.WebSocketAdaptor` - for any [W3C WebSocket API](https://www.w3.org/TR/websockets/) compliant object




## Protocol implementation details

### Wall Clock sync protocol

The protocol is intended to be a request-response protocol that functions
identically to that defined in clause 8 of the DVB CSS specification as the
"Wall Clock protocol".

As a quick reminder: the protocol is a request-response exchange that is
initiated by the party wishing to sync its clock (client)  to the other party
(server).

Message types are as follows:

| Value | Meaning                            |
| :---: | :--------------------------------- |
| 0     | Request                            |
| 1     | Response with no follow-up planned |
| 2     | Response with follow-up planned    |
| 3     | Follow-up                          |


#### Binary format

This is implemented in `sync-protocols.WallClock.BinarySerialiser`.

Identical to the DVB CSS format.

#### JSON serialisation format

This is implemented in `sync-protocols.WallClock.JsonSerialiser`.

The protocol message format carries the same fields as the DVB CSS wall clock
protocol, however instead of encoding them in a binary structure, they are
instead carried in a JSON object. The properties of the object are as follows:

Example: (with explanatory comments that must be removed for it to be valid JSON)

    {
        "v":    0,              /* version = 0 */
        "t":    2,              /* type = response with follow-up planned */
        "p":    0.0001,         /* server clock has 0.1 millisecond precision */
        "mfe":  50,             /* server clock max freq error = 50 ppm */
        "otvs": 19346582,       /* client request sent at 19346582.9826511 seconds */
        "otvn": 982651100,      
        "rt":   29784724.1927,  /* server received request at 29784724.1927 seconds */
        "tt":   29784724.1938   /* server sent response at 29784724.1938 seconds */
    }

##### Property names and meanings

| Property name | Value type | Value meaning                  | Units/default value |
| :------------ | :--------: | :----------------------------- | :-----------------: |
| v             | Number     | Message version                | 0                   |
| t             | Number     | Message type (see below)       | (see below)         |
| p             | Number     | Server clock precision         | seconds+fractions   |
| mfe           | Number     | Server clock max freq error    | ppm                 |
| otvs          | Number     | Request sent timevalue (secs)  | whole seconds       |
| otvn          | Number     | Request sent timevalue (nanos) | nanoseconds part    |
| rt            | Number     | Request received timevalue     | seconds+fractions   |
| tt            | Number     | Response sent timevalue        | seconds+fractions   |


## Authors

 * Matt Hammond (BBC)
