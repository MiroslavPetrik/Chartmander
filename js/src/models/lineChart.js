Chartmander.prototype.Line = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Line Chart Defaults
  cfg.type = "line";
  cfg.margin = { top: 30, right: 50, bottom: 50, left: 50 };
  cfg.drawArea = true;
  cfg.pointRadius = 5;
  cfg.lineWidth = 2;
  cfg.areaOpacity = .95
  cfg.pointHoverRadius = 20;
  cfg.mergeHover = true;

  // Axis defaults
  cfg.xAxisVisible = true;
  cfg.yAxisVisible = true;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type, cfg.colors);
  // chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.xAxis = new xAxis();
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();
  chart.itemsInHoverRange = [];

  var xValues = getArrayBy(data, "label")
  // , yValues = getArrayBy(data, "value")
  , xRange = getRange(xValues)
  // , yRange = getRange(yValues)
  ;

  chart.xAxis.dataMin = xRange.min;
  chart.xAxis.dataMax = xRange.max;

  // Recalculation based on provided data
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.yAxis.recalc(chart);
  chart.xAxis.recalc(chart);

  this.recalcPoints = function () {
    var grid = chart.getGridProperties()
      , x
      , y
      ;

    forEach(chart.datasets, function (set) {
      set.each(function (point) {
        x = Math.ceil(grid.left + (point.label-chart.xAxis.dataMin)/chart.xAxis.TPP());
        y = chart.getBase()- point.value/chart.yAxis.VPP();
        point.savePosition(grid.width/2, chart.getBase()).moveTo(x, y);
      })
    });
  }

  this.updatePoints = function (_perc_) {
    forEach(chart.datasets, function (set) {
      set.each(function (point) {
        point.updatePosition(_perc_);
      })
    });
  }

  this.drawArea = function () {
    ctx.save();

    forEach(chart.datasets, function (set) {
      ctx.fillStyle = set.style.color;
      ctx.globalAlpha = cfg.areaOpacity;

      ctx.beginPath();
      ctx.moveTo(set.element(0).getX(), chart.getBase());
      ctx.lineTo(set.element(0).getX(), set.element(0).getY());
      set.each(function (point) {
        ctx.lineTo(point.getX(), point.getY());
      });
      ctx.lineTo(set.element("last").getX(), chart.getBase());
      ctx.fill();
    });

    ctx.restore();
  }

  this.drawLines = function () {
    ctx.save();
    ctx.lineWidth = chart.lineWidth();
    forEach(chart.datasets, function (set) {
      ctx.strokeStyle = set.style.color;
      ctx.beginPath();
      set.each(function (point) {
        ctx.lineTo(point.getX(), point.getY());
      });
      ctx.stroke();
    });

    ctx.restore();
  }

  this.drawPoints = function () {
    ctx.save();
    forEach(chart.datasets, function (set) {
      var hoveredInThisSet = []
        , closestHovered
        ;

      ctx.strokeStyle = set.style.color;
      ctx.fillStyle = set.style.color;

      set.each(function (point) {
        point.drawInto(chart, set);
      });

      // Get items only from current set
      forEach(chart.itemsInHoverRange, function (item) {
        if (item.set == set.title) {
          hoveredInThisSet.push(item);
        }
      });

      // Find closest hovered
      for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
        if (i == 0) {
          closestHovered = hoveredInThisSet[i];
          continue;
        }
        if (hoveredInThisSet[i].hoverDistance < closestHovered.hoverDistance) {
          closestHovered = hoveredInThisSet[i];
        }
      }

      // Control Hovered
      for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
        if (hoveredInThisSet[i] === closestHovered) {
          set.elements[closestHovered.index].animIn();
          chart.tooltip.addItem({
              set: set.title,
              label: set.elements[closestHovered.index].label,
              value: set.elements[closestHovered.index].value,
              color: set.style.normal.color
            })
          if (set.elements[closestHovered.index].isAnimated()){
            cfg.hoverNotFinished = true;
          }
        } else {
          set.elements[hoveredInThisSet[i].index].animOut();
        }
      }
    });
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
      set.each(function (point) {
        var x = chart.getGridProperties().left + (point.label - chart.xAxis.dataMin)/chart.xAxis.TPP()
          , y = chart.getBase() - point.value/chart.yAxis.VPP();

        point.moveTo(x, y);
      });
      i++;
    });

    chart.animationCompleted = 0;
    chart.draw();
  }

  // User methods
  this.areaVisible = function (_) {
    if (!arguments.length) return this.config.drawArea;
    this.config.drawArea = _;
    return this;
  }

  this.lineWidth = function (_) {
    if (!arguments.length) return this.config.lineWidth;
    this.config.lineWidth = _;
    return this;
  }

  chart.recalcPoints();
  // Ignite
  chart.draw();
  return chart;
};
