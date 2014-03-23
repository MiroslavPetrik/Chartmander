Chartmander.charts.trigonometricCombo = function (canvas) {

  var chart = this;
  
  ///////////////////////////////////
  // Use Layer and Model(s)
  ///////////////////////////////////

  var layer  = new Chartmander.components.layer(canvas)
    , circle = new Chartmander.models.pie()
    , line   = new Chartmander.models.line()
    ;

  ///////////////////////////////////
  // Setup Models
  ///////////////////////////////////

  circle
    .width(250)
    .height(250)
    .radius(125)
    .innerRadius(.98)
    .center({x:circle.width()/2, y:circle.height()/2})
    ;

  line
    .margin({left: 300})
    ;

  // Shorthands for drawing functions
  var ctx       = chart.ctx
    , grid      = sineLine.grid
    , xAxis     = sineLine.xAxis
    , yAxis     = sineLine.yAxis
    , crosshair = sineLine.crosshair
    ;

  var render =  function () {
    circle.render([
      {
        "title": "sine",
        "values": [
          {
            "label": "Sin value",
            "value": 0
          }
        ]
      }, 
      {
        "title": "reversed",
        "values": [
          {
            "label": "sine reversed",
            "value": 360
          }
        ]
      }
    ]);

    // sineLine.render([
    // {
    //   "title": "sine",
    //   "values": sine(100, 0)
    // }
    // ]);

    sineLine.render(dataFactory(["Sine"], yearByMonths(1), 200));

    // if (chart.updated()) {
    //   // x0 = xAxis.copy(); // just object with labels and scale
    //   y0 = yAxis.copy();
    //   oldYScale = y0.scale;
    // }
    // grid.adapt(chart.width(), chart.height(), chart.margin());
    // xAxis.labels(xLabels).adapt(chart);
    // yAxis.adapt(chart, yrange, oldYScale);

    // // recalc old labels to new position
    // if (chart.updated()) {
    //   forEach(y0.labels, function (label) {
    //     label.savePosition().moveTo(false, chart.base() - label.value()/yAxis.scale());
    //   });
    // }

    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

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

  var drawComponents = function (_perc_) {
    circle.drawComponents(_perc_);
    sineLine.drawComponents(_perc_);
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////
  
  chart.xAxis     = xAxis;
  chart.yAxis     = yAxis;
  chart.grid      = grid;
  chart.crosshair = crosshair;
  chart.tooltip   = sineLine.tooltip;
  circle.tooltip = sineLine.tooltip;

  chart.render = render;
  chart.drawFull = drawFull;

  return chart;
}

