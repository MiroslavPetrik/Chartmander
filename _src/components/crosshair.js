Chartmander.components.crosshair = function () {

  var crosshair = this;

  var x = null
    , y = null
    , visible = true
    , sticky = true
    , color = "#555"
    , lineWidth = 1
    ;

  var drawInto = function (chart) {
    var ctx = chart.ctx;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    x = chart.mouse().x;

    if (sticky && chart.tooltip.hasItems()) {
      x = chart.tooltip.items()[0].x
    }

    chart.ctx.beginPath();
    chart.ctx.moveTo(x, chart.grid.top());
    chart.ctx.lineTo(x, chart.grid.bottom());
    chart.ctx.stroke();
    chart.ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  crosshair.drawInto = drawInto;


  crosshair.x = function (_) {
    if(!arguments.length) return x;
    x = _;
    return crosshair;
  };

  crosshair.y = function (_) {
    if(!arguments.length) return y;
    y = _;
    return crosshair;
  };

  crosshair.visible = function (_) {
    if(!arguments.length) return visible;
    visible = _;
    return crosshair;
  };

  crosshair.sticky = function (_) {
    if(!arguments.length) return sticky;
    sticky = _;
    return crosshair;
  };

  crosshair.color = function (_) {
    if(!arguments.length) return color;
    color = _;
    return crosshair;
  };

  return crosshair;
}
