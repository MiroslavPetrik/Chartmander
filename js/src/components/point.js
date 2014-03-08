Element.prototype.Point = function () {

  this.drawInto = function (chart, set) {

    var ctx = chart.ctx
      , cfg = chart.config
      , style = set.style
      ;

    if (cfg.hovered) {
      var hover = this.isHovered(cfg.mouse, cfg.pointHoverRadius, cfg.mergeHover);
    }

    // Draw circle in normal state
    ctx.beginPath();
    ctx.fillStyle = style.normal.color;
    ctx.arc(this.getX(), this.getY(), cfg.pointRadius*(1-this.getState()), 0, Math.PI*2, false);
    ctx.fill();
    // Stroke circle
    if (style.normal.stroke) {
      ctx.lineWidth = style.normal.stroke*(1-this.getState());
      ctx.strokeStyle = style.normal.strokeColor;
      ctx.stroke();
    }

    if (this.getState() > 0) {
      cfg.hoverNotFinished = true;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = style.onHover.color;
      ctx.arc(this.getX(), this.getY(),10*this.getState(), 0, Math.PI*2, false);
      ctx.fill();
      if (style.onHover.stroke > 0) {
        ctx.lineWidth = style.onHover.stroke*this.getState();
        ctx.strokeStyle = style.onHover.strokeColor;
        ctx.stroke();
      }
      ctx.restore();
    }
    //
    if (cfg.hovered) {
      if (hover.was) {
        chart.itemsInHoverRange.push({
          "set": set.title,
          "index": indexOf.call(set.elements, this),
          "hoverDistance": hover.distance
        });
        return;
      }
    }
    this.animOut();
  }

  this.isHovered = function (mouse, hoverRadius, mergeHover) {
    var distance = Math.abs(mouse.x - this.getX());

    if (!mergeHover) {
      distance = Math.sqrt(Math.pow(distance, 2) + Math.pow(mouse.y - this.getY(), 2));
    }

    return {
      "was": distance < hoverRadius,
      "distance": distance
    };
  }

  return this;
};
