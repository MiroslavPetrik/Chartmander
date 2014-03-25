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
  // Setup Defaults
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
    grid.adapt(lines);
    // axes use grid height to calculate their scale
    xAxis.adapt(lines, xrange);
    yAxis.adapt(lines, yrange);
    lines.base(grid.bound().bottom - yAxis.zeroLevel());

    lines
      .recalc(xAxis, yAxis, grid)
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////////
  // Extend Animation Loop(s)
  ///////////////////////////////////

  lines.drawChart(function (_perc_) {
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

    if (layer.hovered() && crosshair.visible() && grid.hovered(layer.mouse())) {
      crosshair.drawInto(lines);
    }
    
    lines.drawModel(_perc_);
  });

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  lines.xAxis     = xAxis;
  lines.yAxis     = yAxis;
  lines.grid      = grid;
  lines.crosshair = crosshair;

  lines.render    = render;

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
