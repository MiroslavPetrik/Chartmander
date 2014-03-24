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
  		if (pie.completed() )
  	});

  console.log("MAH")
  return chart;
};
