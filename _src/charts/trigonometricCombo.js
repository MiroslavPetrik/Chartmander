Chartmander.charts.trigonometricCombo = function (canvas) {

  var chart = this;
  
  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer     = new Chartmander.components.layer(canvas)
    , circle    = new Chartmander.models.pie()
    , line      = new Chartmander.models.line()
    , xAxis     = new Chartmander.components.numberAxis()
    , yAxis     = new Chartmander.components.numberAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  circle.layer = layer;
  line.layer = layer;

  var xAxisVisible = true
    , yAxisVisible = true
    , angleColor   = "#fff"
    , hoverAngle   = 0;
    ;

  ///////////////////////////////////
  // Setup Defaults
  ///////////////////////////////////

  layer
    .onHover(function () {
      // circle.updated(true);

      if (circle.hovered())
        circle.draw(true);
      if (line.hovered())
        line.draw(true);

      hoverAngle = crossToAngle(crosshair.x());

      chart.render(hoverAngle);
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
    .animate(false)
    .startPosition("direct")
    .easing("linear")
    .width(layer.width()-300)
    .height(250)
    .showPoint(false)
    .lineWidth(3)
    .areaVisible(false)
    .margin({top: 20, left: 250, bottom: 0, right: 30})
    ;

  circle
    .animate(false)
    .easing("linear")
    .margin({top: 30, left: 30})
    .radius(100)
    .innerRadius(.97)
    .colors(["blue", angleColor])
    ;

  grid.margin({top: 10});

  xAxis.orientation("horizontal");

  function sinMe (angle) {
    return parseFloat(Math.sin(angle).toFixed(3));
  }

  function sineWave (points, endAngle) {
    var set = {
          "title": "sinx",
          "values": []
        },
        hoverSet = {
          "title": "hovered sinx",
          "values": []
        }
      , incrementAngle = (Math.PI*2)/points
      ;
    for (var currAngle = 0; currAngle < Math.PI*2; currAngle += incrementAngle) {
      var sin = sinMe(currAngle);
      set.values.push({
        label: currAngle,
        value: sin
      });
      if (currAngle <= endAngle) {
        hoverSet.values.push({
          label: currAngle,
          value: sin
        });
      }
    };
    return [set, hoverSet];
  }

  function crossToAngle (x) {
    return (x - grid.bound().left)*xAxis.scale();
  }

  var render = function (activeAngle) {
    var passiveAngle = Math.PI*2 - activeAngle
      , circleData = [
          {
            title: "passive",
            values: [
              {
                label: "passive angle",
                value: passiveAngle
              }
            ]
          },
          {
            title: "active",
            values: [
              {
                label: "active angle",
                value: activeAngle
              }
            ]
          }
        ]
      ;

    // render unit circle
    circle.parse(circleData, Chartmander.components.slice);
    circle.recalc();
    circle.completed(0);
    circle.draw(false);

    // if (!circle.updated()) {
      var sineData = sineWave(100, 0)
      // render line
      line.parse(sineData, Chartmander.components.point);

      // grid before axes
      grid.adapt(line);
      xAxis.adapt(line, {min:0, max:Math.PI*2});
      yAxis.adapt(line, {min:-1, max:1});

      line.base(grid.bound().bottom - yAxis.zeroLevel());
      line.recalc(xAxis, yAxis, grid);
      line.completed(0);
      line.draw(false);
    // }
  }

  ///////////////////////////////////
  // Extend Animation Loop(s)
  ///////////////////////////////////

  circle.drawChart(function (_perc_) {
    var ctx = layer.ctx;

    var cx = circle.center().x
      , cy = circle.center().y
      , cr = cx + Math.cos(hoverAngle)*circle.radius()
      , sr = cy - Math.sin(hoverAngle)*circle.radius()
      ;

    circle.drawModel(_perc_);
    // draw inner triangle
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cr, cy);
    ctx.lineTo(cr, sr);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.restore();
  });

  line.drawChart(function (_perc_) {
    var ctx = layer.ctx;
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
      /// todo stick cross to line only
      crosshair.drawInto(line);
    }
    
    line.drawModel(_perc_);

    // draw circle rotation on Xaxis
    if (grid.hovered(layer.mouse())) {
      ctx.save();
      ctx.strokeStyle = angleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(grid.bound().left, line.base());
      ctx.lineTo(crosshair.x(), line.base());
      ctx.stroke();
      ctx.restore();
    }

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
    return grid.bound().bottom - yAxis.zeroLevel();
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

  chart.angleColor = function (_) {
    if (!arguments.length) return angleColor;
    angleColor = _;
    return chart;
  }

  return chart;
}
