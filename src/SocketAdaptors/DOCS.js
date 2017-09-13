/**
 * @memberof sync-protocols
 * @namespace SocketAdaptors
 * @description
 * <p><em>It is unlikely that you will need to use anything in this namespace directly
 * unless you are implementing new protocol handlers or serialisation options.</em>.
 *
 * <p>This namspace contains adaptors for various kind of socket objects representing network connections.
 * These are used internally by the createXXX() methods defined in the other
 * namespaces.
 *
 * <p>These adaptors interface between the object representing the network connection
 * (such as a {@link WebSocket} or a node.js [dgram_Socket]{@link dgram_Socket}) and the {@link ProtocolHandler}.
 */
 