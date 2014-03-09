Chartmander.models.pieChart = function (canvas) {

  var pie = new Chartmander.models.chart(canvas)
    , type = "pie"
    , center = { x: pie.width()/2, y: pie.height()/2 }
    , radius = Math.min.apply(null, [center.x, center.y])
    , innerRadius = .6
    , rotateAnimation = true
    , startAngle = 0
    ;

  // chart.tooltip = Chartmander.components.tooltip();

  var recalcSlices = function (update) {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;

    forEach(pie.datasets(), function (set) {
      // There is always one element inside of dataset in Pie pie

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
    pie.ctx.save();
    forEach(pie.datasets(), function (set) {
      // console.log(set.getElement(0).value())
      var slice = set.getElement(0);
      pie.ctx.fillStyle = set.color();
      slice.updatePosition(rotateAnimation ? _perc_ : 1);
      slice.drawInto(pie, set);
    });
    pie.ctx.restore();
  }


  var render =  function (data) {
    if (pie.setsCount() == 0) {
      pie.datasets(getDatasetFrom(data, type, pie.colors()));
      recalcSlices(false);
      pie.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcSlices(true);
      pie.completed(0);
      pie.draw(drawComponents, false)
    }
  }

  var update = function (data) {
    var i = 0;
    forEach(pie.datasets(), function (set) {
      set.merge(data[i], pie);
      i++;
    });
  }

  var getDataSum = function () {
    var total = 0;
    forEach(pie.datasets(), function (set) {
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
    pie.draw(drawComponents, true);
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  pie.render = render;
  pie.drawFull = drawFull;

  pie.center = function (_) {
    if(!arguments.length) return center
    center.x = typeof _.x != 'undefined' ? _.x : center.x;
    center.y = typeof _.y != 'undefined' ? _.y : center.y;
    return pie;
  }

  pie.innerRadius = function (_) {
    if(!arguments.length) return innerRadius;
    innerRadius = _;
    return pie;
  }

  pie.radius = function (_) {
    if(!arguments.length) return radius;
    radius = _;
  }

  pie.startAngle = function (_) {
    if(!arguments.length) return startAngle;
    startAngle = _;
    return pie;
  }

  return pie;
};
