Chartmander.components.slice = function (data, title) {

  /*
  ** IMPORTANT
  ** Slice uses X, Y methods but they refer to Start and End values
  */

  var slice = new Chartmander.components.element();

  slice.set(title).label(data.label).value(data.value);

  var sliceIsHovered = function (pie) {
    var x = pie.layer.mouse().x - pie.center().x
      , y = pie.layer.mouse().y - pie.center().y
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter <= pie.radius() && fromCenter >= pie.radius()*pie.innerRadius()) {
      hoverAngle = Math.atan2(y, x) - pie.startAngle();
      if (hoverAngle < 0) {
        hoverAngle += Math.PI*2;
      }
      if (hoverAngle >= slice.x() && hoverAngle <= slice.y()) {
        hovered = true;
      }
    }
    return hovered;
  }

  var drawInto = function (ctx, pie, set) {
    ctx.beginPath();
    // Check if this slice was hovered
    if (pie.layer.hovered()) {
      if (sliceIsHovered(pie)) {
        ctx.fillStyle = set.hoverColor();
        // pie.tooltip.addItem({
        //   "set": set.title,
        //   "label": slice.label,
        //   "value": slice.value,
        //   "color": set.style.normal.color
        // });
      }
    }
    ctx.arc(pie.center().x, pie.center().y, pie.radius(), pie.startAngle()+slice.x(), pie.startAngle()+slice.y());
    ctx.arc(pie.center().x, pie.center().y, pie.radius()*pie.innerRadius(), pie.startAngle()+slice.y(), pie.startAngle()+slice.x(), true);
    ctx.fill();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  slice.drawInto = drawInto;

  return slice;
};
