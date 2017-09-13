var TimelineProperties = require("./TimelineProperties");

/**
 * @memberof sync-protocols.CII
 * @class
 * @description
 * Object representing a CII message sent from the MSAS to the synchronisation clients.
 *
 * @constructor
 * @param {String} [protocolVersion] The protocol version being used by the server or <code>undefined</code>.
 * @param {?String} [mrsUrl] The URL of an MRS server known to the server, or <code>null</code> or <code>undefined</code>.
 * @param {?String} [contentId] Content identifier URI, or <code>undefined</code>.
 * @param {?String} [contentIdStatus] Content identifier status, or <code>undefined</code>
 * @param {?String} [presentationStatus] Presentation status as a string, e.g. "okay", or <code>undefined</code>
 * @param {?String} [wcUrl] CSS-WC server endpoint URL in the form “udp://<host>:<port>”, or <code>undefined</code>.
 * @param {?String} [tsUrl] CSS-TS server endpoint WebSocket URL, or <code>undefined</code>.
 * @param {?Array.<TimelineProperties>} [timelines] Array of timeline property objects, or <code>undefined</code>.
 */
var CIIMessage = function(protocolVersion, mrsUrl, contentId, contentIdStatus, presentationStatus, wcUrl, tsUrl, timelines) {

  var self = this;
  Object.defineProperty(self, "protocolVersion",    { enumerable: true, value: protocolVersion});
  Object.defineProperty(self, "mrsUrl",             { enumerable: true, value: mrsUrl });
  Object.defineProperty(self, 'contentId',          { enumerable: true, value: contentId });
  Object.defineProperty(self, 'contentIdStatus',    { enumerable: true, value: contentIdStatus });
  Object.defineProperty(self, 'presentationStatus', { enumerable: true, value: presentationStatus });
  Object.defineProperty(self, 'wcUrl',              { enumerable: true, value: wcUrl });
  Object.defineProperty(self, 'tsUrl',              { enumerable: true, value: tsUrl });
  Object.defineProperty(self, 'timelines',          { enumerable: true, value: timelines });
};


/**
 * Serialise to JSON
 * @returns {String} JSON representation of this CII message as defined by ETSI TS 103 286 clause 5.6.7
 */
CIIMessage.prototype.serialise = function () {
  return JSON.stringify(this);
};

/**
 * Parse a JSON representation of a CII message as defined by ETSI TS 103 286 clause 5.6.7.
 * @param {String} jsonVal The CII message encoded as JSON.
 * @returns {CIIMessage} with the same properties as the JSON§ passed as the argument
 */
CIIMessage.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);

  var myTimelines= [];
  var timeline;

  if (Array.isArray(o.timelines))
  {
      o.timelines.forEach(function(timelineObj) {

        timeline = TimelineProperties.getFromObj(timelineObj);

        if (typeof timeline !== "undefined")
        {
          myTimelines.push(timeline);
        }
    });
  }
  return new CIIMessage (o.protocolVersion, o.msrUrl, o.contentId, o.contentIdStatus, o.presentationStatus, o.wcUrl, o.tsUrl, myTimelines);

};

/**
 * A set of bit masks representing each property in a CII message. Used by ORing together to flag which properties have changed in [ciiChangedCallback()]{@link ciiChangedCallback}
 * @readonly
 * @enum {number}
 */
CIIMessage.CIIChangeMask = CIIMessage.prototype.CIIChangeMask = {
    /** Mask for the bit that is set if this is the first CII message received */
	FIRST_CII_RECEIVED:          (1 << 0),
    /** Mask for the bit that is set if the "mrsUrl" property has changed */
	MRS_URL_CHANGED:             (1 << 1),
    /**  Mask for the bit that is set if the "contentId" property has changed */
	CONTENTID_CHANGED:           (1 << 2),
    /** Mask for the bit that is set if the "contentIdStatus" property has changed */
	CONTENTID_STATUS_CHANGED:    (1 << 3),
    /** Mask for the bit that is set if the "presentationStatus" property has changed */
	PRES_STATUS_CHANGED:         (1 << 4),
    /** Mask for the bit that is set if the "wcUrl" property has changed */
	WC_URL_CHANGED:              (1 << 5),
    /** Mask for the bit that is set if the "tsUrl" property has changed */
	TS_URL_CHANGED:              (1 << 6),
    /** Mask for the bit that is set if the "timelines" property has changed */
	TIMELINES_CHANGED:           (1 << 7),
    /** Mask for the bit that is set if the "protocolVersion" property has changed */
    PROTOCOL_VERSION_CHANGED:    (1 << 8)
};


var CII_KEYS = [
    "protocolVersion",
    "mrsUrl",
    "contentId",
    "contentIdStatus",
    "presentationStatus",
    "tsUrl",
    "wcUrl",
    "timelines"
];

var CHANGE_MASKS = {
    "protocolVersion" : CIIMessage.CIIChangeMask.PROTOCOL_VERSION_CHANGED,
    "mrsUrl" : CIIMessage.CIIChangeMask.MRS_URL_CHANGED,
    "contentId" : CIIMessage.CIIChangeMask.CONTENTID_CHANGED,
    "contentIdStatus" : CIIMessage.CIIChangeMask.CONTENTID_STATUS_CHANGED,
    "presentationStatus" : CIIMessage.CIIChangeMask.PRES_STATUS_CHANGED,
    "tsUrl" : CIIMessage.CIIChangeMask.WC_URL_CHANGED,
    "wcUrl" : CIIMessage.CIIChangeMask.TS_URL_CHANGED,
    "timelines" : CIIMessage.CIIChangeMask.TIMELINES_CHANGED
};

/**
 * Checks if two CII Message objects are equivalent
 * by checking if all CII properties match exactly.
 * @param {CIIMessage} obj
 * @returns {Boolean} Truthy if the properties of both CIIMessage objects  are equal.
 */
CIIMessage.prototype.equals = function(obj) {
    try {
        return typeof obj === "object" &&
            this.protocolVersion === obj.protocolVersion &&
            this.mrsUrl === obj.mrsUrl &&
            this.contentId === obj.contentId &&
            this.contentIdStatus === obj.contentIdStatus &&
            this.presentationStatus === obj.presentationStatus &&
            this.wcUrl === obj.wcUrl &&
            this.tsUrl === obj.tsUrl &&
            timelinesEqual(this.timelines, obj.timelines);

    } catch (e) {
        return false;
    }
};

function timelinesEqual(tA, tB) {
    return tA === tB || (
        tA instanceof Array &&
        tB instanceof Array &&
        tA.length === tB.length &&
        tA.map( function(e, i) {
            return e.equals(tB[i]);
        }).reduce(  function(x,y) {
            return x && y;
        }, true)
    );
}


CIIMessage.prototype.compare = function (anotherCII, retChanges)
{
    var changemask = 0;
    var name, i;
    retChanges = retChanges === undefined ? {} : retChanges;
    
    for(i=0; i<CII_KEYS.length; i++) {
        name=CII_KEYS[i];
        if (anotherCII[name] === undefined) {
            retChanges[name] = false;

        } else {
            if (name === "timelines") {
                retChanges[name] = !timelinesEqual(this[name], anotherCII[name]);
            } else {
                retChanges[name] = anotherCII[name] !== this[name];
            }
            
            if (retChanges[name]) {
                changemask |= CHANGE_MASKS[name];
            }
            
        }
    }
    return changemask;
};


/**
 * Merge properties of this CIIMessage with the supplied CIIMessage.
 * The returned CIIMessage contains all the properties from both. If
 * a property is undefined in the supplied CIIMessage then its value from this
 * message is preserved. If a property is defined in the supplied CIIMessage
 * then that value is taken and the one from this message is ignored.
 *
 * @param {CIIMessage} newerCII whose defined properties override those of the existing CIIMessage.
 * @return {CIIMessage} that is the result of the merge.
 */ 
CIIMessage.prototype.merge = function (newerCII) {
    var merged = {};
    var i, key;
    
    for(i=0; i<CII_KEYS.length; i++) {
        key = CII_KEYS[i];
        if (newerCII[key] !== undefined) {
            merged[key] = newerCII[key];
        } else {
            merged[key] = this[key];
        }
    }
    
    return new CIIMessage(
        merged.protocolVersion,
        merged.mrsUrl,
        merged.contentId,
        merged.contentIdStatus,
        merged.presentationStatus,
        merged.wcUrl,
        merged.tsUrl,
        merged.timelines
    );
};

module.exports = CIIMessage;
