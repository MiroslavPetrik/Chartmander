Chartmander.components.grid = function () {

  var grid = this
    , horizontalLines = true
    , verticalLines = true
    , lineColor = "#DBDFE5"
    , lineWidth = 1
    // , evenOddContrast = true
    // , oddColor = "#EAEAEA"
    ;

  // Properties/margins
  var width = 0
    , height = 0
    , top = 0
    , right = 0
    , bottom = 0
    , left = 0
    ;

  ///////////////////////
  // Func
  ///////////////////////

  var adapt = function (w, h, margin) {
    top = margin.top;
    right = w - margin.right;
    bottom = h - margin.bottom;
    left = margin.left;
    width = w - margin.right - margin.left;
    height = h - margin.bottom - margin.top;
  }

  var drawInto = function (chart, _perc_) {
    var ctx = chart.ctx;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    if (horizontalLines) {
      ctx.save();
      ctx.globalAlpha = chart.yAxis.opacity();
      forEach(chart.yAxis.labels(), function (line) {
        ctx.beginPath();
        if (line.label() == 0) {
          ctx.save();
          ctx.strokeStyle = "#999"; // TODO Axis Width and Color
        }
        ctx.moveTo(left, line.y());
        ctx.lineTo(right, line.y());
        ctx.stroke();
        if (line.label==0) ctx.restore();
      })
      ctx.restore();
    }

    if (verticalLines) {
      for (var i = 0; i < chart.xAxis.labels().length+1; i++) {
        var xOffset = chart.grid.left() + i*(chart.grid.width() / chart.xAxis.labels().length);

        ctx.beginPath();
        ctx.moveTo(xOffset, top);
        ctx.lineTo(xOffset, bottom);
        ctx.stroke();
      };
    }
  }

  var hasInRangeX = function (point) {
     return point.x() >= left && point.x() <= right;
  }

  // grid.drawCrosshairInto = function (chart) {

  //   var crosshair = chart.crosshair;

  //   if (crosshair.visible && chart.config.hovered) {
  //     chart.ctx.save();
  //     chart.ctx.strokeStyle = crosshair.color;
  //     chart.ctx.lineWidth = crosshair.lineWidth;

  //     if (chart.grid.hasInRangeX(chart.config.mouse)) {
  //       crosshair.x = chart.getMouse("x");
  //       if (crosshair.sticky && chart.itemsInHoverRange.length > 0) {
  //         var availablePoints = [];

  //         forEach(chart.hoveredItems, function (point) {
  //           availablePoints.push(point.position.x);
  //         })
  //         crosshair.x = closestElement(crosshair.x, availablePoints);
  //       }
  //     }
  //     else
  //       return;

  //     chart.ctx.beginPath();
  //     chart.ctx.moveTo(crosshair.x, grid.config.properties.top);
  //     chart.ctx.lineTo(crosshair.x, grid.config.properties.bottom);
  //     chart.ctx.stroke();
  //     chart.ctx.restore();
  //   }
  // }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.adapt = adapt;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return grid;
  }

  grid.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return grid;
  }

  grid.bottom = function (_) {
    if (!arguments.length) return bottom;
    bottom = _;
    return grid;
  }

  grid.left = function (_) {
    if (!arguments.length) return left;
    left = _;
    return grid;
  }

  grid.lineColor = function (_) {
    if (!arguments.length) return lineColor;
    lineColor = _;
    return grid;
  }

  grid.horizontalLines = function (_) {
    if (!arguments.length) return horizontalLines;
    horizontalLines = _;
    return grid;
  }

  grid.verticalLines = function (_) {
    if (!arguments.length) return verticalLines;
    verticalLines = _;
    return grid;
  }

  return grid;
}
