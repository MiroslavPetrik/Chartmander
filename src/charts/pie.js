Chartmander.charts.pie = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var pie = new Chartmander.models.slices(chart);

  ///////////////////////////////////
  // Setup drawing & defaults
  ///////////////////////////////////
  
  chart.drawChart(function (ctx, _perc_) {
    pie.drawInto(ctx, _perc_);
  });

  chart.tooltip.showHeader(false);

  ///////////////////////////////////

  var render =  function (data) {
    console.log(chart.updated())
    pie.parse(data, Chartmander.components.slice);
    pie.recalc();
    
    chart.tooltip.percReference(pie.dataSum());

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
