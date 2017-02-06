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

  const self = this;
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
CIIMessage.prototype.deserialise = function (jsonVal) {
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

}

// FLAGS
CIIMessage.prototype.CIIChangeMask = {
	FIRST_CII_RECEIVED:          (1 << 0), // 0001
	MRS_URL_CHANGED:             (1 << 1),
	CONTENTID_CHANGED:           (1 << 2),
	  CONTENTID_STATUS_CHANGED:    (1 << 3),
	  PRES_STATUS_CHANGED:         (1 << 4),
	  WC_URL_CHANGED:              (1 << 5),
	  TS_URL_CHANGED:              (1 << 6),
	  TIMELINES_CHANGED:           (1 << 7)
}



CIIMessage.prototype.equal = function(x, y) {

    if (typeof x !== typeof y) return false;
    if (x instanceof Array && y instanceof Array && x.length !== y.length) return false;
        
    if (typeof x === 'object') {
        for (var p in x) 
        	if (x.hasOwnProperty(p)){
	        	
	        	if (typeof x[p] === 'function' && typeof y[p] === 'function') continue;
	            if (x[p] instanceof Array && y[p] instanceof Array && x[p].length !== y[p].length) return false;
	            if (typeof x[p] !== typeof y[p]) return false;
 	            
	            if (typeof x[p] === 'object' && typeof y[p] === 'object') { 
	            	if (!this.equal(x[p], y[p])) 
	            		return false; 
	            } 
	            else
	            	if (x[p] !== y[p]) return false;
        }
    } else return x === y;
    return true;
};


CIIMessage.prototype.compare = function (anotherCII)
{
    var changemask = 0;

    if (this.mrsUrl){
	    if (this.mrsUrl !== anotherCII.mrsUrl) changemask |= CIIMessage.prototype.CIIChangeMask.MRS_URL_CHANGED;
    }
    
//    console.log(anotherCII.contentId);
//    console.log(this.contentId);
    
    if (typeof this.contentId !='undefined'){
    	 if (this.contentId !== anotherCII.contentId) changemask |= CIIMessage.prototype.CIIChangeMask.CONTENTID_CHANGED;
    }
   
    if (typeof this.contentIdStatus != 'undefined'){
    	if (this.contentIdStatus !== anotherCII.contentIdStatus) changemask |= CIIMessage.prototype.CIIChangeMask.CONTENTID_STATUS_CHANGED;
    }
    
    if (typeof this.presentationStatus!='undefined') {
    	 if (this.presentationStatus !== anotherCII.presentationStatus)
    	      changemask |= CIIMessage.prototype.CIIChangeMask.PRES_STATUS_CHANGED;
    }
    
    if (typeof this.wcUrl!='undefined') {
	    if (this.wcUrl !== anotherCII.wcUrl)
	      changemask |= CIIMessage.prototype.CIIChangeMask.WC_URL_CHANGED;
    }
    
    if (typeof this.tsUrl!='undefined') {
	    if (this.tsUrl !== anotherCII.tsUrl)
	      changemask |= CIIMessage.prototype.CIIChangeMask.TS_URL_CHANGED;
    }
    
    if (typeof this.timelines!='undefined') {
	    if (!this.equal(this.timelines, anotherCII.timelines))
	      changemask |= CIIMessage.prototype.CIIChangeMask.TIMELINES_CHANGED;
    }

    return changemask;
}

module.exports = CIIMessage;
