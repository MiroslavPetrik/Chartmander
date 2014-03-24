Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Layer and Model(s)
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , chart = new Chartmander.models.pie(layer)
    ;

  layer
  	.onHover(chart.drawFull)
  	.onLeave(function(){
  		if (chart.completed() ) {
  			chart.drawFull();
  		}
  	});

  console.log("MAH")
  return chart;
};
