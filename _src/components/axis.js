Chartmander.components.axis = function () {

  var axis = new Chartmander.components.animatedPart();

  var labels = []
    , labelSpace = 0
    , dataMin = 0
    , dataMax = 0
    , scale = 1
    , delta = 0
    , format = ""
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.opacity = function () {
    return axis.getState();
  };

  axis.min = function (_) {
    if (!arguments.length) return dataMin;
    dataMin = _;
    return axis; 
  };

  axis.max = function (_) {
    if (!arguments.length) return dataMax;
    dataMax = _;
    return axis;
  };

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  };
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  };

  axis.each = function (action) {
    forEach(labels, action);
  };

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  };

  axis.getLabel = function (index) {
    return labels[index];
  };

  axis.delta = function (_) {
    if (!arguments.length) return delta;
    delta = _;
    return axis;
  };

  return axis;
}
