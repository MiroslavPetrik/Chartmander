Chartmander.components.categoryAxis = function (chart, model) {

  var axis = new Chartmander.components.axis();

  var labelSpace = 10
    ;

  var recalc = function () {
    labelSpace = chart.grid.width()/axis.labels().length;
    return axis;
  }

  axis.drawInto = function (ctx, _perc_) {
    var topOffset = chart.grid.bound().bottom + axis.margin()
      , i = 0
      ;

    ctx.save();
    ctx.fillStyle = model.fontColor();
    ctx.globalAlpha = 1;
    ctx.font = model.font();
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

  axis.adapt = function (labels) {
    console.log(labels)
    axis.labels(labels);
    recalc();
    return axis;
  }

  axis.labelSpace = function () {
    return labelSpace;
  }

  return axis;
}
