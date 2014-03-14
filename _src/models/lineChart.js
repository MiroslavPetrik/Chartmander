Chartmander.models.lineChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var type = "line"
    , lineWidth = 2
    , pointRadius = 5
    , pointHoverRadius = 20
    , drawArea = true
    , areaOpacity = .5
    , mergeHover = true
    , xAxisVisible = true
    , yAxisVisible = true
    ;

  chart.margin({ top: 30, right: 50, bottom: 50, left: 50 });

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

  var render =  function (data) {
    if (chart.setsCount() == 0) {
      var xrange = getRange(getArrayBy(data, "label"));
      var yrange = getRange(getArrayBy(data, "value"));

      chart.datasets(getDatasetFrom(data, type, chart.colors()));
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
    var hoveredInThisSet = []
      , closestHovered
      ;

    ctx.save();

    ctx.strokeStyle = set.color();
    ctx.fillStyle = set.color();

    set.each(function (point) {
      point.drawInto(chart, set);
    });

    // Get items only from current set
    forEach(chart.itemsInHoverRange(), function (item) {
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
        set.getElement(closestHovered.index).animIn();
        chart.tooltip.addItem({
            "set":   set.title,
            "label": set.getElement(closestHovered.index).label(),
            "value": set.getElement(closestHovered.index).value(),
            "color": set.color()
          })
        if (set.elements[closestHovered.index].isAnimated()){
          hoverNotFinished = true;
        }
      } else {
        set.elements[hoveredInThisSet[i].index].animOut();
      }
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
      xAxis.animIn();
      xAxis.drawInto(chart, _perc_);
    }

    if (yAxisVisible) {
      yAxis.animIn();
      yAxis.drawInto(chart, _perc_);
    }

    if (chart.hovered() && crosshair.visible() && grid.hovered(chart.mouse()) ) {
      crosshair.drawInto(chart);
    }

    forEach(chart.datasets(), function (set) {
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

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;

  chart.render = render;
  chart.drawFull = drawFull;

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

  return chart;
};
