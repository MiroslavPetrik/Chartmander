Chartmander.models.pie = function (layer) {

  var chart = new Chartmander.models.base();

  var center          = { x: chart.width()/2, y: chart.height()/2 }
    , radius          = Math.min.apply(null, [center.x, center.y])
    , innerRadius     = .6
    , rotateAnimation = true
    , startAngle      = 0
    ;

  // Initial setup
  chart.easing("easeOutBounce");
  chart.layer(layer);

  var layer = chart.layer();

  var recalcSlices = function () {
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
    layer.ctx.save();
    forEach(chart.datasets(), function (set) {
      var slice = set.getElement(0);
      layer.ctx.fillStyle = set.color();
      
      slice.updatePosition(rotateAnimation ? _perc_ : 1)
           .drawInto(layer.ctx, chart, set);
    });
    layer.ctx.restore();
  }

  var render =  function (data) {
    chart.parse(data, Chartmander.components.slice);
    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    recalcSlices();
    chart.completed(0);
    chart.draw(drawComponents, false);
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
  chart.drawComponents = drawComponents;

  chart.center = function (_) {
    if(!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return chart;
  };

  chart.innerRadius = function (_) {
    if(!arguments.length) return innerRadius;
    innerRadius = _;
    return chart;
  };

  chart.radius = function (_) {
    if(!arguments.length) return radius;
    radius = _;
    return chart;
  };

  chart.startAngle = function (_) {
    if(!arguments.length) return startAngle;
    startAngle = _;
    return chart;
  };

  return chart;
};



