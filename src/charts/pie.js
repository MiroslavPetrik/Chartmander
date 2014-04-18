Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , pie   = new Chartmander.models.pie()
    ;

  pie.layer = layer;

  ///////////////////////////////////
  // Setup defaults
  ///////////////////////////////////

  layer
    .onHover(function () {
      if (pie.completed() >= 1)
        pie.draw(true);
    })
    .onLeave(function () {
      if ( pie.completed() ) {
        pie.draw(true);
      }
    })
    ;

  pie
    .radius(layer.width()/2)
    ;

  var render =  function (data) {
    pie.parse(data, Chartmander.components.slice);
    pie.recalc();
    pie.completed(0);
    pie.draw(false);
  }

  ///////////////////////////////////
  // Extend Animation Loop
  ///////////////////////////////////

  pie.drawChart(function (_perc_) {
    pie.drawModel(_perc_);
  });

  ///////////////////////////////////
  // Methods
  ///////////////////////////////////

  pie.render = render;

  return pie;
};
