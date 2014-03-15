Chartmander.components.grid = function () {

  var grid = this;

  var horizontalLines = true
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

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = _perc_;

    if (horizontalLines) {
      forEach(chart.yAxis.labels(), function (line) {
        var y = Math.ceil(line.y());
        ctx.beginPath();
        if (line.label() == 0) {
          ctx.save();
          ctx.strokeStyle = "#999"; // TODO Axis Width and Color
        }
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
        if (line.label==0) ctx.restore();
      })
    }

    if (verticalLines) {
      for (var i = 0; i < chart.xAxis.labels().length+1; i++) {
        var xOffset = Math.ceil( chart.grid.left() + i*(chart.grid.width() / chart.xAxis.labels().length) );
        ctx.beginPath();
        ctx.moveTo(xOffset, top);
        ctx.lineTo(xOffset, bottom);
        ctx.stroke();
      };
    }
    ctx.restore();
  }

  var hovered = function (mouse) {
     return mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.adapt = adapt;
  grid.hovered = hovered;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return grid;
  };

  grid.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return grid;
  };

  grid.bottom = function (_) {
    if (!arguments.length) return bottom;
    bottom = _;
    return grid;
  };

  grid.left = function (_) {
    if (!arguments.length) return left;
    left = _;
    return grid;
  };

  grid.top = function (_) {
    if (!arguments.length) return top;
    top = _;
    return grid;
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
