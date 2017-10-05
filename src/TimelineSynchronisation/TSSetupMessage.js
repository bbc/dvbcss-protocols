/****************************************************************************
 * Copyright 2017 Institut für Rundfunktechnik
 * and contributions Copyright 2017 British Broadcasting Corporation.
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
 * --------------------------------------------------------------------------
 * Summary of parts containing contributions
 *   by British Broadcasting Corporation (BBC):
 *     TSSetupMessage.deserialise : arraybuffer coercion
*****************************************************************************/

/**
 * @memberof sync-protocols.TimelineSynchronisation
 * @class
 * @description
 * Object representing the setup message for the timeline synchronistation protocol that is sent from the client to the server initially. See ETSI TS XXX
 *
 * @constructor
 * @param {string} contentIdStem is a string value consisting of a CI stem.
 * @param {string} timelineSelector is a string value consisting of a URI that indicates which Synchronisation Timeline is to be used for Timestamps.
 */

function TSSetupMessage (contentIdStem, timelineSelector) {
  this.contentIdStem = contentIdStem;
  this.timelineSelector = timelineSelector;

  if (typeof contentIdStem !== "string" || typeof timelineSelector !== "string") {
    throw "TSSetupMessage(): Invalid parameters.";
  }
};

TSSetupMessage.prototype.serialise = function () {
  return JSON.stringify(this);
};

TSSetupMessage.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);

  return new TSSetupMessage (o.contentIdStem, o.timelineSelector);
};

module.exports = TSSetupMessage;
