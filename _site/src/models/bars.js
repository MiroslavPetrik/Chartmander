Chartmander.models.bars = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var stacked        = false // grouped otherwise
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barWidth is higher
    , datasetSpacing = 0
    , base = 0
    ;

  chart.margin({top: 10, right: 10, bottom: 50, left: 50});

  var recalc = function (xAxis, yAxis, grid) {
    var i = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/model.elementCount() );

    // allow userBarWith only downscale so it won't break model
    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    forEach(model.datasets(), function (set) {
      set.each(function (bar) {
        x = Math.ceil(grid.bound().left + (bar.label() - xAxis.min())/xAxis.scale() + i*barWidth);
        y = -bar.value()/yAxis.scale();
        if (chart.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
        }
        bar.moveTo(x, y).saveBase(model.base()).moveBase(model.base());
      });
      i++;
    });
    return model;
  }

  var drawBars = function (ctx, _perc_) {
    ctx.save();
    forEach(model.datasets(), function (set) {
      ctx.fillStyle = set.color();
      set.each(function (bar) {
        bar
          .updatePosition(_perc_)
          .updatePositionBase(_perc_)
          .drawInto(ctx, chart, model, set);
      });
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  model.recalc = recalc;
  model.drawInto = drawBars;

  model.stacked = function (_) {
    if (!arguments.length) return stacked;
    stacked = _;
    return model;
  };

  model.barWidth = function (_) {
    if (!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return model;
  };

  model.datasetSpacing = function (_) {
    if (!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return model;
  };

  model.base = function (_) {
    if (!arguments.length) return base;
    base = _;
    return model;
  };
  
  return model;
}
