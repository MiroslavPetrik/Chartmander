Chartmander.components.grid = function () {

  var grid = this;

  var horizontalLines = false
    , verticalLines = true
    , lineColor = "#ddd"
    , lineWidth = 1
    , width  = null
    , height = null
    , margin = { top: 0, right: 0, bottom: 50, left: 50 } // default margin for axes
    , bound = { top: 0, right: 0, bottom: 0, left: 0 } // pixels relative to layer
    ;

  ///////////////////////
  // Func
  ///////////////////////

  var adapt = function (chart) {
    width = chart.width() - margin.left - margin.right;
    height = chart.height() - margin.top - margin.bottom;
    grid.bound({
      top:    chart.margin().top  + margin.top,
      right:  chart.margin().left + margin.left + width  - margin.right,
      bottom: chart.margin().top  + margin.top  + height,
      left:   chart.margin().left + margin.left
    });
  }

  var drawInto = function (chart, _perc_) {
    var ctx = chart.layer.ctx;

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
      for (var i = 0; i < chart.xAxis.labels().length+1; i++) {
        var xOffset = Math.ceil( chart.margin().left + margin.left + i*(width / chart.xAxis.labels().length) );
        ctx.beginPath();
        ctx.moveTo(xOffset, bound.top);
        ctx.lineTo(xOffset, bound.bottom);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  var hovered = function (mouse) {
     return mouse.x >= bound.left && mouse.x <= bound.right && mouse.y >= bound.top && mouse.y <= bound.bottom;
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

  grid.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return grid;
  };

  grid.bound = function (_) {
    if (!arguments.length) return bound;
    bound.top    = typeof _.top    != 'undefined' ? _.top    : bound.top;
    bound.right  = typeof _.right  != 'undefined' ? _.right  : bound.right;
    bound.bottom = typeof _.bottom != 'undefined' ? _.bottom : bound.bottom;
    bound.left   = typeof _.left   != 'undefined' ? _.left   : bound.left;
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
