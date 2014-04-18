Chartmander.models.categoryLineChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var lineWidth        = 2
    , pointRadius      = 5
    , pointHoverRadius = 20
    , areaVisible      = true
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

  var xAxis     = new Chartmander.components.categoryAxis()
    , yAxis     = new Chartmander.components.yAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    chart.parse(data, Chartmander.components.point);
    var xLabels = [];
    chart.dataset(0).each(function (element) {
      xLabels.push(element.label());
    });
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    // grid before axes
    grid.adapt(chart.width(), chart.height(), chart.margin());
    // axes use grid height to calculate their scale
    xAxis.labels(xLabels).adapt(chart);
    yAxis.adapt(chart, yrange);

    recalcPoints();
    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

  var recalcPoints = function () {
    var i=0, x, y;
    forEach(chart.datasets(), function (set) {
      i=0;
      set.each(function (point) {
        x = Math.ceil(grid.left() + i*xAxis.labelSpace());
        y = chart.base()- point.value()/yAxis.scale();
        if (chart.updated()) {
          point.savePosition();
        } else {
          point.savePosition(grid.width()/2, chart.base());
        }
        point.moveTo(x, y);
        i++;
      });
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
      if (areaVisible) {
        drawArea(set);
      }
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
    if (!arguments.length) return areaVisible;
    areaVisible = _;
    return chart;
  }

  chart.areaOpacity = function (_) {
    if (!arguments.length) return areaOpacity;
    areaOpacity = _;
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
