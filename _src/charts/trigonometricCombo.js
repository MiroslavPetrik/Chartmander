Chartmander.charts.trigonometricCombo = function (canvas) {

  var chart = this;
  
  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer     = new Chartmander.components.layer(canvas)
    , circle    = new Chartmander.models.pie()
    , line      = new Chartmander.models.line()
    , xAxis     = new Chartmander.components.xAxis()
    , yAxis     = new Chartmander.components.yAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  circle.layer = layer;
  line.layer = layer;

  var xAxisVisible = true
    , yAxisVisible = true
    ;

  ///////////////////////////////////
  // Setup Defaults
  ///////////////////////////////////

  layer
    .onHover(function () {
      circle.draw(true);
      line.draw(true);
    })
    .onLeave(function () {
      if ( circle.completed() ) {
        circle.draw(true);
      }
      if ( line.completed() ) {
        line.draw(true);
      }
    })
    ;

  line
    .width(layer.width()-300)
    .height(layer.height())
    .margin({left: 300})
    ;

  circle
    .radius(150)
    .innerRadius(.98)
    ;

  function sine (points, startAngle) {
    var result = []
      , incrementAngle = (Math.PI*2)/points
      ;
    for (var i = 0; i < Math.PI*2; i += incrementAngle) {
      result.push({
        label: i,
        value: parseFloat(Math.sin(i).toFixed(5))
      })
    };
    return result;
  }

  var render =  function (data) {
    var circleData = data.pie
      , sineData = data.line;

    // render unit circle
    circle.parse(circleData, Chartmander.components.slice);
    circle.recalc();
    circle.completed(0);
    circle.draw(false);

    // render line
    line.parse(sineData, Chartmander.components.point);
    var xrange = getRange(getArrayBy(sineData, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(line.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());
    // grid before axes
    grid.adapt(line.width(), line.height(), line.margin());
    xAxis.adapt(line, xrange);
    yAxis.adapt(line, yrange);

    line.recalc(xAxis, yAxis, grid);
    line.completed(0);
    line.draw(false);
  }

  ///////////////////////////////////
  // Extend Animation Loop(s)
  ///////////////////////////////////

  circle.drawChart(function (_perc_) {
    circle.drawModel(_perc_);
  });

  line.drawChart(function (_perc_) {
    grid.drawInto(line, _perc_);
    
    if (xAxisVisible) {
      xAxis
        .animIn()
        .drawInto(line, _perc_);
    }

    if (yAxisVisible) {
      yAxis
        .animIn()
        .drawInto(line, _perc_);
    }

    if (layer.hovered() && crosshair.visible() && grid.hovered(layer.mouse())) {
      crosshair.drawInto(line);
    }
    
    line.drawModel(_perc_);
  });

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  line.xAxis = xAxis;
  line.yAxis = yAxis;
  line.grid = grid;
  line.crosshair = crosshair;

  chart.sineWave = line;  // models accessible from outside
  chart.unitCircle = circle;

  chart.render = render;

  line.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  }

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  }

  return chart;
}
