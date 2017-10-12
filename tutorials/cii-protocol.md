**This is only an introduction to the CSS-CII protocol.**
 * **See the [docs for the CII namespace]{@link dvbcss-protocols.CII} to understand
   how to write client or server code using this library.**
 * **See clause 6 of the [DVB CSS specification](http://www.etsi.org/standards-search?search=103+286&page=1&title=1&keywords=1&ed=1&sortby=1) for full detailed semantics of the protocol.**
 * **See clause 13 of the [HbbTV 2 specification](http://hbbtv.org/resource-library/) to
   understand how it is used by HbbTV 2 TVs.**

The CII protocol conveys the content Identifier and other Information that from
the TV to the client. It uses JSON messages sent via a WebSockets connection.
The TV is the WebSocket server.

A CII message comprises a JSON object with a set of defined properties. The server
pushes messages containing some or all of these properties (at minimum, but not
necessarily exclusively, those that have changed). The frequency of these messages
and exactly what properties are included are at the discretion of the server (the
TV).

When a client initially connects it assumes all properties have the value `null`.
Any properties present in messages received from the server update the local Value
of those properties in the client. Other properties not included in the message
preserve their previous value.

The properties that can be included are as follows:

 * `protocolVersion` (string) currently "1.1" describing the version of the protocol
   being used. This must be included in the first message the TV sends to a client
   that has connected.
  
 * `contentId` (string|null) a URI identifying the content being shown on the TV.
   For broadcast, this is a `dvb://` URL. For IP delivered streams it will be the
   URL from which it was obtained. Can also be `null` if there is no content being
   shown.
  
 * `contentIDStatus` (string|null) whether the content Id is in its "final" form
   or an intermediate "partial" form because the TV does not yet have all the data
   it needs for the "final" form.
   
 * `presentationStatus` (string|null) Primarily whether the presentation of content
   is "okay", or in a "fault" condition, or "transitioning" between content. This is
   actually a space-separated list of tokens. "okay" or "transitioning" or "fault"
   is always the first token in the string. A TV can optionally define and used
   additional tokens.
   
 * `mrsUrl` (string|null) The URL of an MRS server, or `null` if none is available.
 
 * `tsUrl` (string|null) The URL of the [CSS-TS]{@tutorial ts-protocol} server in the TV that is used for
   Timeline Synchronisation.
   
 * `wcUrl` (string|null) The URL of the [Wall Clock]{@tutorial wc-protocol} server in the TV. This is of the
   form "udp://&lt;address&gt;:&lt;port&gt;"
   
 * `teUrl` (string|null) The URL of the trigger event service in the TV.
 
 * `timelines` (array) A list of zero, one or more timelines that the TV believes
   may be available for synchronising to. Not guaranteed.
   
For example:
```
    {
        "protocolVersion"    : "1.1",
        "mrsUrl"             : "http://css.bbc.co.uk/dvb/233A/mrs",
        "contentId"          : "dvb://233a.1004.1044;363a~20130218T0915Z--PT00H45M",
        "contentIdStatus"    : "partial",
        "presentationStatus" : "okay",
        "wcUrl"              : "udp://192.168.1.5:5800",
        "tsUrl"              : "ws://192.168.1.8:5815",
        "timelines" : [
            {
                "timelineSelector"   : "urn:dvb:css:timeline:temi:1:1",
                "timelineProperties" : {
                    "unitsPerTick"   : 5,
                    "unitsPerSecond" : 10
                }
            }
        ]
    }
```

An example of a message that updates only certain properties:
```
    {
        "contentId"          : "dvb://233a.1004.1044;364f~20130218T1000Z--PT01H15M",
        "contentIdStatus"    : "partial",
    }
```

