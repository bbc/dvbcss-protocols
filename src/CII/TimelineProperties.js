

/**
 * @memberof sync-protocols.CII
 * @class
 * @description
 * Object representing properties for an available timeline signalled in a CII message.
 *
 * @constructor
 * @param {String} timelineSelector the timeline selector for this timeline
 * @param {Number} unitsPerTick the denominator of the tick rate
 * @param {Number} unitsPerSecond the numerator of the tick rate
 * @param {Number} [accuracy] Indication of timeline accuracy, or <code>undefined</code>
 */
var TimelineProperties = function(timelineSelector, unitsPerTick, unitsPerSecond, accuracy) {


  const self = this;

  Object.defineProperty(self, "timelineSelector",  { enumerable: true, value: timelineSelector});
  Object.defineProperty(self, "unitsPerTick",      { enumerable: true, value: Number(unitsPerTick)});
  Object.defineProperty(self, "unitsPerSecond",    { enumerable: true, value: Number(unitsPerSecond) });
  Object.defineProperty(self, 'accuracy',          { enumerable: true, value: Number(accuracy) });


}

/**
 * Create a {TimelineProperties} object from a plain Javascript object with the same properties.
 * @param {Object} o An object with the same properties as a TimelineProperties object.
 * @returns {TimelineProperties} with the same properties as the object passed as the argument
 */
TimelineProperties.getFromObj = function (o) {

  return new TimelineProperties(o.timelineSelector,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.unitsPerTick : o.unitsPerTick,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.unitsPerSecond : o.unitsPerSecond,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.accuracy : o.accuracy
                              );
}


/**
 * Serialise to JSON
 * @returns {String} JSON representation of these timeline properties
 */
TimelineProperties.prototype.serialise = function()
{
	  return JSON.stringify(this);
}

/**
 * Parse a JSON representation of timeline properties.
 * @param {String} jsonVal The timeline properties encoded as JSON.
 * @returns {TimelineProperties} with the same properties as the JSON§ passed as the argument
 */
TimelineProperties.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);

  return new TimelineProperties (o.timelineSelector, o.unitsPerTick, o.unitsPerSecond, o.accuracy);
};

TimelineProperties.prototype.equals = function(obj) {
    return obj instanceof Object &&
        this.timelineSelector === obj.timelineSelector &&
        (this.unitsPerTick === obj.unitsPerTick ||
            (isNaN(this.unitsPerTick) && isNaN(obj.unitsPerTick))) &&
        (this.unitsPerSecond === obj.unitsPerSecond ||
            (isNaN(this.unitsPerSecond) && isNaN(obj.unitsPerSecond))) &&
        (this.accuracy === obj.accuracy ||
            (isNaN(this.accuracy) && isNaN(obj.accuracy)))
};

module.exports = TimelineProperties;
