Chartmander.models.bar = function () {

  var model = new Chartmander.models.base();

  var stacked        = false // grouped otherwise
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barwidth is higher
    , datasetSpacing = 0
    , base = 0
    ;

  model.margin({ top: 0, right: 0, bottom: 0, left: 0 });

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
        if (model.updated()) {
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

  var drawBars = function (_perc_) {
    var counter = 0
      , ctx = model.layer.ctx;

    ctx.save();
    forEach(model.datasets(), function (set) {
      ctx.fillStyle = set.color();
      // ctx.lineWidth = set.style.normal.stroke;
      // ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        bar.updatePosition(_perc_)
           .updatePositionBase(_perc_)
           .drawInto(model, set);
      });
      counter++;
    })
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  model.recalc = recalc;
  model.drawModel = drawBars;

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
