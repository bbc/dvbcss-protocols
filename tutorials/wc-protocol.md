**This is only an introduction to the CSS-WC "Wall Clock" protocol.**
 * **See the [docs for the WallClock namespace]{@link dvbcss-protocols.WallClock} to understand
   how to write client or server code using this library.**
 * **See clause 8 of the [DVB CSS specification](http://www.etsi.org/standards-search?search=103+286&page=1&title=1&keywords=1&ed=1&sortby=1) for full detailed semantics of the protocol.**
 * **See clause 13 of the [HbbTV 2 specification](http://hbbtv.org/resource-library/) to
   understand how it is used by HbbTV 2 TVs.**

The purpose of the CSS-WC protocol is clock synchronisation. It establishes a
common shared clock (the "wall clock") between TV and companion, compensating
for network latency and jitter.

It is a request-response exchange that is initiated by the party wishing to sync
its clock (client) to the other party (server). Typically he server is the TV
and the client is a companion application.

The client uses the information carried in the protocol to estimate the server
wall clock and attempt to compensate for network latency. This is a
connectionless UDP protocol similar to NTP’s client-server mode of operation,
but much simplified and not intended to set the system real-time clock.

(This library implementation also supports carrying the same messages via
WebSockets, but this is not typically supported by TVs).

## How the protocol works

The client is assumed to already know the host and port number of the CSS-WC
server (usually from the information received via the
[CSS-CII protocol]{@tutorial cii-protocol}).

The client sends a Wall Clock protocol “request” message to the server.
The server sends back a Wall Clock protocol “response” message to the client.

If the server is able to more accurately measure when it sent a message after
it has done so, then it can optionally send a “follow-up response” with this
information.

The client repeats this process as often as it needs to.

## The underlying principles

The client notes the time at which the request is sent and the response received,
and by the server including the times at which it received the request and sent
its response. Using this information the client can estimate the relationship
between the time of its clock and that of the server. It can also calculate an
error bound on this (known as dispersion):

<div style="text-align:center;">
    <img src="wc-request-response.png" style="width:40%; min-width: 8em; max-width: 15em;">
</div>

Relationship expressed as an estimated offset:

 * Offset between local clock and server wall clock is (( t3 + t2 ) - ( t4 + t1 )) / 2

Relationship expressed as a correlation:
 * When local clock is ( t1 + t4 )/2
 * ... the server wall clock is estimated to be ( t2 + t3 )/2

The [DVB CSS specification](http://www.etsi.org/standards-search?search=103+286&page=1&title=1&keywords=1&ed=1&sortby=1)
contains an annex that goes into more detail on the theory of how to calculate dispersion and how a client can use this as part of a simple algorithm to align its wall clock.

### Message format

A Wall Clock protocol message carries the following data:

 * Protocol **version** identifier
 * Message **type** (request / response / response-before-follow-up / follow-up)
 * The **precision** of the server’s wall clock
 * The **maximum frequency error** of the server’s wall clock
 * Timevalues (in NTP 64-bit time format, comprising a 32bit word carrying the
   number of nanoseconds and another 32bit word containing the number of seconds)
    * **Originate timevalue**: when the client sent the request.
    * **Receive timevalue**: when the server received the request.
    * **Transmit timevalue**: when the server sent the response.

The precision, max freq error, receive timevalue and transmit timevalue fields
only have meaning in a response from a server. Their values do not matter in
requests.

#### Binary serialisation of messages

This is implemented in `dvbcss-protocols.WallClock.BinarySerialiser` and is
the serialisation support by HbbTV 2 TVs via UDP.

#### JSON serialisation of messages

This is implemented in `dvbcss-protocols.WallClock.JsonSerialiser`.

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

