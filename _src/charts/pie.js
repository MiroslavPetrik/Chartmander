Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Layer and Model(s)
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , chart = new Chartmander.models.pie(layer)
    ;
  console.log("MAH")
  return chart;
};
