Chartmander.models.pieChart = function (canvas) {

  var pie = Chartmander.models.chart(canvas)
    , type = "pie"
    , margin = { top: 50, right: 50, bottom: 50, left: 50 }
    , center = { x: pie.width()/2, y: pie.height()/2 }
    , radius = Math.min.apply(null, [center.x, center.y])
    , innerRadius = .6
    , rotateAnimation = true
    , startAngle = 0
    ;

  // Construct
  // chart.tooltip = Chartmander.components.tooltip();
  

  var data =  function (data) {
    if (!datasets.length)
      pie.datasets = getDatasetFrom(data, type, colors);
    else
      pie.update(data)
  }

  var drawSlices = function (_perc_) {
    pie.ctx.save();
    forEach(pie.datasets(), function (set) {
      var slice = set.elements[0];
      pie.ctx.fillStyle = set.style.color;
      slice.updatePosition(rotateAnimation ? _perc_ : 1);
      slice.drawInto(pie, set);
    });
    pie.ctx.restore();
  }

  var recalcSlices = function (update) {
    var slice
      , sliceStart = 0
      , sliceEnd
      ;
    forEach(pie.datasets, function (set) {
      // There is always one element inside of dataset in Pie pie
      slice = set.elements[0];
      sliceEnd = sliceStart + pie.getAngleOf(slice.value)
      if (update) {
        slice.savePosition(); 
      } else {
        slice.savePosition(0, 0);
      }
      slice.moveTo(sliceStart, sliceEnd);
      sliceStart = sliceEnd;
    });
  }

  var update = function (data) {
    var i = 0;
    forEach(pie.datasets, function (set) {
      set.merge(data[i], pie);
      i++;
    });
    pie.recalcSlices(true);
    pie.animationCompleted = 0;
    pie.draw();
  }

  var getElementValue = function () {
    var total = 0;
    forEach(pie.datasets, function (set) {
      forEach(set.elements, function (e) {
        total += e.value;
      })
    });
    return total;
  }

  var getAngleOf = function (sliceValue) {
    return (sliceValue/getElementValue())*Math.PI*2;
  }



  ///////////////////////
  // Methods
  ///////////////////////

  pie.getAngleOf = getAngleOf;
  pie.data = data;

  // User methods
  pie.innerRadius = function (_) {
    if(!arguments.length) return innerRadius;
    innerRadius = _;
    return pie;
  }

  pie.radius = function (_) {
    if(!arguments.length) return radius;
    radius = _;
    return pie;
  }

  console.log(easings)
  // pie.recalcSlices(false);
  pie.draw(drawComponents, false);

  return pie;
};
