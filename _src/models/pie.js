Chartmander.models.pie = function () {

  var model = new Chartmander.models.base();

  var center          = { x: model.width()/2, y: model.height()/2 }
    , radius          = Math.min.apply(null, [center.x, center.y])
    , innerRadius     = .6
    , rotateAnimation = true
    , startAngle      = 0
    ;

  model.easing("easeOutBounce");

  var recalcSlices = function () {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;

    forEach(model.datasets(), function (set) {
      // There is always one element inside of dataset in pie chart
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
  
  var drawSlices = function (_perc_) {
    model.ctx.save();
    forEach(model.datasets(), function (set) {
      var slice = set.getElement(0);
      model.ctx.fillStyle = set.color();
      
      slice.updatePosition(rotateAnimation ? _perc_ : 1)
           .drawInto(model, set);
    });
    model.ctx.restore();
  }

  var render =  function (data) {
    model.parse(data, Chartmander.components.slice);
    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(model.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    recalcSlices();
    model.completed(0);
    model.draw(drawComponents, false);
  }

  var update = function (data) {
    var i = 0;
    forEach(model.datasets(), function (set) {
      set.merge(data[i], model);
      i++;
    });
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

  var drawComponents = function (_perc_) {
    drawSlices(_perc_);
  }

  var drawFull = function () {
    model.draw(drawComponents, true);
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  model.render = render;
  model.drawFull = drawFull;
  model.drawComponents = drawComponents;

  model.center = function (_) {
    if(!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return model;
  };

  model.innerRadius = function (_) {
    if(!arguments.length) return innerRadius;
    innerRadius = _;
    return model;
  };

  model.radius = function (_) {
    if(!arguments.length) return radius;
    radius = _;
    return model;
  };

  model.startAngle = function (_) {
    if(!arguments.length) return startAngle;
    startAngle = _;
    return model;
  };

  return model;
};
