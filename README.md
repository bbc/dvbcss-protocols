# JS sync protocols library for companion synchronisation

sync-protocols is a javascript library implementing client and server protocols
for synchronisation between TVs and companion screen applications using the protocols
specified by [DVB CSS](http://www.etsi.org/standards-search?search=103+286&page=1&title=1&keywords=1&ed=1&sortby=1)
or [HbbTV 2](http://hbbtv.org/resource-library/). 
 
The library is written in ES5 and works in the browser where it can provide WebSocket based clients only. To use it in applications that will run it the browser, it must be pre-processed using [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/). It also works in
node.js where it provides both UDP and WebSocket clients+servers.

|**Feature**             |**Supported in node**|**Supported in browser**<br/>(webpack/browserify) |
|------------------------|:------:|:-----------------------------------:|
|CII client (WebSockets) |  YES   | YES                                 |
|TS client (WebSockets)  |  YES   | YES                                 |
|TS client (UDP)         |  YES   |                                     |
|WC client (UDP)         |  YES   |                                     |
|WC client (WebSockets)  |  YES   | YES                                 |
|WC server (UDP)         |  YES   |                                     |
|WC server (WebSockets)  |  YES   | &nbsp;                              |

This library has similarities to the protocol components in [pydvbcss](https://github.com/bbc/pydvbcss)
and uses some similar patterns.

<img src="https://2immerse.eu/wp-content/uploads/2016/04/2-IMM_150x50.png" align="left"/><em>This project was originally developed as part of the <a href="https://2immerse.eu/">2-IMMERSE</a> project, co-funded by the European Commission’s <a hef="http://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> Research Programme</em>

## Getting started

### Use in your own project


Install via npm:

    $ npm install --save sync-protocols
    
Or download or clone this repository and build:

    $ cd sync-protocols
    $ npm install
    


## Documentation

JSDoc documentation can be built:

    $ grunt doc

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
    var WallClock = SyncProtocols.WallClock;
    var createClient = WallClock.createJsonWebSocketClient;

    var ws = new WebSocket("ws://127.0.0.1:7681/wall-clock-server");

    var root = new clocks.DateNowClock();
    var wallClock = new clocks.CorrelatedClock(root);

    var client = createClient(ws, wallClock);

Then at some point later, just close the WebSocket connection to stop the client:

    ws.close();

There are also functions to create other variants using different serialisations
or network connection types; and also for other protocols (CII protocol, TS protocol)...

## Factory functions provided

    var SyncProtocols = require("sync-protocols");
    
    var CII = SyncProtocols.CII;
    var TimelineSynchronisation = SyncProtocols.TimelineSynchronisation;
    var WallClock = SyncProtocols.WallClock;


**CII protocol** (clients only)

* `CII.`**`createCIIClient`** (JSON, WebSockets)


**Timeline Synchronisation protocol** (clients only)

* `TimelineSynchronisation.`**`createTSClient`** (JSON, WebSockets)


**Wall Clock protocol** (clients and servers)

* `WallClock.`**`createJsonWebSocketClient`**
* `WallClock.`**`createBinaryWebSocketClient`**
* `WallClock.`**`createBinaryUdpClient`**
* `WallClock.`**`createBinaryWebSocketServer`**
* `WallClock.`**`createBinaryUdpServer`**

Note that only Binary messages via UDP are truly compliant with the DVB-CSS
specification. The other variants have been created for convenience for use
in other applications that do not communicate directly with a TV implementing
DVB-CSS.

## Super-quick introduction to the protocols

DVB has defined 3 protocols for communicating between a companion and TV in
order to create synchronised second screen / dual screen / companion experiences
(choose whatever term you prefer!) that are implemented here:

 * CSS-CII - A WebSockets+JSON protocol that conveys state from the TV, such as
   the ID of the content being shown at the time. It also carries the URLs to
   connect to the other two protocols.

 * CSS-WC - A simple UDP protocol (like NTP but simplified) that establishes a
   common shared clock (a "wall clock") between the TV and companion, compensating
   for network delays.

 * CSS-TS - Another WebSockets+JSON protocol that communicates timestamps from
   TV to Companion that describe the current timeline position.

The TV implements servers for all 3 protocols. The Companion implements clients.

There are other protocols defined in the specification (CSS-TE and CSS-MRS) that
are not currently implemented by this library.


## Authors

 * Matt Hammond (BBC)
 * Rajiv Ramdhany (BBC)
