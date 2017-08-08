var TimelineProperties = require("./TimelineProperties");
/**
 * @alias module:sync-protocols/CII.cii
 * @class
 * @description
 * Object representing a CII message sent from the MSAS to the synchronistion clients.
 *
 * @constructor
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
 * @returns {string} string representation of the CII as defined by ETSI CII XXX XXX clause 5.7.4
 */
CIIMessage.prototype.serialise = function () {
  return JSON.stringify(this);
}

/**
 * @returns {PresentationTimestamps} actual, earliest and latest presentation timestamps from a JSON formatted string
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

// FLAGS
CIIMessage.CIIChangeMask = CIIMessage.prototype.CIIChangeMask = {
	FIRST_CII_RECEIVED:          (1 << 0), // 0001
	MRS_URL_CHANGED:             (1 << 1),
	CONTENTID_CHANGED:           (1 << 2),
	  CONTENTID_STATUS_CHANGED:    (1 << 3),
	  PRES_STATUS_CHANGED:         (1 << 4),
	  WC_URL_CHANGED:              (1 << 5),
	  TS_URL_CHANGED:              (1 << 6),
	  TIMELINES_CHANGED:           (1 << 7),
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
