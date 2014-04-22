Chartmander.components.grid = function (chart, xAxis,  yAxis) {

  var grid = this;

  var horizontalLines = true
    , verticalLines = true
    , lineColor = "#ddd"
    , lineWidth = 1
    ;

  ///////////////////////
  // Func
  ///////////////////////

  var drawInto = function (ctx, _perc_) {
    var bound = grid.bound();
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = _perc_;
    if (horizontalLines) {
      forEach(chart.yAxis.labels(), function (line) {
        var y = Math.ceil(line.y());
        ctx.beginPath();
        ctx.moveTo(bound.left, y);
        ctx.lineTo(bound.right, y);
        ctx.stroke();
      });
    }

    if (verticalLines) {
      for (var i = 0; i < xAxis.labels().length+1; i++) {
        var xOffset = Math.ceil( chart.margin().left + i*(grid.width() / xAxis.labels().length) );
        ctx.beginPath();
        ctx.moveTo(xOffset, bound.top);
        ctx.lineTo(xOffset, bound.bottom);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  var hovered = function (mouse) {
    var bound = grid.bound();
    return mouse.x >= bound.left && mouse.x <= bound.right && mouse.y >= bound.top && mouse.y <= bound.bottom;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.hovered = hovered;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    var bound = grid.bound();
    return bound.right - bound.left;
  };

  grid.height = function (_) {
    var bound = grid.bound();
    return bound.bottom - bound.top;
  };

  grid.bound = function (_) {
    var margin = chart.margin();
    return {
      top: margin.top,
      right: chart.width() - margin.right,
      bottom: chart.height() - margin.bottom,
      left: margin.left
    }
  };

  grid.lineColor = function (_) {
    if (!arguments.length) return lineColor;
    lineColor = _;
    return grid;
  };

  grid.horizontalLines = function (_) {
    if (!arguments.length) return horizontalLines;
    horizontalLines = _;
    return grid;
  };

  grid.verticalLines = function (_) {
    if (!arguments.length) return verticalLines;
    verticalLines = _;
    return grid;
  };

  return grid;
}
