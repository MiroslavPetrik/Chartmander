Chartmander.models.lines = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var lineWidth        = 2
    , showPoint        = true
    , pointRadius      = 5
    , pointHoverRadius = 20
    , pointHoverColor  = "orange"
    , areaVisible      = true
    , areaOpacity      = .29
    , mergeHover       = true
    , hoveredItems     = []
    , base             = 0
    , startPosition    = "direct" // or center
    ;

  chart.margin({top: 10, right: 10, bottom: 50, left: 50});

  var recalc = function (xAxis, yAxis, grid) {
    var x, y;
    forEach(model.datasets(), function (set) {
      set.each(function (point) {
        // time axis specific
        x = Math.ceil(grid.bound().left + (point.label() - xAxis.min())/xAxis.scale());
        y = model.base() - point.value()/yAxis.scale();
        if (model.updated()) {
          point.savePosition();
        } else {
          if (startPosition == "center")
            point.savePosition(model.margin().left + grid.width()/2, model.base());
          if (startPosition == "direct")
            point.savePosition(x, model.base());
        }
        point.moveTo(x, y);
      });
    });
    return model;
  }

  var updatePoints = function (set, _perc_) {
    set.each(function (point) {
      point.updatePosition(_perc_);
    });
  }

  var drawArea = function (ctx, set) {
    ctx.save();
    ctx.fillStyle = set.color();
    ctx.globalAlpha = areaOpacity;
    ctx.beginPath();
    ctx.moveTo(set.getElement(0).x(), model.base());
    ctx.lineTo(set.getElement(0).x(), set.getElement(0).y());
    set.each(function (point) {
      ctx.lineTo(point.x(), point.y());
    });
    ctx.lineTo(set.getElement("last").x(), model.base());
    ctx.fill();
    ctx.restore();
  }

  var drawLines = function (ctx, set) {
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

  var drawPoints = function (ctx, set) {
    ctx.save();
    ctx.strokeStyle = set.color();
    ctx.fillStyle = set.color();
    set.each(function (point) {
      point.drawInto(ctx, chart, model, set);
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

  var drawInto = function (ctx, _perc_) {
    forEach(model.datasets(), function (set) {
      hoveredItems = [];
      updatePoints(set, _perc_);
      if (areaVisible) {
        drawArea(ctx, set);
      }
      drawLines(ctx, set);
      if (showPoint)
        drawPoints(ctx, set);
    });
  }

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  model.recalc = recalc;
  model.drawInto = drawInto;

  model.areaVisible = function (_) {
    if (!arguments.length) return areaVisible;
    areaVisible = _;
    return model;
  }

  model.areaOpacity = function (_) {
    if (!arguments.length) return areaOpacity;
    areaOpacity = _;
    return model;
  }

  model.lineWidth = function (_) {
    if (!arguments.length) return lineWidth;
    lineWidth = _;
    return model;
  }

  model.pointRadius = function (_) {
    if (!arguments.length) return pointRadius;
    pointRadius = _;
    return model;
  }

  model.pointHoverRadius = function (_) {
    if (!arguments.length) return pointHoverRadius;
    pointHoverRadius = _;
    return model;
  }

  model.pointHoverColor = function (_) {
    if (!arguments.length) return pointHoverColor;
    pointHoverColor = _;
    return model;
  }

  model.mergeHover = function (_) {
    if (!arguments.length) return mergeHover;
    mergeHover = _;
    return model;    
  }

  model.hoveredItems = function (_) {
    if (!arguments.length) return hoveredItems;
    hoveredItems = _;
    return model;
  };

  model.addHoveredItem = function (_) {
    hoveredItems.push(_);
    return model;
  };

  model.base = function (_) {
    if (!arguments.length) return base;
    base = _;
    return model;
  };

  model.showPoint = function (_) {
    if (!arguments.length) return showPoint;
    showPoint = _;
    return model;
  };

  model.startPosition = function (_) {
    if (!arguments.length) return startPosition;
    startPosition = _;
    return model;
  };

  return model;
};
