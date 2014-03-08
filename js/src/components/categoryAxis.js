
var xAxisCategory = function (labels) {
  var axis = this;

  this.labels = labels;
  this.labelSpace = 0;

  this.config = {
  }

  this.recalc = function (chart) {
    this.labelSpace = chart.getGridProperties().width/this.labels.length;
    return this;
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , cfg = chart.config
      , topOffset = chart.getGridProperties().bottom + 25
      , counter = 0
      ;

    if (cfg.xAxisVisible) {
      ctx.save();
      ctx.fillStyle = cfg.fontColor;
      ctx.font = cfg.font;
      this.each(function (label) {
        var leftOffset = chart.getGridProperties().left + counter*axis.labelSpace + axis.labelSpace/2 - ctx.measureText(label).width/2;
        ctx.fillText(label, leftOffset, topOffset);
        counter++;
      });
      ctx.restore();
    }
  }

  this.each = function (action) {
    forEach(this.labels, action);
  }
}
