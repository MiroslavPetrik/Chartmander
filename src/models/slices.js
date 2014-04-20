Chartmander.models.slices = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var center          = { x: 0, y: 0 }
    , radius          = 0
    , innerRadius     = .6  // donut hole
    , rotateAnimation = true
    , startAngle      = 0
    , clockWise       = false
    ;

  var recalc = function () {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;

    forEach(model.datasets(), function (set) {
      // There is always one element inside of dataset in pie model
      slice = set.getElement(0);
      sliceEnd = sliceStart + getAngleOf(slice.value());
      if (model.updated()) {
        slice.savePosition();
      } else {
        slice.savePosition(0, 0);
      }
      slice.moveTo(sliceStart, sliceEnd);
      sliceStart = sliceEnd;
    });
  }
  
  var drawSlices = function (ctx, _perc_) {
    ctx.save();
    forEach(model.datasets(), function (set) {
      var slice = set.getElement(0);
      ctx.fillStyle = set.color();
      slice
        .updatePosition(rotateAnimation ? _perc_ : 1)
        .drawInto(ctx, chart, model, set);
    });
    ctx.restore();
  }

  var getDataSum = function () {
    var total = 0;
    forEach(model.datasets(), function (set) {
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
    center.x = model.margin().left + radius;
    center.y = model.margin().top  + radius;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  model.recalc = recalc;
  model.drawInto = drawSlices;

  model.center = function (_) {
    if (!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return model;
  };

  model.innerRadius = function (_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return model;
  };

  model.radius = function (_) {
    if (!arguments.length) return radius;
    radius = _;
    model.width(radius*2).height(radius*2);
    centerize();
    return model;
  };

  model.startAngle = function (_) {
    if (!arguments.length) return startAngle;
    startAngle = _;
    return model;
  };

  model.clockWise = function (_) {
    if (!arguments.length) return clockWise;
    clockWise = _;
    return model;
  };

  return model;
};
