Chartmander.components.crosshair = function (chart) {

  var crosshair = this;

  var x = null
    , y = null
    , visible = true
    , sticky = true
    , color = "#555"
    , lineWidth = 1
    ;

  var drawInto = function (ctx) {
    var bound = chart.grid.bound();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    x = chart.mouse().x;

    // if (sticky && chart.tooltip.hasItems()) {
    //   x = chart.tooltip.items()[0].x
    // }

    ctx.beginPath();
    ctx.moveTo(x, bound.top);
    ctx.lineTo(x, bound.bottom);
    ctx.stroke();
    ctx.restore();
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
