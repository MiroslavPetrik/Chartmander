Element.prototype.Bar = function () {

  this.state.from.base = 0;
  this.state.to.base = 0;
  this.state.now.base = 0;

  this.drawInto = function (chart, set) {
    var ctx = chart.ctx
      , cfg = chart.config
      , style = set.style
      , hover = this.isHovered(chart)
      ;

    if (hover) {
      ctx.save();
      ctx.fillStyle = style.onHover.color;
      ctx.strokeStyle = style.onHover.strokeColor;
      chart.tooltip.addItem({
        "set": set.title,
        "label": this.label,
        "value": this.value,
        "color": style.normal.color
      });
    }

    ctx.fillRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());
    if (style.normal.stroke > 0)
      ctx.strokeRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());

    if (hover) {
      if (style.onHover.stroke > 0)
        ctx.strokeRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());
      ctx.restore();
    }

    if (cfg.displayValue) {
      ctx.save();
      ctx.fillStyle = tinycolor.darken(set.style.color, 30).toHex();
      ctx.translate(this.getX(), chart.getBase() - 20);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(this.value/1000, 0, 15);
      ctx.restore();
    }

  }

  this.isHovered = function (chart) {
    var x = chart.getMouse("x")
      , y = chart.getMouse("y")
      , cfg = chart.config
      , hovered = false
      , yRange = [this.getBase(), this.getBase()+this.getY()].sort(function(a,b){return a-b})
      ;

    if (x >= this.getX() && x <= this.getX()+cfg.barWidth && y >= yRange[0] && y<= yRange[1]) {
      hovered = true;
    }

    return hovered;
  }

  this.updatePositionBase = function (_perc_) {
    var baseDelta = this.state.from.base - this.state.to.base
      ;
    this.state.now.base = this.state.from.base - baseDelta*_perc_;
  }

  this.saveBase = function (base) {
    if(!arguments.length)
      this.state.from.base = this.getBase();
    else
      this.state.from.base = base;

    return this;
  }

  this.moveBase = function (base) {
    this.state.to.base = base;
    return this;
  }

  this.getBase = function () {
    return this.state.now.base;
  }

  return this;
};