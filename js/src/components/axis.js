Chartmander.components.axis = function () {

  var axis = this;

  var labels = []
    , labelSpace = 0
    , dataMin = 0
    , dataMax = 0
    , scale = 1
    , format = ""
    , opacity = 0
    ;

  // RECALC/DRAW X axis specific.......

  // recalc = function (chart, type) {

  //   var range = dataMax - dataMin
  //     , steps = [
  //       {
  //         "days": 1,
  //         "label": "days"
  //       },
  //       {
  //         "days": 7,
  //         "label": "weeks"
  //       },
  //       {
  //         "days": 30,
  //         "label": "months"
  //       },
  //       {
  //         "days": 365,
  //         "label": "years"
  //       }
  //     ]
  //     , dayMSec = 60*60*24*1000
  //     , daysInRange = range/dayMSec
  //     , startDate = moment(dataMin)
  //     , stepIndex = steps.length
  //     , labelCount = 0
  //     ;

  //   TPP(range/chart.getGridProperties().width);
  //   labels = [];

  //   while (labelCount < 1) {
  //     stepIndex--;
  //     labelCount = daysInRange/steps[stepIndex].days;
  //   }
  //   labelsCount = Math.round(labelCount);

  //   for (var i = 0; i < labelCount; i++) {
  //     var label = moment(startDate).add(steps[stepIndex].label, i);
  //     labels.push(label.valueOf());
  //   }

  //   return axis;
  // }

  // drawInto = function (chart) {
  //   var ctx = chart.ctx
  //     , topOffset = chart.grid.config().bottom + 25
  //     ;

  //   ctx.save();
  //   ctx.fillStyle = chart.fontColor();
  //   ctx.font = chart.font();
  //   forEach(labels, function (label) {
  //     var leftOffset = chart.getGridProperties().left + (label-chart.xAxis.dataMin)/chart.xAxis.TPP();
      
  //   })
  //   each(function (label) {
  //       ;
  //     ctx.fillText(moment(label).format(axis.dateFormat()), leftOffset, topOffset);
  //   });
  //   ctx.restore();
  // }

  each = function (action) {
    forEach(labels, action);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.min = function (_) {
    if (!arguments.length) return dataMin;
    dataMin = _;
    return axis; 
  }

  axis.max = function (_) {
    if (!arguments.length) return dataMax;
    dataMax = _;
    return axis;
  }

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  }
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  }

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  }

  axis.opacity = function () {
    return opacity;
  }

  axis.fadeIn = function () {
    opacity += .05;
    if (opacity > 1)
      opacity = 1;
  }

  axis.fadeOut = function () {
    opacity -= .05;
    if (opacity < 0)
      opacity = 0;
  }

  return axis;
}
