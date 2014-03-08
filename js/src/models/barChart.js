Chartmander.prototype.Bar = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Bar Chart Default
  cfg.type = "bar";
  cfg.margin = { top: 50, right: 80, bottom: 50, left: 80 };
  cfg.stacked = false;
  cfg.maxBarWidth = 30;
  cfg.datasetSpacing = 0;

  // Axis defaults
  cfg.xAxisVisible = true;
  cfg.yAxisVisible = true;


  // Chart state variables
  cfg.barWidth = cfg.maxBarWidth;
  cfg.groupWidth = 0;
  cfg.groupOffset = 0;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type, cfg.colors);
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
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.xAxis.recalc(chart);
  chart.yAxis.recalc(chart);

  this.render = function () {
    
  }

  this.recalcBars = function () {
    var counter = 0
      , grid = chart.getGridProperties()
      , streams = chart.datasets.length
      , leftFix
      , x
      , y
      ;

    cfg.barWidth = Math.floor( chart.getGridProperties().width/chart.getElementCount() );
    leftFix = (cfg.barWidth*streams)/2

    // faux
    chart.yAxis.config.margin = leftFix + 10;

    forEach(chart.datasets, function (set) {
      set.each(function (bar) {
        x = grid.left - leftFix + (bar.label-chart.xAxis.dataMin)/chart.xAxis.TPP() + counter*cfg.barWidth;
        y = -bar.value/chart.yAxis.VPP();
        bar.savePosition(grid.width/2, 0).moveTo(x, y).saveBase(chart.getBase()).moveBase(chart.getBase());
      })
      counter++;
    });
  }

  this.drawBars = function (_perc_) {
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

  this.update = function (data) {
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
    forEach(this.datasets, function (set) {
      if (data[i] === undefined)
        throw new Error("Missing dataset. Dataset count on update must match.")

      set.merge(data[i], chart);

      set.each(function (element) {
        element.savePosition().moveTo(false, - element.value/chart.yAxis.VPP()).saveBase().moveBase(chart.getBase());
      });
      i++;
    });

    chart.animationCompleted = 0;
    chart.draw();
  }

  // User methods
  this.datasetSpacing = function (_) {
    this.config.datasetSpacing = _;
    return chart;
  }

  chart.recalcBars();
  // Ignite
  chart.draw();
  return chart;
}
