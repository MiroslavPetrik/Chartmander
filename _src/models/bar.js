Chartmander.models.bar = function () {

  var chart = new Chartmander.models.base();

  var stacked        = false // grouped otherwise
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barwidth is higher
    , datasetSpacing = 0
    , base = 0
    ;

  chart.margin({ top: 0, right: 0, bottom: 0, left: 0 });

  var recalc = function (xAxis, yAxis, grid) {
    var i = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );

    // allow userBarWith only downscale so it won't break chart
    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = Math.ceil(grid.bound().left + (bar.label() - xAxis.min())/xAxis.scale() + i*barWidth);
        y = -bar.value()/yAxis.scale();
        if (chart.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
        }
        bar.moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
      });
      i++;
    });
    return chart;
  }

  var drawBars = function (_perc_) {
    var counter = 0
      , ctx = chart.layer.ctx;

    ctx.save();
    forEach(chart.datasets(), function (set) {
      ctx.fillStyle = set.color();
      // ctx.lineWidth = set.style.normal.stroke;
      // ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        bar.updatePosition(_perc_)
           .updatePositionBase(_perc_)
           .drawInto(chart, set);
      });
      counter++;
    })
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  chart.recalc = recalc;
  chart.drawModel = drawBars;

  chart.stacked = function (_) {
    if (!arguments.length) return stacked;
    stacked = _;
    return chart;
  };

  chart.barWidth = function (_) {
    if (!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return chart;
  };

  chart.datasetSpacing = function (_) {
    if (!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return chart;
  };

  chart.base = function (_) {
    if (!arguments.length) return base;
    base = _;
    return chart;
  };
  
  return chart;
}
