Chartmander.prototype.CategoryBar = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Bar Chart Default
  cfg.type = "bar";
  cfg.margin = { top: 70, right: 50, bottom: 50, left: 70 };
  cfg.stacked = false;
  cfg.maxBarWidth = 30;
  cfg.datasetSpacing = 0;
  cfg.displayValue = true;
  cfg.legend = true;

  // Axis defaults
  cfg.xAxisVisible = true;

  // Chart state variables
  cfg.barWidth = cfg.maxBarWidth;
  cfg.groupWidth = 0;
  cfg.groupOffset = 0;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type, cfg.colors);
  chart.xAxis = new xAxisCategory(getArrayBy(data, "label", true));
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalc
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.xAxis.recalc(chart);
  chart.yAxis.recalc(chart);

  this.recalcBars = function () {
    var counter = {
        dataset: 0,
        element: 0
      }
      , streams = chart.getSetsCount()
      , grid = chart.getGridProperties()
      , x
      , y
      ;

    if( (streams * cfg.barWidth + (streams-1)*cfg.datasetSpacing) > chart.xAxis.labelSpace )
      cfg.barWidth = Math.floor( (chart.xAxis.labelSpace - ((streams-1)*cfg.datasetSpacing)) / streams );

    cfg.groupWidth = cfg.barWidth*streams + cfg.datasetSpacing*(streams-1);
    cfg.groupOffset = (chart.xAxis.labelSpace - cfg.groupWidth)/2;

    forEach(chart.datasets, function (set) {
      counter.element = 0;
      set.each(function (bar) {
        x = grid.left + cfg.groupOffset + counter.dataset*cfg.barWidth + counter.element*chart.xAxis.labelSpace + counter.dataset*cfg.datasetSpacing;
        y = -bar.value/chart.yAxis.VPP();
        bar.savePosition(grid.width/2, 0).moveTo(x, y).saveBase(chart.getBase()).moveBase(chart.getBase());
        counter.element++;
      })
      counter.dataset++;
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
      , yValues = getArrayBy(data, "value")
      , yRange = getRange(yValues)
      ;

    // Recalc Axes
    chart.yAxis.dataMin = yRange.min;
    chart.yAxis.dataMax = yRange.max;
    chart.yAxis.recalc(chart);

    chart.xAxis = new xAxisCategory(getArrayBy(data, "label", true));
    chart.xAxis.recalc(chart);

    // Recalc sets
    forEach(this.datasets, function (set) {
      if (data[i] === undefined)
        throw new Error("Missing dataset. Dataset count on update must match.")

      set.merge(data[i], chart);

      set.each(function (bar) {
        bar.savePosition().moveTo(false, - bar.value/chart.yAxis.VPP()).saveBase().moveBase(chart.getBase());
      });
      i++;
    });

    chart.animationCompleted = 0;
    chart.draw();
  }

  this.stacked = function (_) {
    if (!arguments.length) return this.stacked;
    this.stacked = _;
    return this;
  }

  // User methods
  this.datasetSpacing = function (_) {
    if (!arguments.length) return this.config.datasetSpacing;
    this.config.datasetSpacing = _;
    return this;
  }

  chart.recalcBars();
  // Ignite
  chart.draw();
  return chart;
}
