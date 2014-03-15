Chartmander.models.lineChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var lineWidth        = 2
    , pointRadius      = 5
    , pointHoverRadius = 20
    , drawArea         = true
    , areaOpacity      = .33
    , mergeHover       = true
    , xAxisVisible     = true
    , yAxisVisible     = true
    , hoveredItems     = []
    ;

  chart.type("line").margin({ top: 30, right: 50, bottom: 50, left: 50 })

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis     = new Chartmander.components.xAxis()
    , yAxis     = new Chartmander.components.yAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    // Parse data
    if (data === undefined)
      throw new Error("No data specified for chart " + chart.id());

    // New data
    if (chart.setsCount() === 0) {
      var datasets = [], i=0;
      forEach(data, function (set) {
        datasets.push(new Chartmander.components.dataset(set, chart.color(i), Chartmander.components.point));
        i++;
      });
    } else { // Update

    }

    if (chart.setsCount() == 0) {
      var xrange = getRange(getArrayBy(data, "label"));
      var yrange = getRange(getArrayBy(data, "value"));

      chart.datasets(datasets);
      // grid before axes
      grid.adapt(chart.width(), chart.height(), chart.margin());
      // axes use grid height to calculate their scale
      xAxis.adapt(chart, xrange);
      yAxis.adapt(chart, yrange);
      recalcPoints();
      chart.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcPoints(true);
      chart.completed(0);
      chart.draw(drawComponents, false)
    }
  }

  var recalcPoints = function () {
    var x, y;
    forEach(chart.datasets(), function (set) {
      set.each(function (point) {
        x = Math.ceil(grid.left() + (point.label()-xAxis.min())/xAxis.scale());
        y = chart.base()- point.value()/yAxis.scale();
        point.savePosition(grid.width()/2, chart.base()).moveTo(x, y);
      })
    });
  }

  var updatePoints = function (set, _perc_) {
    set.each(function (point) {
      point.updatePosition(_perc_);
    });
  }

  var drawArea = function (set) {
    ctx.save();
    ctx.fillStyle = set.color();
    ctx.globalAlpha = areaOpacity;
    ctx.beginPath();
    ctx.moveTo(set.getElement(0).x(), chart.base());
    ctx.lineTo(set.getElement(0).x(), set.getElement(0).y());
    set.each(function (point) {
      ctx.lineTo(point.x(), point.y());
    });
    ctx.lineTo(set.getElement("last").x(), chart.base());
    ctx.fill();
    ctx.restore();
  }

  var drawLines = function (set) {
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = set.color();
    ctx.beginPath();
    set.each(function (point) {
      ctx.lineTo(point.x(), point.y());
    });
    ctx.stroke();
    ctx.restore();
  }

  var drawPoints = function (set) {
    ctx.save();
    ctx.strokeStyle = set.color();
    ctx.fillStyle = set.color();
    set.each(function (point) {
      point.drawInto(chart, set);
    });

    // With high-density data there can be more hovered points
    // We need to find the one with the lowest distance from mouse

    if (hoveredItems.length > 0) {
      var closestHovered = hoveredItems[0];

      for (var i = 1, len = hoveredItems.length; i < len; i++) {
        if (hoveredItems[i].distance < closestHovered.distance)
          closestHovered = hoveredItems[i];
      }
      closestHovered = set.getElement(closestHovered.index);
      closestHovered.animIn();
      chart.tooltip.addItem({
        "set"  : set.title(),
        "label": closestHovered.label(),
        "value": closestHovered.value(),
        "x"    : closestHovered.x(),
        "color": set.color()
      });
    }

    ctx.restore();
  }

  // chart.update = function (data) {
  //   var i = 0
  //     , xValues = getArrayBy(data, "label")
  //     , yValues = getArrayBy(data, "value")
  //     , xRange = getRange(xValues)
  //     , yRange = getRange(yValues)
  //     ;

  //   // Recalc Axes
  //   chart.yAxis.dataMin = yRange.min;
  //   chart.yAxis.dataMax = yRange.max;
  //   chart.yAxis.recalc(chart);

  //   chart.xAxis.dataMin = xRange.min;
  //   chart.xAxis.dataMax = xRange.max;
  //   chart.xAxis.recalc(chart);

  //   // Recalc sets
  //   forEach(line.datasets, function (set) {
  //     if (data[i] === undefined)
  //       throw new Error("Missing dataset. Dataset count on update must match.")
  //     set.merge(data[i], chart);
  //     set.each(function (point) {
  //       var x = chart.getGridProperties().left + (point.label - chart.xAxis.dataMin)/chart.xAxis.scale()
  //         , y = chart.base() - point.value/chart.yAxis.scale();

  //       point.moveTo(x, y);
  //     });
  //     i++;
  //   });

  //   chart.animationCompleted = 0;
  //   chart.draw();
  // }

  var drawComponents = function (_perc_) {

    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn()
           .drawInto(chart, _perc_);
    }

    if (yAxisVisible) {
      yAxis.animIn()
           .drawInto(chart, _perc_);
    }

    if (chart.hovered() && crosshair.visible() && grid.hovered(chart.mouse()) ) {
      crosshair.drawInto(chart);
    }

    forEach(chart.datasets(), function (set) {
      hoveredItems = [];
      updatePoints(set, _perc_);
      drawArea(set);
      drawLines(set);
      drawPoints(set);
    });
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.xAxis     = xAxis;
  chart.yAxis     = yAxis;
  chart.grid      = grid;
  chart.crosshair = crosshair;
  
  chart.render    = render;
  chart.drawFull  = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  chart.areaVisible = function (_) {
    if (!arguments.length) return drawArea;
    drawArea = _;
    return chart;
  }

  chart.lineWidth = function (_) {
    if (!arguments.length) return lineWidth;
    lineWidth = _;
    return chart;
  }

  chart.pointRadius = function (_) {
    if (!arguments.length) return pointRadius;
    pointRadius = _;
    return chart;
  }

  chart.pointHoverRadius = function (_) {
    if (!arguments.length) return pointHoverRadius;
    pointHoverRadius = _;
    return chart;
  }

  chart.mergeHover = function (_) {
    if (!arguments.length) return mergeHover;
    mergeHover = _;
    return chart;    
  }

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  }

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  }

  chart.hoveredItems = function (_) {
    if (!arguments.length) return hoveredItems;
    hoveredItems = _;
    return chart;
  };

  chart.addHoveredItem = function (_) {
    hoveredItems.push(_);
    return chart;
  };

  return chart;
};
