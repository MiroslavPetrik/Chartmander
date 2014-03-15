Chartmander.models.barChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var stacked        = false
    , maxBarWidth    = 30
    , datasetSpacing = 0
    , barWidth       = maxBarWidth
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

  var render =  function (data) {
    // Parse data
    if (data === undefined) {
      throw new Error("No data specified for chart " + chart.id());
    }

    // First render, create new datasets
    if (chart.setsCount() === 0) {
      var datasets = [], i=0;
      forEach(data, function (set) {
        datasets.push(new Chartmander.components.dataset(set, chart.color(i), Chartmander.components.bar));
        i++;
      });
    } else { // Update
      var i=0;
      forEach(chart.datasets(), function (set) {
        if (data[i] === undefined) {
          throw new Error("Missing dataset. Dataset count on update must match.");
        }
        set.merge(data[i], chart);
        i++;
      });
    }

    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(getArrayBy(data, "value"));

    chart.datasets(datasets);
    // grid before axes
    grid.adapt(chart.width(), chart.height(), chart.margin());
    // axes use grid height to calculate their scale
    xAxis.adapt(chart, xrange);
    yAxis.adapt(chart, yrange);
    recalcBars();
    // update(data);
    recalcBars(true);
    chart.completed(0);
    chart.draw(drawComponents, false)
  }

  var recalcBars = function () {
    var counter = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );
    // leftFix = (barWidth*bars.setsCount())/2;

    // faux
    // yAxis.margin(leftFix + 10);

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() + (bar.label()-xAxis.min())/xAxis.scale() + counter*barWidth;
        y = -bar.value()/yAxis.scale();
        bar.savePosition(grid.width()/2, 0).moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
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

 // var update = function (data) {
 //    var i = 0
 //      , xValues = getArrayBy(data, "label")
 //      , yValues = getArrayBy(data, "value")
 //      , xRange = getRange(xValues)
 //      , yRange = getRange(yValues)
 //      ;

 //    // Recalc Axeslo

 //    chart.yAxis.min(yRange.min).max(yRange.max);
 //    // chart.yAxis.recalc(chart);
 //    chart.xAxis.min(xRange.min).max(xRange.max);
 //    // chart.xAxis.recalc(chart);

 //    // Recalc sets
 //    forEach(bars.datasets(), function (set) {
 //      if (data[i] === undefined)
 //        throw new Error("Missing dataset. Dataset count on update must match.")

 //      set.merge(data[i], chart);

 //      set.each(function (bar) {
 //        bar.savePosition().moveTo(false, - bar.value()/yAxis.scale()).saveBase().moveBase(chart.base());
 //      });
 //      i++;
 //    });

 //    chart.completed(0);
 //    draw();
 //  }

  var drawComponents = function (_perc_) {

    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn();
      xAxis.drawInto(chart, _perc_);
    }

    if (yAxisVisible) {
      yAxis.animIn();
      yAxis.drawInto(chart, _perc_);
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
    maxBarWidth = _; // User defined
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
