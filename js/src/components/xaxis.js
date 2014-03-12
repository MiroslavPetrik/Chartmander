Chartmander.components.xAxis = function () {

  var axis = new Chartmander.components.axis();

  // rename to timeAxis ?
  // make another numberAxis and category
  // implement in chart as x/y with options horizontal/vertical  aligned top, bottom or left,right

  var recalc = function (chart) {

    var steps = [
        {
          "days": 1,
          "label": "days"
        },
        {
          "days": 7,
          "label": "weeks"
        },
        {
          "days": 30,
          "label": "months"
        },
        {
          "days": 365,
          "label": "years"
        }
      ]
      , dayMSec = 60*60*24*1000
      , daysInRange = axis.delta()/dayMSec
      , startDate = moment(axis.min())
      , stepIndex = steps.length
      , labelCount = 0
      , labels = [];

    // Time per pixel
    axis.scale(axis.delta()/chart.grid.width());

    while (labelCount < 1) {
      stepIndex--;
      labelCount = daysInRange/steps[stepIndex].days;
    }

    labelsCount = Math.round(labelCount);
    console.log(labelCount)
    for (var i = 0; i < labelCount; i++) {
      var label = moment(startDate).add(steps[stepIndex].label, i);
      axis.labels().push(label.valueOf());
    }
  }

  var drawInto = function (chart) {
    var ctx = chart.ctx
      , topOffset = chart.grid.bottom() + 25;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = axis.opacity();
    axis.each(function (label) {
      var leftOffset = chart.margin().left + (label-chart.xAxis.min())/chart.xAxis.scale();
      ctx.fillText(moment(label).format(axis.format()), leftOffset, topOffset);
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.adapt = function (chart, range) {
    axis.min(range.min).max(range.max).delta(axis.max() - axis.min());
    recalc(chart);
    return axis;
  }

  return axis;
}
