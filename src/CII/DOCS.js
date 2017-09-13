/**
 * @memberof sync-protocols
 * @namespace CII
 * @description
 * This namespace contains classes, methods and objects implementing the CII protocol.
 *
 * <p>The simplest way to use them is to create the WebSocket connection to the CII server
 * and then pass it to the appropriate factory function:
 * <ul>
 *   <li> [createCIIClient(...)]{@link sync-protocols.CII.createCIIClient}
 * </ul>
 * <p>Then, add an event listener to be notified of changes to CII state.
 * This is the recommended method.
 *
 * <p>You can alternatively pass in a [callback]{@link ciiChangedCallback} via the options property
 * that will be called whenever CII changes.
 *
 * @example
 * <caption>Using a CII client to synchronise to CII state on a server, and register an event listener to receive updates:</caption>
 * var WebSocket = require('ws');
 * var SyncProtocols = require("sync-protocols");
 * var createClient = SyncProtocols.CII.createCIIClient;
 * 
 * var ws = new WebSocket("ws://127.0.0.1:7681/cii");
 * 
 * var options = {};
 * var client = createClient(ws, options);
 * 
 * client.on('change', function(cii, changes, mask) {
 *     console.log("CII state is now: ",cii)
 *
 *     console.log("The following properties changed value:")
 *     for (var name in changes) {
 *         if (changes[name]) {
 *             console.log("    ",name)
 *         }
 *     }
 *
 *     if (mask & CIIMessage.CIIChangeMask.FIRST_CII_RECEIVED) {
 *         console.log("This was the first CII received")
 *     }
 *
 *     if (mask & CIIMessage.CIIChangeMask.CONTENTID_CHANGED) {
 *         console.log("The content ID changed")
 *     }
 * });
 *
 * @example
 * <caption>Using a CII client to synchronise to CII state on a server, and use a callback to receive updates:</caption>
 * var WebSocket = require('ws');
 * var SyncProtocols = require("sync-protocols");
 * var createClient = SyncProtocols.CII.createCIIClient;
 * 
 * var ws = new WebSocket("ws://127.0.0.1:7681/cii");
 * 
 * var options = { callback: ciiChangeCallback };
 * var client = createClient(ws, options);
 * 
 * function ciiChangeCallback(cii, mask) {
 *     console.log("CII state is now: ",cii)
 *
 *     if (mask & CIIMessage.CIIChangeMask.FIRST_CII_RECEIVED) {
 *         console.log("This was the first CII received")
 *     }
 *
 *     if (mask & CIIMessage.CIIChangeMask.CONTENTID_CHANGED) {
 *         console.log("The content ID changed")
 *     }
 * });
 *
 */
