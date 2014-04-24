Chartmander.charts.categoryBar = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var bars      = new Chartmander.models.bars(chart)
    , xAxis     = new Chartmander.components.categoryAxis(chart, bars)
    , yAxis     = new Chartmander.components.yAxis(chart, bars)
    , grid      = new Chartmander.components.grid(chart, xAxis, yAxis)
    , y0
    ;

  chart.drawChart(function (ctx, _perc_) {
    grid.drawInto(ctx, _perc_);

    if (xAxis.visible()) {
      xAxis
        .animIn()
        .drawInto(ctx, _perc_);
      // if (x0 && x0.state > 0) {
      //   ctx.save();
      //   forEach(x0.labels, function (label) {

      //   });
      //   ctx.restore();
      // } 
    }

    if (yAxis.visible()) {
      yAxis
        .animIn()
        .drawInto(ctx, _perc_);

      if (y0 && y0.state > 0) {
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = bars.fontColor();
        ctx.font = bars.font();
        ctx.globalAlpha = y0.state;
        forEach(y0.labels, function (label) {
          label.updatePosition(_perc_);
          ctx.fillText(label.label().toString() + " " + yAxis.unit(), grid.bound().left - yAxis.margin(), label.y());
        });
        ctx.restore();
        y0.state -= .01;
      }
    }

    bars.drawInto(ctx, _perc_);
  });

  var render =  function (data) {
    bars.parse(data, Chartmander.components.bar);
    var oldYScale; //undefined
    var xLabels = [];
    // excract categories - just from #1 dataset
    bars.dataset(0).each(function (element) {
      xLabels.push(element.label());
    });

    var yrange = getRange(function(){
      var values = [];
      forEach(bars.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (chart.updated()) {
      y0 = yAxis.copy();
      oldYScale = y0.scale;
    }

    xAxis.adapt(xLabels);
    yAxis.adapt(yrange, oldYScale);
    bars.base(grid.bound().bottom - yAxis.zeroLevel());

    // recalc old labels to new position
    if (chart.updated()) {
      forEach(y0.labels, function (label) {
        label.savePosition().moveTo(false, bars.base() - label.value()/yAxis.scale());
      });
    }
    
    bars.recalc(xAxis, yAxis, grid);

    chart
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.bars = bars;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;

  chart.render = render;

  return chart;
}
