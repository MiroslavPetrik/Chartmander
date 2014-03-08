var xAxis = function () {
  var axis = this;

  this.labels = [];
  this.labelSpace = 0;
  this.dataMin = 0;
  this.dataMax = 0;

  this.config = {
    "dateFormat": "MM/YYYY",
    "TPP": 0 // Time Per Pixel
  }

  this.recalc = function (chart, type) {

    var range = this.dataMax - this.dataMin
      , steps = [
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
      , daysInRange = range/dayMSec
      , startDate = moment(this.dataMin)
      , stepIndex = steps.length
      , labelCount = 0
      ;

    this.TPP(range/chart.getGridProperties().width);
    this.labels = [];

    while (labelCount < 1) {
      stepIndex--;
      labelCount = daysInRange/steps[stepIndex].days;
    }
    labelsCount = Math.round(labelCount);

    for (var i = 0; i < labelCount; i++) {
      var label = moment(startDate).add(steps[stepIndex].label, i);
      this.labels.push(label.valueOf());
    }

    return this;
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , cfg = chart.config
      , topOffset = chart.getGridProperties().bottom + 25
      ;

    if (cfg.xAxisVisible) {
      ctx.save();
      ctx.fillStyle = cfg.fontColor;
      ctx.font = cfg.font;
      this.each(function (label) {
        var leftOffset = chart.getGridProperties().left + (label-chart.xAxis.dataMin)/chart.xAxis.TPP();
          ;
        ctx.fillText(moment(label).format(axis.dateFormat()), leftOffset, topOffset);
      });
      ctx.restore();
    }
  }

  this.each = function (action) {
    forEach(this.labels, action);
  }

  this.TPP = function (_) {
    if (!arguments.length) return this.config.TPP;
    this.config.TPP = _;
    return this;
  }

  // User methods
  this.dateFormat = function (_) {
    if (!arguments.length) return this.config.dateFormat;
    this.config.dateFormat = _;
    return this;
  }
}

