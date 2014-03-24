Chartmander.models.bar = function () {

  var chart = new Chartmander.models.base();

  var stacked        = false
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barwidth is higher
    , datasetSpacing = 0
    ;

  chart.margin({ top: 30, right: 40, bottom: 30, left: 70 });

  var recalc = function (xAxis, yAxis, grid) {
    var counter = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );

    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    // leftFix = (barWidth*bars.setsCount())/2;

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() + (bar.label() - xAxis.min())/xAxis.scale() + counter*barWidth;
        y = -bar.value()/yAxis.scale();
        if (chart.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
          // bar.savePosition(grid.width()/2, 0);
        }
        bar.moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
      });
      counter++;
    });
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

  chart.barWidth = function (_) {
    if(!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return chart;
  };

  chart.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return chart;
  };

  return chart;
}
