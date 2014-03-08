Chartmander.components.slice = function (data, title) {

  /*
  ** IMPORTANT
  ** Slice uses setters/getters X, Y but it return Start and End values
  */

  var slice = Chartmander.components.element(data, title);

  slice.drawInto = function (chart, set) {
    chart.ctx.beginPath();
    // Check if this slice was hovered
    if (chart.hovered()) {
      if (sliceIsHovered(chart)) {
        chart.ctx.fillStyle = set.style.onHover.color;
        // chart.tooltip.addItem({
        //   "set": set.title,
        //   "label": slice.label,
        //   "value": slice.value,
        //   "color": set.style.normal.color
        // });
      }
    }
    chart.ctx.arc(chart.center(), chart.center(), chart.radius(), cfg.startAngle+slice.getX(), cfg.startAngle+slice.getY());
    chart.ctx.arc(chart.center(), chart.center(), chart.radius()*chart.innerRadius(), cfg.startAngle+slice.getY(), cfg.startAngle+slice.getX(), true);
    chart.ctx.fill();
  }

  var sliceIsHovered = function (chart) {
    var x = chart.getMouse("x") - chart.center()
      , y = chart.getMouse("y") - chart.center()
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter <= chart.radius() && fromCenter >= chart.radius()*chart.innerRadius()) {
      hoverAngle = Math.atan2(y, x) - chart.startAngle();
      if (hoverAngle < 0)
        hoverAngle += Math.PI*2;
      if (hoverAngle >= slice.getX() && hoverAngle <= slice.getY())
        hovered = true;
    }

    return hovered;
  }

  return slice;
};