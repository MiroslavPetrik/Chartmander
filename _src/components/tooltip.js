Chartmander.components.tooltip = function (items) {

  var tooltip = new Chartmander.components.animatedPart();

  var items = []
    , margin = 20
    , padding = 10
    , backgroundColor = "rgba(46,59,66,.9)"
    , width = 110
    , height = 40
    , dateFormat = "MMMM YYYY"
    , fontSize = 12
    , lineHeight = 1.5
    , iconSize = 10
    , fontColor = "#fff"
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
      , topOffset  = chart.mouse().y
      , leftOffset = chart.mouse().x + margin
      , lineOffset = fontSize*lineHeight
      ;

    // tooltip.animIn();

    ctx.save();
    // Draw Tooltip body
    ctx.globalAlpha = 1;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(leftOffset, topOffset, width + padding*2, height + padding*2);

    // Draw Tooltip items
    ctx.fillStyle = fontColor;
    leftOffset += padding;
    topOffset += padding;
    ctx.textBaseline = "top";
    ctx.font = chart.font();

    // Tooltip header
    ctx.fillText(moment(items[0].label).format(dateFormat), leftOffset, topOffset);
    topOffset += lineOffset;

    // Items
    forEach(items, function (item) {
      ctx.fillText(item.set + " " + item.value, leftOffset, topOffset);
      topOffset += lineOffset;
    });
    ctx.restore();
  }

  var recalc = function (ctx) {
    var lineWidth = 0;
    height = 0;
    height += fontSize*lineHeight;
    width = ctx.measureText( moment(items[0].label).format(dateFormat) ).width

    forEach(items, function (item) {
      lineWidth = ctx.measureText(item.set).width + ctx.measureText(item.value).width;
      if (lineWidth > width) width = lineWidth;
      height += lineHeight;
    });
  };

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  tooltip.drawInto = drawInto;
  tooltip.recalc = recalc;

  tooltip.addItem = function (_) {
    items.push(_);
  };

  tooltip.flush = function () {
    items = [];
  }

  tooltip.hasItems = function () {
    return items.length > 0;
  };

  tooltip.backgroundColor = function (_) {
    if (!arguments.length) return backgroundColor;
    backgroundColor = _;
    return tooltip;
  };

  tooltip.dateFormat = function (_) {
    if (!arguments.length) return dateFormat;
    dateFormat = _;
    return tooltip;
  };

  return tooltip;
}
