Chartmander.models.line = function () {

  var chart = new Chartmander.models.base();

  var lineWidth        = 2
    , pointRadius      = 5
    , pointHoverRadius = 20
    , pointHoverColor  = "orange"
    , areaVisible      = true
    , areaOpacity      = .29
    , mergeHover       = true
    , hoveredItems     = []
    ;

  chart.margin({ top: 30, right: 50, bottom: 50, left: 50 });

  var recalc = function (xAxis, yAxis, grid) {
    var x, y;
    forEach(chart.datasets(), function (set) {
      set.each(function (point) {
        x = Math.ceil(grid.left() + (point.label() - xAxis.min())/xAxis.scale());
        y = chart.base() - point.value()/yAxis.scale();
        if (chart.updated()) {
          point.savePosition();
        } else {
          point.savePosition(chart.margin().left + grid.width()/2, chart.base());
        }
        point.moveTo(x, y);
      });
    });
  }

  var updatePoints = function (set, _perc_) {
    set.each(function (point) {
      point.updatePosition(_perc_);
    });
  }

  var drawArea = function (set) {
    var ctx = chart.layer.ctx;
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
    var ctx = chart.layer.ctx;
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
    var ctx = chart.layer.ctx;
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

  var drawModel = function (_perc_) {
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

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  chart.recalc = recalc;
  chart.drawModel = drawModel;

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

  chart.pointHoverColor = function (_) {
    if (!arguments.length) return pointHoverColor;
    pointHoverColor = _;
    return chart;
  }

  chart.mergeHover = function (_) {
    if (!arguments.length) return mergeHover;
    mergeHover = _;
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
