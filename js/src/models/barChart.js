Chartmander.models.barChart = function (canvas) {

  var bars = new Chartmander.models.chart(canvas);

  var type = "bar"
    , stacked = false
    , maxBarWidth = 30
    , datasetSpacing = 0
    , barWidth = maxBarWidth
    , groupWidth = 0
    , groupOffset = 0
    ;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis = new Chartmander.components.xAxis()
    , yAxis = new Chartmander.components.yAxis()
    , grid  = new Chartmander.components.grid()
    ;

  // var xValues = getArrayBy(data, "label")
  // // , yValues = getArrayBy(data, "value")
  // , xRange = getRange(xValues)
  // // , yRange = getRange(yValues)
  // ;

  var render =  function (data) {
    if (bars.setsCount() == 0) {
      var xrange = getRange(getArrayBy(data, "label"));
      bars.datasets(getDatasetFrom(data, type, bars.colors()));

      recalcBars(false);
      bars.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcBars(true);
      bars.completed(0);
      bars.draw(drawComponents, false)
    }
  }


  var recalcBars = function () {
    var counter = 0
      , streams = bars.setsCount()
      , leftFix
      , x
      , y
      ;

    barWidth = Math.floor( grid.width()/bars.elementCount() );
    leftFix = (barWidth*streams)/2;

    // faux
    // yAxis.margin(leftFix + 10);

    forEach(bars.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() - leftFix + (bar.label()-xAxis.min())/xAxis.scale() + counter*barWidth;
        y = -bar.value()/yAxis.scale();
        bar.savePosition(grid.width()/2, 0).moveTo(x, y).saveBase(bars.getBase()).moveBase(bars.getBase());
      });
      counter++;
    });
  }

  var drawBars = function (_perc_) {
    var counter = {
        dataset: 0
      }
      ;

    ctx.save();
    forEach(chart.datasets(), function (set) {
      ctx.fillStyle = set.color();
      // ctx.lineWidth = set.style.normal.stroke;
      // ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        bar.updatePosition(_perc_);
        bar.updatePositionBase(_perc_);
        bar.drawInto(chart, set);
      })
      counter.dataset++;
    })
    ctx.restore();
  }

 var update = function (data) {
    var i = 0
      , xValues = getArrayBy(data, "label")
      , yValues = getArrayBy(data, "value")
      , xRange = getRange(xValues)
      , yRange = getRange(yValues)
      ;

    // Recalc Axeslo

    chart.yAxis.min(yRange.min).max(yRange.max);
    // chart.yAxis.recalc(chart);
    chart.xAxis.min(xRange.min).max(xRange.max);
    // chart.xAxis.recalc(chart);

    // Recalc sets
    forEach(bars.datasets(), function (set) {
      if (data[i] === undefined)
        throw new Error("Missing dataset. Dataset count on update must match.")

      set.merge(data[i], chart);

      set.each(function (bar) {
        bar.savePosition().moveTo(false, - bar.value()/yAxis.scale()).saveBase().moveBase(chart.getBase());
      });
      i++;
    });

    chart.completed(0);
    draw();
  }

  var drawComponents = function () {

  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  bars.render = render;

  // User methods
  bars.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return bars;
  }

  return bars;
}
