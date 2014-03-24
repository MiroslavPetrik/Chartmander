Chartmander.charts.line = function (canvas) {

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer     = new Chartmander.components.layer(canvas)
    , lines     = new Chartmander.models.line()
    , xAxis     = new Chartmander.components.xAxis()
    , yAxis     = new Chartmander.components.yAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  lines.layer = layer; // super important

  var xAxisVisible = true
    , yAxisVisible = true
    ;

  ///////////////////////////////////
  // Setup defaults
  ///////////////////////////////////

  layer
    .onHover(function () {
      lines.draw(true);
    })
    .onLeave(function () {
      if ( lines.completed() ) {
        lines.draw(true);
      }
    })
    ;

  lines
    .margin({ top: 30, right: 50, bottom: 50, left: 50 })
    .width(layer.width())
    .height(layer.height())
    ;

  ///////////////////////////////////
  // Setup defaults
  ///////////////////////////////////

  var x0, y0;

  var render =  function (data) {
    lines.parse(data, Chartmander.components.point);

    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(lines.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    // grid before axes
    grid.adapt(lines.width(), lines.height(), lines.margin());
    // axes use grid height to calculate their scale
    xAxis.adapt(lines, xrange);
    yAxis.adapt(lines, yrange);

    lines.recalc(xAxis, yAxis, grid);
    lines.completed(0);
    lines.draw(false);
  }

  ///////////////////////////////////
  // Extend Animation Loop(s)
  ///////////////////////////////////

  lines.drawModel(function (_perc_) {
    grid.drawInto(lines, _perc_);
    
    if (xAxisVisible) {
      xAxis
        .animIn()
        .drawInto(lines, _perc_);
    }

    if (yAxisVisible) {
      yAxis
        .animIn()
        .drawInto(lines, _perc_);
    }

    if (layer.hovered() && crosshair.visible() && grid.hovered(layer.mouse()) ) {
      crosshair.drawInto(lines);
    }

    lines.drawComponents(_perc_);

  });

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  lines.xAxis     = xAxis;
  lines.yAxis     = yAxis;
  lines.grid      = grid;
  lines.crosshair = crosshair;

  lines.render    = render;

  lines.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  lines.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return lines;
  }

  lines.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return lines;
  }

  return lines;
};
