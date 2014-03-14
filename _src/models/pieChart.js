Chartmander.models.pieChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas)
    , center = { x: chart.width()/2, y: chart.height()/2 }
    , radius = Math.min.apply(null, [center.x, center.y])
    , innerRadius = .6
    , rotateAnimation = true
    , startAngle = 0
    ;

  chart.type("pie");

  var recalcSlices = function (update) {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;

    forEach(chart.datasets(), function (set) {
      // There is always one element inside of dataset in chart chart

      console.log(set.els()[0].value())
      slice = set.getElement(0);
      sliceEnd = sliceStart + getAngleOf(slice.value());
      if (update) {
        slice.savePosition();
      } else {
        slice.savePosition(0, 0);
      }
      slice.moveTo(sliceStart, sliceEnd);
      sliceStart = sliceEnd;
    });
  }
  
  var drawSlices = function (_perc_) {
    chart.ctx.save();
    forEach(chart.datasets(), function (set) {
      // console.log(set.getElement(0).value())
      var slice = set.getElement(0);
      chart.ctx.fillStyle = set.color();
      
      slice.updatePosition(rotateAnimation ? _perc_ : 1)
           .drawInto(chart, set);
    });
    chart.ctx.restore();
  }


  var render =  function (data) {
    if (chart.setsCount() == 0) {
      chart.datasets(getDatasetFrom(data, chart.type(), chart.colors()));
      recalcSlices(false);
      chart.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcSlices(true);
      chart.completed(0);
      chart.draw(drawComponents, false)
    }
  }

  var update = function (data) {
    var i = 0;
    forEach(chart.datasets(), function (set) {
      set.merge(data[i], chart);
      i++;
    });
  }

  var getDataSum = function () {
    var total = 0;
    forEach(chart.datasets(), function (set) {
      set.each(function (e) {
        total += e.value();
      });
    });
    return total;
  }

  var getAngleOf = function (sliceValue) {
    return (sliceValue/getDataSum())*Math.PI*2;
  }

  var drawComponents = function (_perc_) {
    drawSlices(_perc_);
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.render = render;
  chart.drawFull = drawFull;

  chart.center = function (_) {
    if(!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return chart;
  }

  chart.innerRadius = function (_) {
    if(!arguments.length) return innerRadius;
    innerRadius = _;
    return chart;
  }

  chart.radius = function (_) {
    if(!arguments.length) return radius;
    radius = _;
  }

  chart.startAngle = function (_) {
    if(!arguments.length) return startAngle;
    startAngle = _;
    return chart;
  }

  return chart;
};
