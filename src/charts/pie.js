Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , pie   = new Chartmander.models.slices()
    ;

  pie.layer = layer;

  ///////////////////////////////////
  // Setup defaults
  ///////////////////////////////////

  layer
    .onHover(function () {
      if (layer.completed() >= 1)
        pie.draw(true);
    })
    .onLeave(function () {
      if (layer.completed()) {
        pie.draw(true);
      }
    })
    .drawChart(function (_perc_) {
      pie.draw(_perc_);
    })
    ;

  pie
    .radius(layer.width()/2)
    ;

  var render =  function (data) {
    pie.parse(data, Chartmander.components.slice);
    pie.recalc();
    
    layer
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////
  // Methods and Binding
  ///////////////////////////////

  pie.render = render;

  return pie;
};
