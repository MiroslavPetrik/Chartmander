Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Layer and Model(s)
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , chart = new Chartmander.models.pie()
    ;

  // Set chart layer
  chart.layer = layer;

  layer
  	.onHover(function(){
      chart.draw(true);
    })
  	.onLeave(function(){
  		if (chart.completed() ) {
  			chart.draw(true);
  		}
  	})
    ;

  // Setup chart
  chart
    .radius(layer.width()/2)
    ;

  // Setup drawing
  chart.drawModel(function (_perc_) {
    chart.drawComponents(_perc_);
  });

  return chart;
};
