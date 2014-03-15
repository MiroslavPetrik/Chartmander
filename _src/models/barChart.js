Chartmander.models.barChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var stacked        = false
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 20 // used only if default barwidth is higher
    , datasetSpacing = 0
    , groupWidth     = 0
    , groupOffset    = 0
    , xAxisVisible   = true
    , yAxisVisible   = true
    ;

  chart.type("bar").margin({ top: 30, right: 40, bottom: 30, left: 70 });

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis      = new Chartmander.components.xAxis()
    , yAxis      = new Chartmander.components.yAxis()
    , grid       = new Chartmander.components.grid()
    , crosshair  = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    chart.parse(data, Chartmander.components.bar);
    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (chart.updated()) {
      x0 = xAxis;
      y0 = yAxis;
    }
    // grid before axes
    grid.adapt(chart.width(), chart.height(), chart.margin());
    // axes use grid height to calculate their scale
    xAxis.adapt(chart, xrange);
    yAxis.adapt(chart, yrange);

    if (chart.updated()) {
      recalcBars(true);
    } else {
      recalcBars(false);
    }
    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

  var recalcBars = function () {
    var counter = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );

    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    // leftFix = (barWidth*bars.setsCount())/2;

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() + (bar.label()-xAxis.min())/xAxis.scale() + counter*barWidth;
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
    var counter = 0;
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

  var drawComponents = function (_perc_) {
    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn().drawInto(chart, _perc_);
      if (x0 && x0.getState() > 0) {
        x0.animOut();
        x0.drawInto(chart, _perc_);
      } 
    }

    if (yAxisVisible) {
      yAxis.animIn().drawInto(chart, _perc_);
      if (y0 && y0.getState() > 0) {
        y0.animOut();
        y0.drawInto(chart, _perc_);
      } 
    }

    drawBars(_perc_);
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;
  chart.crosshair = crosshair;

  chart.render = render;
  chart.drawFull = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  };

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

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  };

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  };

  return chart;
}
