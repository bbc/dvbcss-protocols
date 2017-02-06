

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
                                o.timelineProperties.unitsPerTick,
                                o.timelineProperties.unitsPerSecond,
                                o.timelineProperties.accuracy
                              );
}


module.exports = TimelineProperties;
