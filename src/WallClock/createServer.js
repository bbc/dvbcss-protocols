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
 * @memberof sync-protocols.WallClock
 * @description
 * Factory function that creates a Wall Clock server.
 *
 * @param {Socket} socket Socket object representing the connection e.g. a UDP socket or a WebSocket
 * @param {Adaptor} AdaptorClass Adaptor class for the socket object
 * @param {Serialiser} serialiser Message seraliser
 * @param {CorrelatedClock} wallClock
 * @param {Object} protocolOptions Object.
 * @param {Number} protocolOptions.precision Precision of server's WallClock in seconds and fractions of a second
 * @param {Number} protocolOptions.maxFreqError max frequency error of server's WallClock in ppm (parts per million)
 * @param {Boolean} protocolOptions.followup Flag set to true if the WallClock server will followup responses to requests with more accurate values for timestamps
 * @returns {SocketAdaptor} The Socket adaptor wrapping the whole server.
 */
var createServer = function(socket, AdaptorClass, serialiser, wallClock, protocolOptions) {
	return new AdaptorClass(
			new WallClockServerProtocol(
					wallClock,
					serialiser,
					protocolOptions
			),
			socket);
};


module.exports = createServer;
