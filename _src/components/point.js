Chartmander.components.point = function (data, title) {

  var point = new Chartmander.components.element();
      point.set(title).label(data.label).value(data.value);

  var drawInto = function (chart, set) {
    var ctx = chart.ctx;
    if (chart.hovered()) {
      var hover = isHovered(chart.mouse(), chart.pointHoverRadius(), chart.mergeHover());
    }
    // Draw circle in normal state
    ctx.beginPath();
    ctx.arc(point.x(), point.y(), chart.pointRadius()*(1-point.getState()), 0, Math.PI*2, false);
    ctx.fill();
    // Stroke circle
    // if (style.normal.stroke) {
    //   ctx.lineWidth = style.normal.stroke*(1-point.getState());
    //   ctx.strokeStyle = style.normal.strokeColor;
    //   ctx.stroke();
    // }

    if (point.getState() > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = set.hoverColor();
      ctx.arc(point.x(), point.y(),10*point.getState(), 0, Math.PI*2, false);
      ctx.fill();
      // if (style.onHover.stroke > 0) {
      //   ctx.lineWidth = style.onHover.stroke*point.getState();
      //   ctx.strokeStyle = style.onHover.strokeColor;
      //   ctx.stroke();
      // }
      ctx.restore();
    }

    if (chart.hovered() && hover.was) {
      chart.addHoveredItem({
        "index"   : indexOf.call(set.els(), point),
        "distance": hover.distance
      });
      return;
    }
    point.animOut();
  }

  var isHovered = function (mouse, hoverRadius, mergeHover) {
    var distance = Math.abs(mouse.x - point.x());

    if (!mergeHover) {
      distance = Math.sqrt(Math.pow(distance, 2) + Math.pow(mouse.y - point.y(), 2));
    }

    return {
      "was": distance < hoverRadius,
      "distance": distance
    };
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  point.drawInto = drawInto;

  return point;
};
