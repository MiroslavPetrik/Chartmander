Chartmander.charts.pie = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var pie = new Chartmander.models.slices(chart);

  ///////////////////////////////////
  // Setup drawing & defaults
  ///////////////////////////////////

  chart
    .onHover(function () {
      if (chart.completed() >= 1)
        chart.draw(true);
    })
    .onLeave(function () {
      if (chart.completed()) {
        chart.draw(true);
      }
    })
    .drawChart(function (ctx, _perc_) {
      pie.drawInto(ctx, _perc_);
    })
    ;

  pie
    .radius(chart.width()/2)
    ;

  var render =  function (data) {
    pie.parse(data, Chartmander.components.slice);
    pie.recalc();
    
    chart
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  chart.pie = pie;

  chart.render = render;

  return chart;
};
