var TimelineProperties = require("./TimelineProperties");
/**
 * @alias module:sync-protocols/CII.cii
 * @class
 * @description
 * Object representing a CII message sent from the MSAS to the synchronistion clients.
 *
 * @constructor
 */
var CII = function(protocolVersion, mrsUrl, contentId, contentIdStatus, presentationStatus, wcUrl, tsUrl, timelines) {

  Object.defineProperty(self, "protocolVersion",    { value: protocolVersion});
  Object.defineProperty(self, "mrsUrl",             { value: mrsUrl });
  Object.defineProperty(self, 'contentId',          { value: contentId });
	Object.defineProperty(self, 'contentIdStatus',    { value: contentIdStatus });
  Object.defineProperty(self, 'presentationStatus', { value: presentationStatus });
  Object.defineProperty(self, 'wcUrl',              { value: wcUrl });
  Object.defineProperty(self, 'tsUrl',              { value: tsUrl });
  Object.defineProperty(self, 'timelines',          { value: timelines });
}

/**
 * @returns {string} string representation of the CII as defined by ETSI CII XXX XXX clause 5.7.4
 */
CII.prototype.serialise = function () {
  return JSON.stringify(this);
}

/**
 * @returns {PresentationTimestamps} actual, earliest and latest presentation timestamps from a JSON formatted string
 */
CII.prototype.deserialise = function (jsonVal) {
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

        timeline = TimelineProperties.getFromObj();

        if (typeof timeline !== "undefined")
        {
          myTimelines.push(timeline);
        }
    });
  }
  return new CII (o.protocolVersion, o.msrUrl, o.contentId, o.contentIdStatus, o.presentationStatus, o.wcUrl, o.tsUrl, myTimelines);

}

// FLAGS
CII.prototype.CIIChangeMask = {
	FIRST_CII_RECEIVED:          (1 << 0), // 0001
	MRS_URL_CHANGED:             (1 << 1),
	CONTENTID_CHANGED:           (1 << 2),
  CONTENTID_STATUS_CHANGED:    (1 << 3),
  PRES_STATUS_CHANGED:         (1 << 4),
  WC_URL_CHANGED:              (1 << 5),
  TS_URL_CHANGED:              (1 << 6),
  TIMELINES_CHANGED:           (1 << 7),
}


CII.prototype.equal = function(x, y) {
    if (typeof x !== typeof y) return false;
    if (x instanceof Array && y instanceof Array && x.length !== y.length) return false;
    if (typeof x === 'object') {
        for (var p in x) if (x.hasOwnProperty(p)) {
            if (typeof x[p] === 'function' && typeof y[p] === 'function') continue;
            if (x[p] instanceof Array && y[p] instanceof Array && x[p].length !== y[p].length) return false;
            if (typeof x[p] !== typeof y[p]) return false;
            if (typeof x[p] === 'object' && typeof y[p] === 'object') { if (!equal(x[p], y[p])) return false; } else
            if (x[p] !== y[p]) return false;
        }
    } else return x === y;
    return true;
};

CII.prototype.compare = function (anotherCII)
{
    var changemask = 0;

    if (this.mrsUrl !== anotherCII.mrsUrl)
      changemask | this.CIIChangeMask.MRS_URL_CHANGED;

    if (this.contentId !== anotherCII.contentId)
      changemask | this.CIIChangeMask.CONTENTID_CHANGED;

    if (this.contentIdStatus !== anotherCII.contentIdStatus)
      changemask | this.CIIChangeMask.CONTENTID_STATUS_CHANGED;

    if (this.presentationStatus !== anotherCII.presentationStatus)
      changemask | this.CIIChangeMask.PRES_STATUS_CHANGED;

    if (this.wcUrl !== anotherCII.wcUrl)
      changemask | this.CIIChangeMask.WC_URL_CHANGED;

    if (this.tsUrl !== anotherCII.tsUrl)
      changemask | this.CIIChangeMask.TS_URL_CHANGED;

    if (!this.equal(this.timelines, anotherCII.timelines))
      changemask | this.CIIChangeMask.TIMELINES_CHANGED;

    return changemask;
}

module.exports = CII;
