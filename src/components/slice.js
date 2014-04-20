Chartmander.components.slice = function (data, title) {

  // Note
  // x & y methods refer to start and end angle values

  var slice = new Chartmander.components.element();

  slice.set(title).label(data.label).value(data.value);

  var sliceIsHovered = function (mouse, center, model) {
    var x = mouse.x - center.x
      , y = mouse.y - center.y
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter >= model.radius()*model.innerRadius() && fromCenter <= model.radius()) {
      hoverAngle = Math.atan2(y, x) - model.startAngle();
      if (hoverAngle < 0) {
        hoverAngle += Math.PI*2;
      }
      if (hoverAngle >= slice.x() && hoverAngle <= slice.y()) {
        hovered = true;
      }
    }
    return hovered;
  }

  var drawInto = function (ctx, chart, model, set) {
    ctx.beginPath();
    // Check if this slice was hovered
    if (chart.hovered()) {
      if ( sliceIsHovered(chart.mouse(), model.center(), model) ) {
        ctx.fillStyle = set.hoverColor();
        chart.tooltip.addItem({
          "set"  : set.title(),
          "label": slice.label(),
          "value": slice.value(),
          "color": set.color()
        });
      }
    }
    ctx.arc(model.center().x, model.center().y, model.radius(), model.startAngle()+slice.x(), model.startAngle()+slice.y(), model.clockWise());
    ctx.arc(model.center().x, model.center().y, model.radius()*model.innerRadius(), model.startAngle()+slice.y(), model.startAngle()+slice.x(), !model.clockWise());
    ctx.fill();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  slice.drawInto = drawInto;

  return slice;
};
