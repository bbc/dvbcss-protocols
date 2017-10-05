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
 