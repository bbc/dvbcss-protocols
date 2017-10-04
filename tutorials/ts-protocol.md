**This is only an introduction to the CSS-TS "Timeline Synchronisation" protocol.**
 * **See the [docs for the TimelineSynchronisation namespace]{@link sync-protocols.TimelineSynchronisation} to understand
   how to write client or server code using this library.**
 * **See clause 9 of the [DVB CSS specification](http://www.etsi.org/standards-search?search=103+286&page=1&title=1&keywords=1&ed=1&sortby=1) for full detailed semantics of the protocol.**
 * **See clause 13 of the [HbbTV 2 specification](http://hbbtv.org/resource-library/) to
   understand how it is used by HbbTV 2 TVs.**

The TS protocol is a mechanism for a server to share timeline position and playback
speed with a client. In effect it enables a client to synchronise its understanding of
the progress of media presentation with that of a server, in terms of a particular
timeline.

It involves the exchange of Timestamp messages which describe the state of the
timeline for the media on the TV at a given Wall Clock time. It must therefore be
used in conjunction with the DVB CSS Wall Clock protocol, or some other means
of establishing a shared sense of Wall Clock time between the client and server.

The protocol consists of simple JSON messages carried via a WebSocket connection.

### 1. Client connects via WebSockets and sends a "Setup Data" message

Example Setup Data message:
```
    {
        "contentIdStem"    : "dvb://233a.1004.1044",
        "timelineSelector" : "urn:dvb:css:timeline:pts"
    }
```
This instructs the TV to select a particular timeline available to it (PTS from
broadcast in the above example) and sets a condition that we only want to
receive timestamps when the content ID (reported via [CSS-CII protocol]{@tutorial cii-protocol}) begins
with the specified string (the contentIdStem).

### 2. Timestamps are received

After the TV receives the Setup Data message, it will start sending Control
Timestamp messages. These convey the position and current speed of the timeline
of the media content on the TV. This is described in relation to a particular
wall clock time, which enables the client to extrapolate time into the future.

For example:
```
    {
        "contentTime"             : "834188",
        "wallClockTime"           : "116012000000",
        "timelineSpeedMultiplier" : 1.0
    }
```
This message is saying that the timeline of the media playing on the TV is
at time position 834188 when the shared wall clock was at 116012000000 and
currently the media is playing at speed +1 which is normal playback.

*NOTE that the contentTime and wallClockTime values are numbers conveyed
as strings.*

It might also convey that the timeline is currently *unavailable*. This can be
because of a variety of reasons:
 * the contentId does not begin with the specified contentIdStem;
 * OR the timeline requested does not exist for the media being played

An *unavailable* timeline is indicated by the contentTime and
timelineSpeedMultiplier fields being null. For example:
```
    {
        "contentTime"             : null,
        "wallClockTime"           : "116012000000",
        "timelineSpeedMultiplier" : null
    }
```

### 3. Client can also report timestamps back to the server

Optionally, the client can also send its own timestamps to the server in the
form of an *Actual, Earliest and Latest Presentation Timestamp*. This
enables a client to inform a server of what time it is presenting at (the
“actual” part of the timestamp) and also to indicate the earliest and "latest"
times it could present. It is, in effect, three correlations bundled into one
message, to represent each of these three aspects. Earliest and Latest
correlations are allowed to have -infinity and +infinity for the wall clock
time to indicate that the client has no limits on how early, or late,
it can present.

For example, here is how a client might indicate its current position as well
as a limit on how much earlier it could present, but that there is no limit
on how long it can delay (buffer):
```
    {
        "actual" : {
            "contentTime"   : "834190",
            "wallClockTime" : "115992000000"
        },
        "earliest" : {
            "contentTime"   : "834190",
            "wallClockTime" : "115984000000"
        },
        "latest" : {
            "contentTime"   : "834190",
            "wallClockTime" : "plusinfinity"
        }
    }
```

