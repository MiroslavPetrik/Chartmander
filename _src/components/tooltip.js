Chartmander.components.tooltip = function (items) {

  var tooltip = this;

  var items = []
    , margin = 20
    , padding = 10
    , backgroundColor = "rgba(46,59,66,.8)"
    , width = 100
    , height = 0
    , dateFormat = "MMMM DD YYYY"
    , fontSize = 12
    , lineHeight = 1.5
    , iconSize = 10
    , fontColor = "#fff"
    , isAnimated = false
    , animationCompleted = 0
    , current = { // Position
        x: 0,
        y: 0
      }
    , desired = {
        x: 0,
        y: 0
      }
    ;

  var drawInto = function (chart) {
    var ctx = chart.ctx
      , topOffset = chart.mouse().y
      , leftOffset = chart.crosshair.x() + margin
      , lineHeight = fontSize*lineHeight
      ;

    if (chart.type() == "bar")
      leftOffset = chart.mouse().x;

    if (items.length > 0) {
      tooltip.fadeIn();

      ctx.save();
      // Draw Tooltip body
      ctx.globalAlpha = animationCompleted;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(leftOffset, topOffset, width + padding*2, height + padding*2);

      // Draw Tooltip items
      ctx.fillStyle = fontColor;
      leftOffset += padding;
      topOffset += padding;
      ctx.textBaseline = "top";
      // Tooltip header
      ctx.fillText(moment(items[0].label).format(dateFormat), leftOffset, topOffset);
      topOffset += lineHeight;
      forEach(items, function (item) {
        ctx.fillText(item.set + " " + item.value, leftOffset, topOffset);
        topOffset += lineHeight;
      });
      ctx.restore();
    } else {
      tooltip.fadeOut();
    }
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  tooltip.addItem = function (item) {
    items.push(item);
  }

  tooltip.hasItems = function () {
    return items.length > 0;
  }

  tooltip.recalc = function (ctx) {
    var lineWidth = 0;

    height += fontSize*lineHeight;
    width = ctx.measureText(moment(items[0].label).format(dateFormat)).width

    forEach(items, function (item) {
      lineWidth = ctx.measureText(item.set).width + ctx.measureText(item.value).width;
      if (lineWidth > width)
        width = lineWidth;
      height += lineHeight;
    });
  }

  tooltip.fadeOut = function () {
      animationCompleted -= .05;

      if (tip.getState() <= 0) {
        tip.isAnimated(false);
        animationCompleted = 0;
      }
  } 

  tooltip.fadeIn = function () {
      animationCompleted += .05;

      if (tip.getState() >= 1) {
        tip.isAnimated(false);
        animationCompleted = 1;
      }
  }

  tooltip.getState = function () {
    return animationCompleted;
  }

  tooltip.isAnimated = function (_) {
    if(!arguments.length) return isAnimated
    isAnimated = _;
  }

  // User methods
  tooltip.backgroundColor = function (_) {
    if (!arguments.length) return backgroundColor;
    backgroundColor = _;
    return tooltip;
  }

  tooltip.dateFormat = function (_) {
    if (!arguments.length) return dateFormat;
    dateFormat = _;
    return tooltip;
  }

  return tooltip;
}
