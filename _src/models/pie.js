Chartmander.models.pie = function () {

  var chart = new Chartmander.models.base();

  var center          = { x: 0, y: 0 }
    , radius          = 0
    , innerRadius     = .6
    , rotateAnimation = true
    , startAngle      = 0
    ;

  chart.easing("easeOutBounce");

  var recalc = function () {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;

    forEach(chart.datasets(), function (set) {
      // There is always one element inside of dataset in pie chart
      slice = set.getElement(0);
      sliceEnd = sliceStart + getAngleOf(slice.value());
      if (chart.updated()) {
        slice.savePosition();
      } else {
        slice.savePosition(0, 0);
      }
      slice.moveTo(sliceStart, sliceEnd);
      sliceStart = sliceEnd;
    });
  }
  
  var drawSlices = function (_perc_) {
    var ctx = chart.layer.ctx;
    ctx.save();
    forEach(chart.datasets(), function (set) {
      var slice = set.getElement(0);
      ctx.fillStyle = set.color();
      
      slice
        .updatePosition(rotateAnimation ? _perc_ : 1)
        .drawInto(ctx, chart, set);
    });
    ctx.restore();
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

  var centerize = function () {
    center.x = chart.margin().left + radius;
    center.y = chart.margin().top  + radius;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.recalc = recalc;
  chart.drawModel = drawSlices;

  chart.center = function (_) {
    if (!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return chart;
  };

  chart.innerRadius = function (_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return chart;
  };

  chart.radius = function (_) {
    if (!arguments.length) return radius;
    radius = _;
    chart.width(radius*2).height(radius*2);
    centerize();
    return chart;
  };

  chart.startAngle = function (_) {
    if (!arguments.length) return startAngle;
    startAngle = _;
    return chart;
  };

  return chart;
};



