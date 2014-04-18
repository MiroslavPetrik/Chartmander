Chartmander.components.axis = function () {

  var axis = new Chartmander.components.animatedPart();

  // implement in chart as x/y with options horizontal/vertical  aligned top, bottom or left,right

  var labels      = [] // stored labels
    // , labelSpace = 0
    , min         = 0 // lowest value
    , max         = 0 // largest value 
    , scale       = 1 // value per pixel || time per pixel etc... (delta divided by chart height)
    , delta       = 0 // maxVal - min value
    , format      = "" // moment.js format string
    , orientation = "horizontal" // or vertical
    , margin      = 10 // distance from grid 
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  };

  axis.getLabel = function (index) {
    return labels[index];
  };

  axis.each = function (action) {
    forEach(labels, action);
  };

  axis.min = function (_) {
    if (!arguments.length) return min;
    min = _;
    return axis; 
  };

  axis.max = function (_) {
    if (!arguments.length) return max;
    max = _;
    return axis;
  };

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  };
  
  axis.delta = function (_) {
    if (!arguments.length) return delta;
    delta = _;
    return axis;
  };
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  };

  axis.orientation = function (_) {
    if (!arguments.length) return orientation;
    orientation = _;
    return axis;
  };

  axis.margin = function (_) {
    if(!arguments.length) return margin;
    margin = _;
    return axis;
  };

  // faux
  axis.copy = function () {
    return {
      state: axis.getState(),
      labels: labels,
      scale: scale
    };
  };

  return axis;
}
