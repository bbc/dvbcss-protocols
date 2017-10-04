/**
 * @memberof sync-protocols
 * @namespace TimelineSynchronisation
 * @description
 * Classes, methods and objects implementing the [Timeline synchronisation protocol]{@tutorial protocol-ts}.
 *
 * <p>The simplest way to use them is to create the network connection, and {CorrelatedClock}
 * to represent the Synchronisation Timeline then pass both to the appropriate factory function:
 * <ul>
 *   <li> [createTSClient(...)]{@link sync-protocols.TimelineSynchronisation.createTSClient}
 * </ul>
 * The clock must have its parent already set to a clock object representing the [Wall Clock]{@tutorial protocol-wc}.
 *
 * The clock will be kept up-to-date as messages are received. This includes setting inherits
 * availability flag to reflect whether the timeline is signalled by the server as available.
 *
 * @example
 * <caption>Using a Timeline Syncronisation client to synchornise to a server. Uses Websockets and JSON format messages:</caption>
 * var WebSocket = require('ws');
 * var clocks = require("dvbcss-clocks");
 * var SyncProtocols = require("sync-protocols");
 * var createClient = SyncProtocols.TimelineSynchronisation.createTSClient;
 * 
 * var ws = new WebSocket("ws://127.0.0.1:7681/wall-clock-server");
 * 
 * var root = new clocks.DateNowClock();
 * var wallClock = new clocks.CorrelatedClock(root, {tickRate:1000000000});
 * var timelineClock = new clocks.CorrelatedClock(wallClock, {tickRate:90000})
 * var options = {
 *     contentIDStem: "",
 *     timelineSelector: "urn:dvb:css:timeline:pts",
 *     tickrate: timelineClock.tickRate
 * }
 * 
 * var client = createClient(ws, timelineClock, options);
 * 
 * // the timelineClock will now be automatically updated as messages are received.
 * // Then at some point later, just close the WebSocket connection to stop the client:
 * ws.close();
 * 
 */
