var Tooltip = function (items) {

  var tip = this;

  this.items = [];

  // Tooltip defaults
  this.config = {
    margin: 20,
    padding: 10,
    backgroundColor: "rgba(46, 59, 66, .8)",
    width: 100,
    height: 60,
    dateFormat: "MMMM Do YYYY",
    header: {
      fontSize: 15,
      lineHeight: 1.5,
      fontColor: "#EEEEEE"
    },
    set: {
      fontSize: 12,
      lineHeight: 1.5,
      iconSize: 10,
      fontColor: "#FFFFFF"
    }
  };
  this.state = {
    isAnimated: false,
    animationCompleted: 0,
    current: {
      x: 0,
      y: 0
    },
    desired: {
      x: 0,
      y: 0
    }
  };

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , tip = chart.tooltip
      , cfg = tip.config
      , topOffset = chart.config.mouse.y
      , leftOffset = chart.crosshair.x + cfg.margin
      , lineHeight = cfg.set.fontSize*cfg.set.lineHeight
      ;

    if (chart.config.type == "bar")
      leftOffset = chart.config.mouse.x

    if (tip.hasItems()) {
      tip.fadeIn();

      ctx.save();
      // Draw Tooltip body
      ctx.globalAlpha = tip.getState();
      ctx.fillStyle = tip.backgroundColor();
      ctx.fillRect(leftOffset, topOffset, cfg.width + cfg.padding*2, cfg.height + cfg.padding*2);

      // Draw Tooltip items
      ctx.fillStyle = cfg.set.fontColor;
      leftOffset += cfg.padding;
      topOffset += cfg.padding;
      ctx.textBaseline = "top";
      // Tooltip header
      ctx.fillText(moment(tip.items[0].label).format(tip.dateFormat()), leftOffset, topOffset);
      topOffset += lineHeight;
      forEach(tip.items, function (item) {
        ctx.fillText(item.set + " " + item.value, leftOffset, topOffset);
        topOffset += lineHeight;
      });
      ctx.restore();
    } else {
      tip.fadeOut();
    }
  }

  this.addItem = function (item) {
    tip.items.push(item);
  }

  this.hasItems = function () {
    return this.items.length > 0;
  }

  this.removeItems = function () {
    this.items = [];
  }

  this.recalc = function (ctx) {
    var maxWidth = 0
      , lineWidth = 0
      , height = 0
      , lineHeight = this.config.set.fontSize*this.config.set.lineHeight
      ;

    height += this.config.header.fontSize*this.config.header.lineHeight;
    maxWidth = ctx.measureText(moment(this.items[0].label).format(this.dateFormat())).width

    forEach(this.items, function (item) {
      lineWidth = ctx.measureText(item.set).width + ctx.measureText(item.value).width;
      if (lineWidth > maxWidth)
        maxWidth = lineWidth;
      height += lineHeight;
    });
    
    this.config.width = maxWidth;
    this.config.height = height;
  }


  this.fadeOut = function () {
      tip.state.animationCompleted -= .05;

      if (tip.getState() <= 0) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 0;
      }
  } 

  this.fadeIn = function () {
      tip.state.animationCompleted += .05;

      if (tip.getState() >= 1) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 1;
      }
  }

  this.getState = function () {
    return tip.state.animationCompleted;
  }

  this.isAnimated = function (_) {
    if(!arguments.length) return tip.state.isAnimated
    tip.state.isAnimated = _;
  }

  // User methods
  this.backgroundColor = function (_) {
    if (!arguments.length) return tip.config.backgroundColor;
    tip.config.backgroundColor = _;
    return this;
  }

  this.dateFormat = function (_) {
    if (!arguments.length) return tip.config.dateFormat;
    tip.config.dateFormat = _;
    return this;

  }

  return this;
}
