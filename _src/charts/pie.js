Chartmander.charts.pie = function (canvas) {

  ///////////////////////////////////
  // Use Layer and Model(s)
  ///////////////////////////////////

  var layer = new Chartmander.components.layer(canvas)
    , chart = new Chartmander.models.pie();

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
    chart.ctx.save();
    forEach(chart.datasets(), function (set) {
      var slice = set.getElement(0);
      chart.ctx.fillStyle = set.color();
      
      slice.updatePosition(rotateAnimation ? _perc_ : 1)
           .drawInto(chart, set);
    });
    chart.ctx.restore();
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
  chart.layer = layer;
  chart.render = render;
  chart.drawFull = drawFull;
  chart.drawComponents = drawComponents;

  return chart;
};
