Chartmander.components.categoryAxis = function () {

  var axis = new Chartmander.components.axis();

  var labelSpace = 10
    ;

  var recalc = function (chart) {
    labelSpace = chart.grid.width()/axis.labels().length;
    return axis;
  }

  axis.drawInto = function (chart, _perc_) {
    var ctx = chart.layer.ctx
      , topOffset = chart.grid.bound().bottom + axis.margin()
      , i = 0
      ;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.globalAlpha = 1;
    ctx.font = chart.font();
    axis.each(function (label) {
      var leftOffset = chart.grid.bound().left + i*labelSpace + labelSpace/2 - ctx.measureText(label).width/2;
      ctx.fillText(label, leftOffset, topOffset);
      i++;
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.adapt = function (chart) {
    recalc(chart);
    return axis;
  }

  axis.labelSpace = function () {
    return labelSpace;
  }

  return axis;
}
