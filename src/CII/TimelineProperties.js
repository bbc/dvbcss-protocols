

/**
 * @alias module:sync-protocols/CII.TimelineProperties
 * @class
 * @description
 * Object representing properties for an available timeline signalled in a CII message.
 *
 * @constructor
 */
var TimelineProperties = function(timelineSelector, unitsPerTick, unitsPerSecond, accuracy) {


  const self = this;

  Object.defineProperty(self, "timelineSelector",  { enumerable: true, value: timelineSelector});
  Object.defineProperty(self, "unitsPerTick",      { enumerable: true, value: Number(unitsPerTick)});
  Object.defineProperty(self, "unitsPerSecond",    { enumerable: true, value: Number(unitsPerSecond) });
  Object.defineProperty(self, 'accuracy',          { enumerable: true, value: Number(accuracy) });


}

/**
 * Method intended to be called from PresentationTimestamps.deserialise
 * @returns {PresentationTimestamp} translates an object into a PresentationTimestamp.
 */
TimelineProperties.getFromObj = function (o) {

  return new TimelineProperties(o.timelineSelector,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.unitsPerTick : o.unitsPerTick,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.unitsPerSecond : o.unitsPerSecond,
                                typeof o.timelineProperties !== 'undefined' ? o.timelineProperties.accuracy : o.accuracy
                              );
}


TimelineProperties.prototype.serialise = function()
{
	  return JSON.stringify(this);
}

// TimelineProperties.prototype.toJSON = function()
// {
// 	  return JSON.stringify(this);
// }

TimelineProperties.deserialise = function (jsonVal) {
    // coerce from arraybuffer,if needed
    if (jsonVal instanceof ArrayBuffer) {
        jsonVal = String.fromCharCode.apply(null, new Uint8Array(jsonVal));
    }
  var o = JSON.parse(jsonVal);

  return new TimelineProperties (o.timelineSelector, o.unitsPerTick, o.unitsPerSecond, o.accuracy);
};

module.exports = TimelineProperties;
