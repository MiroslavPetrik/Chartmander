Chartmander.models.barChart = function (canvas) {

  var bars = new Chartmander.models.chart(canvas)
    , type = "bar"
    // , margin = { top: 50, right: 80, bottom: 50, left: 80 };
    , stacked = false
    , maxBarWidth = 30
    , datasetSpacing = 0
    , barWidth = maxBarWidth
    , groupWidth = 0
    , groupOffset = 0
    ;

  var xAxis = new Chartmander.components.xAxis()
    , yAxis = new Chartmander.components.yAxis()
    , grid  = new Chartmander.components.grid()
    ;

  // chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.xAxis = new xAxis();
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  var xValues = getArrayBy(data, "label")
  // , yValues = getArrayBy(data, "value")
  , xRange = getRange(xValues)
  // , yRange = getRange(yValues)
  ;

  chart.xAxis.dataMin = xRange.min;
  chart.xAxis.dataMax = xRange.max;
  // chart.xAxis.recalc(chart);


  // Recalc
  chart.grid.calculateProperties(margin, cfg);
  chart.xAxis.recalc(chart);
  chart.yAxis.recalc(chart);


  var render =  function (data) {
    if (bars.setsCount() == 0) {
      bars.datasets(getDatasetFrom(data, type, bars.colors()));
      recalcBars(false);
      bars.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcBars(true);
      bars.completed(0);
      bars.draw(drawComponents, false)
    }
  }


  bars.recalcBars = function () {
    var counter = 0
      , streams = chart.setsCount()
      , leftFix
      , x
      , y
      ;

    barWidth = Math.floor( grid.width() /chart.elementCount() );
    leftFix = (barWidth*streams)/2

    // faux
    chart.yAxis.config.margin = leftFix + 10;

    forEach(chart.datasets, function (set) {
      set.each(function (bar) {
        x = grid.left - leftFix + (bar.label-chart.xAxis.dataMin)/chart.xAxis.TPP() + counter*barWidth;
        y = -bar.value/chart.yAxis.VPP();
        bar.savePosition(grid.width/2, 0).moveTo(x, y).saveBase(chart.getBase()).moveBase(chart.getBase());
      })
      counter++;
    });
  }

  bars.drawBars = function (_perc_) {
    var counter = {
        dataset: 0
      }
      ;

    ctx.save();
    forEach(chart.datasets, function (set) {
      ctx.fillStyle = set.style.normal.color;
      ctx.lineWidth = set.style.normal.stroke;
      ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        bar.updatePosition(_perc_);
        bar.updatePositionBase(_perc_);
        bar.drawInto(chart, set);
      })
      counter.dataset++;
    })
    ctx.restore();
  }

 var update = function (data) {
    var i = 0
      , xValues = getArrayBy(data, "label")
      , yValues = getArrayBy(data, "value")
      , xRange = getRange(xValues)
      , yRange = getRange(yValues)
      ;

    // Recalc Axes
    chart.yAxis.dataMin = yRange.min;
    chart.yAxis.dataMax = yRange.max;
    chart.yAxis.recalc(chart);

    chart.xAxis.dataMin = xRange.min;
    chart.xAxis.dataMax = xRange.max;
    chart.xAxis.recalc(chart);

    // Recalc sets
    forEach(datasets, function (set) {
      if (data[i] === undefined)
        throw new Error("Missing dataset. Dataset count on update must match.")

      set.merge(data[i], chart);

      set.each(function (bar) {
        bar.savePosition().moveTo(false, - bar.value()/yAxis.VPP()).saveBase().moveBase(chart.getBase());
      });
      i++;
    });

    chart.completed(0);
    draw();
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  bars.render = render;

  // User methods
  bars.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return bars;
  }

  chart.recalcBars();
  // Ignite
  chart.draw();
  return bars;
}
