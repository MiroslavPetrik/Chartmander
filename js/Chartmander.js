// Chartmander v0.1.1
// https://github.com/11th/Chartmander
// Copyright (c) 2014 Miroslav Petrik, MIT License

(function(){

  var Chartmander = window.Chartmander || {};
  window.Chartmander = Chartmander;
  Chartmander.version = '0.1.1';
  Chartmander.models = Chartmander.models || {};
  Chartmander.components = Chartmander.components || {};

  Chartmander.charts = []; // Store all rendered charts

  Chartmander.addChart = function (callback) {
    var newChart = callback()
    //   , alreadyRendered = false;
    // forEach(Chartmander.charts, function (chart) {
      
    // });
    // if (alreadyRendered) 
      
    // else
      Chartmander.charts.push(newChart)

    return Chartmander;
  }


  var easings = {
    linear : function (t){
      return t;
    },
    easeInQuad: function (t) {
      return t*t;
    },
    easeOutQuad: function (t) {
      return -1 *t*(t-2);
    },
    easeInOutQuad: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t;
      return -1/2 * ((--t)*(t-2) - 1);
    },
    easeInCubic: function (t) {
      return t*t*t;
    },
    easeOutCubic: function (t) {
      return 1*((t=t/1-1)*t*t + 1);
    },
    easeInOutCubic: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t;
      return 1/2*((t-=2)*t*t + 2);
    },
    easeInQuart: function (t) {
      return t*t*t*t;
    },
    easeOutQuart: function (t) {
      return -1 * ((t=t/1-1)*t*t*t - 1);
    },
    easeInOutQuart: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t*t;
      return -1/2 * ((t-=2)*t*t*t - 2);
    },
    easeInQuint: function (t) {
      return 1*(t/=1)*t*t*t*t;
    },
    easeOutQuint: function (t) {
      return 1*((t=t/1-1)*t*t*t*t + 1);
    },
    easeInOutQuint: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t*t*t;
      return 1/2*((t-=2)*t*t*t*t + 2);
    },
    easeInSine: function (t) {
      return -1 * Math.cos(t/1 * (Math.PI/2)) + 1;
    },
    easeOutSine: function (t) {
      return 1 * Math.sin(t/1 * (Math.PI/2));
    },
    easeInOutSine: function (t) {
      return -1/2 * (Math.cos(Math.PI*t/1) - 1);
    },
    easeInExpo: function (t) {
      return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1));
    },
    easeOutExpo: function (t) {
      return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1);
    },
    easeInOutExpo: function (t) {
      if (t==0) return 0;
      if (t==1) return 1;
      if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
      return 1/2 * (-Math.pow(2, -10 * --t) + 2);
      },
    easeInCirc: function (t) {
      if (t>=1) return t;
      return -1 * (Math.sqrt(1 - (t/=1)*t) - 1);
    },
    easeOutCirc: function (t) {
      return 1 * Math.sqrt(1 - (t=t/1-1)*t);
    },
    easeInOutCirc: function (t) {
      if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
      return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },
    easeInElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
    },
    easeOutElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
    },
    easeInOutElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
      return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p )*.5 + 1;
    },
    easeInBack: function (t) {
      var s = 1.70158;
      return 1*(t/=1)*t*((s+1)*t - s);
    },
    easeOutBack: function (t) {
      var s = 1.70158;
      return 1*((t=t/1-1)*t*((s+1)*t + s) + 1);
    },
    easeInOutBack: function (t) {
      var s = 1.70158; 
      if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
      return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },
    easeInBounce: function (t) {
      return 1 - animationOptions.easeOutBounce (1-t);
    },
    easeOutBounce: function (t) {
      if ((t/=1) < (1/2.75)) {
        return 1*(7.5625*t*t);
      } else if (t < (2/2.75)) {
        return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
      } else if (t < (2.5/2.75)) {
        return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
      } else {
        return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
      }
    },
    easeInOutBounce: function (t) {
      if (t < 1/2) return animationOptions.easeInBounce (t*2) * .5;
      return animationOptions.easeOutBounce (t*2-1) * .5 + 1*.5;
    }
  }

  var requestAnimationFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  function closestElement (element, array) {
    return array.reduce(function (prev, curr) {
      return (Math.abs(curr - element) < Math.abs(prev - element) ? curr : prev);
    });
  }

  function forEach (items, action) {
    for (var i = 0, l = items.length; i < l; i++) {
      action(items[i]);
    };
  }

  function getDatasetFrom (data, type, colors) {
    var index = 0
      , color
      , datasets = []
      ;

    if (data === undefined)
      throw new Error("No data");
      
    forEach(data, function(set) {
      // pick a color
      if (colors[index] != undefined) {
        color = tinycolor(colors[index]).toRgbString();
      }
      else {
        var offset=1, indexCopy = index;
        while(indexCopy/colors.length >= 1){
          offset++;
          indexCopy -= colors.length;
        }
        color = tinycolor.darken(colors[indexCopy], 5*offset).toRgbString();
      }
      datasets.push(new Chartmander.components.dataset(set, color, type));
      index++;
    });
    return datasets;
  }

  function getArrayBy (data, property, exclusiveEntry) {
    var result = []
      , streamID = 0;

    forEach(data, function (set) {
      if (exclusiveEntry && streamID == 1) return result;
      result = result.concat(set.values.map(function (element) {
        return element[property];
      }));
      streamID++;
    });
    return result;
  }

  function getRange (values) {
    return {
      "min": Math.min.apply(null, values),
      "max": Math.max.apply(null, values)
    }
  }

  function getAxesFrom (datasets) {
    var xLabels = []
      , yLowest = 0
      , yHighest = 0
      ;

    // Labels filter
    forEach(datasets, function (set) {
      set.each(function (bar) {
        if(indexOf.call(xLabels, bar.label) === -1 )
          xLabels.push(bar.label);

        if(bar.value > yHighest)
          yHighest = bar.value;

        if(bar.value < yLowest)
          yLowest = bar.value
      })
    })

    return [new xAxis(xLabels), new yAxis([yLowest, yHighest])];
  }

  var indexOf = function (element) {
    if (typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function(element) {
        var i = -1, index = -1;

        for(i = 0; i < this.length; i++) {
          if(this[i] === element) {
            index = i;
            break;
          }
        }

        return index;
      };
    }

    return indexOf.call(this, element);
  };

Chartmander.models.chart = function (canvasID) {

  var chart = this;

  var canvas = document.getElementById(canvasID)
    , ctx = canvas.getContext('2d')
    , datasets = []
    , width = ctx.canvas.width
    , height = ctx.canvas.height
    , margin = { top: 0, right: 0, bottom: 0, left: 0 }
    , colors = ["blue", "green", "red"]
    , font = "13px Arial, sans-serif"
    , fontColor = "#555"
    , animate = true
    , hovered = false
    , animationSteps = 100
    , animationCompleted = 0
    , easing = "easeOutCubic"
    // , onAnimationCompleted = null
    , mouse = { x: 0, y: 0 }
    , hoverNotFinished = false
    ;

  // var tip = Chartmander.components.tooltip();

  // this.crosshair = {
  //   x: null,
  //   y: null,
  //   visible: true,
  //   sticky: true,
  //   color: "#555",
  //   lineWidth: 1
  // };

  canvas.addEventListener("mouseenter", handleEnter, false);
  canvas.addEventListener("mousemove", handleHover, false);
  canvas.addEventListener("mouseleave", handleLeave, false);

  if (window.devicePixelRatio) {
    ctx.canvas.style.width = width + "px";
    ctx.canvas.style.height = height + "px";
    ctx.canvas.height = height * window.devicePixelRatio;
    ctx.canvas.width = width * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  var clear = function () {
    ctx.clearRect(0, 0, width, height);
  };

  var draw = function (drawComponents, finished) {
    var easingFunction = easings[easing]
      , animationIncrement = 1/animationSteps
      , _perc_
      ;

    animationCompleted = animate ? 0 : 1;

    function loop () {

      if (finished) {
        animationCompleted = 1;
      } else if (animationCompleted < 1) {
        animationCompleted += animationIncrement;
      }

      _perc_ = easingFunction(animationCompleted);
      hoverNotFinished = false;
      clear();

      drawComponents(_perc_);
      // tip.removeItems();

      // if (cfg.type === "line") {
      //   chart.itemsInHoverRange = [];
      //   chart.updatePoints(_perc_);
      //   if (cfg.drawArea) {
      //     chart.drawArea(_perc_);
      //   }
      //   chart.drawLines();
      //   chart.grid.drawCrosshairInto(chart);
      //   chart.drawPoints();
      // } else if (cfg.type === "bar") {
      //   chart.drawBars(_perc_);
      // } else if (cfg.type === "pie") {
      //   chart.drawSlices(_perc_);
      // }

      // if (tip) {
      //   if (tip.hasItems()) {
      //     tip.recalc(chart.ctx);
      //   }
      //   tip.drawInto(chart);
      // }

      // if (cfg.legend) {
      //   ctx.save();
      //   // ctx.font = "18px Arial";
      //   var legendWidth = 100, counter = 0;
      //   forEach(chart.datasets, function (set) {
      //     var left = chart.getGridProperties().width-200+counter*legendWidth
      //     ctx.fillStyle = set.style.color;
      //     ctx.fillRect(left-15, chart.getGridProperties().top/2-5, 10, 10);
      //     ctx.fillStyle = "#000";
      //     ctx.fillText(set.title, left, chart.getGridProperties().top/2);
      //     counter++;
      //   });
      //   ctx.restore();
      // }

      // Request self-repaint if chart or tooltip or data element has not finished animating yet

      // if (animationCompleted < 1 || (tip.getState() > 0 && tip.getState() < 1) || hoverNotFinished ) {
      if (animationCompleted < 1 || hoverNotFinished ) {
        requestAnimationFrame(loop);
      }
      else {
        console.log("Animation Finished.")
      }
    }
    // Ignite
    requestAnimationFrame(loop);
  }

  function handleHover (event) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    // Allow repaint on hover only if chart and tooltip are done with self-repaint
    // AND if also hovered item is not repainting 
    // if (animationCompleted >= 1 && !tooltip.isAnimated() && !config.hoverNotFinished ) {
    if (animationCompleted >= 1 ) {
      chart.drawFull();
    }
  }

  function handleEnter () {
    hovered = true;
  }

  function handleLeave () {
    hovered = false;
    // chart.tooltip.removeItems();
    if (animationCompleted >= 1)
      chart.drawFull();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.draw = draw;
  chart.ctx = ctx;

  chart.width = function () {
    return width;
  }

  chart.height = function () {
    return height;
  }

  chart.mouse = function (_) {
    if(!arguments.length) return mouse;
    mouse.x = typeof _.x != 'undefined' ? _.x : mouse.x;
    mouse.y = typeof _.y != 'undefined' ? _.y : mouse.y;
    return chart;
  }

  chart.completed = function (_) {
    if(!arguments.length) return animationCompleted;
    animationCompleted = _;
    return chart;
  }

  chart.setsCount = function () {
    return datasets.length;
  }

  chart.datasets = function (_) {
    if(!arguments.length) return datasets;
    datasets = _;
    return chart;
  }

  chart.elementCount = function () {
    var total = 0;
    forEach(datasets, function (set) {
      total += set.elementCount();
    });
    return total;
  }

  // this.title = function (_) {
  //   if(!arguments.length) return this.config.title;
  //   this.config.title = _;
  //   return this;
  // }

  // this.showXAxis = function (_) {
  //   this.config.xAxisVisible = _;
  //   return chart;
  // }

  // this.showYAxis = function (_) {
  //   this.config.yAxisVisible = _;
  //   return chart;
  // }

  // line char
  // this.pointRadius = function (_) {
  //   this.config.pointRadius = _;
  //   return chart;
  // }
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  }

  chart.colors = function (_) {
    if(!arguments.length) return colors;
    colors = _;
    return chart;
  }

  chart.fontColor = function (_) {
    if (!arguments.length) return fontColor;
    fontColor = _;
    return chart;
  }

  chart.hovered = function (_) {
    if (!arguments.length) return hovered;
    hovered = _;
    return chart;
  }

  chart.font = function (_) {
    if (!arguments.length) return font;
    font = _;
    return chart;
  }

  chart.easing = function (_) {
    if (!arguments.length) return easing;
    easing = _;
    return chart;
  }

  return chart;
}

Chartmander.models.pieChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas)
    , type = "pie"
    , center = { x: chart.width()/2, y: chart.height()/2 }
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
      slice.updatePosition(rotateAnimation ? _perc_ : 1);
      slice.drawInto(chart, set);
    });
    chart.ctx.restore();
  }


  var render =  function (data) {
    if (chart.setsCount() == 0) {
      chart.datasets(getDatasetFrom(data, type, chart.colors()));
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

Chartmander.models.barChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var type = "bar"
    , stacked = false
    , maxBarWidth = 30
    , datasetSpacing = 0
    , barWidth = maxBarWidth
    , groupWidth = 0
    , groupOffset = 0
    , xAxisVisible = true
    , yAxisVisible = true
    ;

  chart.margin({ top: 30, right: 40, bottom: 30, left: 100 });

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis = new Chartmander.components.xAxis()
    , yAxis = new Chartmander.components.yAxis()
    , grid  = new Chartmander.components.grid()
    ;

  var render =  function (data) {
    console.log(Chartmander.charts)
    if (chart.setsCount() == 0) {
      var xrange = getRange(getArrayBy(data, "label"));
      var yrange = getRange(getArrayBy(data, "value"));

      chart.datasets(getDatasetFrom(data, type, chart.colors()));
      // grid before axes
      grid.adapt(chart.width(), chart.height(), chart.margin());
      // axes use grid height to calculate their scale
      xAxis.adapt(chart, xrange);
      yAxis.adapt(chart, yrange);
      recalcBars();
      chart.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcBars(true);
      chart.completed(0);
      chart.draw(drawComponents, false)
    }
  }

  var recalcBars = function () {
    var counter = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );
    // leftFix = (barWidth*bars.setsCount())/2;

    // faux
    // yAxis.margin(leftFix + 10);

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() + (bar.label()-xAxis.min())/xAxis.scale() + counter*barWidth;
        y = -bar.value()/yAxis.scale();
        bar.savePosition(grid.width()/2, 0).moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
      });
      counter++;
    });
  }

  var drawBars = function (_perc_) {
    var counter = 0;
    ctx.save();
    forEach(chart.datasets(), function (set) {
      ctx.fillStyle = set.color();
      // ctx.lineWidth = set.style.normal.stroke;
      // ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        // console.log(bar.value())
        bar.updatePosition(_perc_);
        bar.updatePositionBase(_perc_);
        bar.drawInto(chart, set);
      })
      counter++;
    })
    ctx.restore();
  }

 // var update = function (data) {
 //    var i = 0
 //      , xValues = getArrayBy(data, "label")
 //      , yValues = getArrayBy(data, "value")
 //      , xRange = getRange(xValues)
 //      , yRange = getRange(yValues)
 //      ;

 //    // Recalc Axeslo

 //    chart.yAxis.min(yRange.min).max(yRange.max);
 //    // chart.yAxis.recalc(chart);
 //    chart.xAxis.min(xRange.min).max(xRange.max);
 //    // chart.xAxis.recalc(chart);

 //    // Recalc sets
 //    forEach(bars.datasets(), function (set) {
 //      if (data[i] === undefined)
 //        throw new Error("Missing dataset. Dataset count on update must match.")

 //      set.merge(data[i], chart);

 //      set.each(function (bar) {
 //        bar.savePosition().moveTo(false, - bar.value()/yAxis.scale()).saveBase().moveBase(chart.base());
 //      });
 //      i++;
 //    });

 //    chart.completed(0);
 //    draw();
 //  }

  var drawComponents = function (_perc_) {

    grid.drawInto(chart, _perc_);

    xAxis.fadeIn();
    xAxis.drawInto(chart, _perc_);

    yAxis.fadeIn();
    yAxis.drawInto(chart, _perc_);
    drawBars(_perc_);

  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;

  chart.render = render;
  chart.drawFull = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  chart.barWidth = function (_) {
    if(!arguments.length) return barWidth; // Internal
    maxBarWidth = _; // User defined
    return chart;
  }

  chart.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return chart;
  }

  return chart;
}

Chartmander.models.lineChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var type = "line"
    , lineWidth = 2
    , pointRadius = 5
    , pointHoverRadius = 20
    , drawArea = true
    , areaOpacity = .5
    , mergeHover = true
    , xAxisVisible = true
    , yAxisVisible = true
    ;

  chart.margin({ top: 30, right: 50, bottom: 50, left: 50 });

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis = new Chartmander.components.xAxis()
    , yAxis = new Chartmander.components.yAxis()
    , grid  = new Chartmander.components.grid()
    ;

  var render =  function (data) {
    if (chart.setsCount() == 0) {
      var xrange = getRange(getArrayBy(data, "label"));
      var yrange = getRange(getArrayBy(data, "value"));

      chart.datasets(getDatasetFrom(data, type, chart.colors()));
      // grid before axes
      grid.adapt(chart.width(), chart.height(), chart.margin());
      // axes use grid height to calculate their scale
      xAxis.adapt(chart, xrange);
      yAxis.adapt(chart, yrange);
      recalcPoints();
      chart.draw(drawComponents, false);
    }
    else {
      update(data);
      recalcPoints(true);
      chart.completed(0);
      chart.draw(drawComponents, false)
    }
  }


  var recalcPoints = function () {
    var x, y;

    forEach(chart.datasets(), function (set) {
      set.each(function (point) {
        x = Math.ceil(grid.left() + (point.label()-xAxis.min())/xAxis.scale());
        y = chart.base()- point.value()/yAxis.scale();
        point.savePosition(grid.width()/2, chart.base()).moveTo(x, y);
      })
    });
  }

  var updatePoints = function (_perc_) {
    forEach(chart.datasets(), function (set) {
      set.each(function (point) {
        point.updatePosition(_perc_);
      })
    });
  }

  var drawArea = function () {
    ctx.save();

    forEach(chart.datasets(), function (set) {
      ctx.fillStyle = set.color();
      ctx.globalAlpha = areaOpacity;

      ctx.beginPath();
      ctx.moveTo(set.getElement(0).x(), chart.base());
      ctx.lineTo(set.getElement(0).x(), set.getElement(0).y());
      set.each(function (point) {
        ctx.lineTo(point.x(), point.y());
      });
      ctx.lineTo(set.getElement("last").x(), chart.base());
      ctx.fill();
    });

    ctx.restore();
  }

  var drawLines = function () {
    ctx.save();
    ctx.lineWidth = lineWidth;
    forEach(chart.datasets(), function (set) {
      ctx.strokeStyle = set.color();
      ctx.beginPath();
      set.each(function (point) {
        ctx.lineTo(point.x(), point.y());
      });
      ctx.stroke();
    });
    ctx.restore();
  }

  var drawPoints = function () {
    ctx.save();
    forEach(chart.datasets(), function (set) {
      var hoveredInThisSet = []
        , closestHovered
        ;

      ctx.strokeStyle = set.color();
      ctx.fillStyle = set.color();

      set.each(function (point) {
        point.drawInto(chart, set);
      });

      // Get items only from current set
      // forEach(chart.itemsInHoverRange, function (item) {
      //   if (item.set == set.title) {
      //     hoveredInThisSet.push(item);
      //   }
      // });

      // Find closest hovered
      // for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
      //   if (i == 0) {
      //     closestHovered = hoveredInThisSet[i];
      //     continue;
      //   }
      //   if (hoveredInThisSet[i].hoverDistance < closestHovered.hoverDistance) {
      //     closestHovered = hoveredInThisSet[i];
      //   }
      // }

      // Control Hovered
      // for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
      //   if (hoveredInThisSet[i] === closestHovered) {
      //     set.elements[closestHovered.index].animIn();
      //     chart.tooltip.addItem({
      //         set: set.title,
      //         label: set.elements[closestHovered.index].label,
      //         value: set.elements[closestHovered.index].value,
      //         color: set.style.normal.color
      //       })
      //     if (set.elements[closestHovered.index].isAnimated()){
      //       hoverNotFinished = true;
      //     }
      //   } else {
      //     set.elements[hoveredInThisSet[i].index].animOut();
      //   }
      // }
    });
    ctx.restore();
  }

  // chart.update = function (data) {
  //   var i = 0
  //     , xValues = getArrayBy(data, "label")
  //     , yValues = getArrayBy(data, "value")
  //     , xRange = getRange(xValues)
  //     , yRange = getRange(yValues)
  //     ;

  //   // Recalc Axes
  //   chart.yAxis.dataMin = yRange.min;
  //   chart.yAxis.dataMax = yRange.max;
  //   chart.yAxis.recalc(chart);

  //   chart.xAxis.dataMin = xRange.min;
  //   chart.xAxis.dataMax = xRange.max;
  //   chart.xAxis.recalc(chart);

  //   // Recalc sets
  //   forEach(line.datasets, function (set) {
  //     if (data[i] === undefined)
  //       throw new Error("Missing dataset. Dataset count on update must match.")
  //     set.merge(data[i], chart);
  //     set.each(function (point) {
  //       var x = chart.getGridProperties().left + (point.label - chart.xAxis.dataMin)/chart.xAxis.scale()
  //         , y = chart.base() - point.value/chart.yAxis.scale();

  //       point.moveTo(x, y);
  //     });
  //     i++;
  //   });

  //   chart.animationCompleted = 0;
  //   chart.draw();
  // }

  var drawComponents = function (_perc_) {

    grid.drawInto(chart, _perc_);

    xAxis.fadeIn();
    xAxis.drawInto(chart, _perc_);

    yAxis.fadeIn();
    yAxis.drawInto(chart, _perc_);

    updatePoints(_perc_);
    drawArea();
    drawLines();
    drawPoints();
    
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;

  chart.render = render;
  chart.drawFull = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  chart.areaVisible = function (_) {
    if (!arguments.length) return drawArea;
    drawArea = _;
    return chart;
  }

  chart.lineWidth = function (_) {
    if (!arguments.length) return lineWidth;
    lineWidth = _;
    return chart;
  }

  chart.pointRadius = function (_) {
    if (!arguments.length) return pointRadius;
    pointRadius = _;
    return chart;
  }

  chart.pointHoverRadius = function (_) {
    if (!arguments.length) return pointHoverRadius;
    pointHoverRadius = _;
    return chart;
  }

  chart.mergeHover = function (_) {
    if (!arguments.length) return mergeHover;
    mergeHover = _;
    return chart;    
  }

  return chart;
};

Chartmander.components.dataset = function (set, color, type) {

  var dataset = this;

  var title = set.title
    , elements = getElements(type)
    , normal = {
        color: tinycolor.lighten(color, 5).toHex(),
        strokeColor: tinycolor.darken(color, 10).toHex()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHex(),
        strokeColor: tinycolor.darken(color, 20).toHex()
    }
    ;


  function getElements (type) {
    var result = [];
    switch (type) {
      case "bar": forEach(set.values, function (bar) {
              result.push(new Chartmander.components.bar(bar, set.title));
            });
            break;
      case "pie": forEach(set.values, function (slice) {
              result.push(new Chartmander.components.slice(slice, set.title));
            });
            break;
      case "line": forEach(set.values, function (point) {
              result.push(new Chartmander.components.point(point, set.title));
            });
            break;
      default: return;
    }
    return result;
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  dataset.each = function (action) {
    forEach(elements, action);
  }

  dataset.size = function () {
    var total = 0;
    dataset.each(function (element) {
      total += element.value();
    })
    return total;
  }

  dataset.elementCount = function () {
    return elements.length;
  }

  // dataset.merge = function (newData, chart) {
  //   var newElements = newData.values
  //     , oldElements = dataset.elements
  //     ;

  //   // Test equality of datastream
  //   if (dataset.title != newData.title) {
  //     throw new Error("Different datastream on update!");
  //   }

  //   // Update existing elements, if new > old add new elements
  //   for (var i=0, len=newElements.length; i != len; i++) {
  //     // Update existing
  //     if (oldElements[i] instanceof Element) {
  //       dataset.elements[i].updateValue(newElements[i].label, newElements[i].value).savePosition();
  //     }
  //     // Create
  //     else {
  //       var element = new Element(newElements[i], dataset.title);

  //       if (dataset.type == "bar")
  //         element = element.Bar();
  //       else if (dataset.type == "line")
  //         element = element.Point();
  //       // Each segment in pieChart is dataset with only one element therefore next lines will never get executec
  //       // else if (dataset.type == "pie")
  //       //   element = element.Segment();
  //       dataset.elements.push(element.savePosition(chart.getGridProperties().width, chart.getBase()));
  //     }
  //   }
  //   // Flush old 
  //   if (oldElements.length > newElements.length) {
  //     for (var j=oldElements-newElements; j!=0; j--) {
  //       // supr FAUX
  //       console.log("Delete");
  //       dataset.elements[oldElements-j].die();
  //     }
  //   }
  // }

  dataset.getElement = function (index) {
    if (index == "last")
      return elements[elements.length-1];
    else
      return elements[index];
  }

  dataset.els = function () {
    return elements;
  }


  dataset.color = function (_) {
    if(!arguments.length) return normal.color;
    normal.color = _;
    return dataset;
  }

  dataset.hoverColor = function (_) {
    if(!arguments.length) return hover.color;
    hover.color = _;
    return dataset;
  }

  return dataset;
}

Chartmander.components.grid = function () {

  var grid = this
    , horizontalLines = true
    , verticalLines = true
    , lineColor = "#DBDFE5"
    , lineWidth = 1
    // , evenOddContrast = true
    // , oddColor = "#EAEAEA"
    ;

  // Properties/margins
  var width = 0
    , height = 0
    , top = 0
    , right = 0
    , bottom = 0
    , left = 0
    ;

  ///////////////////////
  // Func
  ///////////////////////

  var adapt = function (w, h, margin) {
    top = margin.top;
    right = w - margin.right;
    bottom = h - margin.bottom;
    left = margin.left;
    width = w - margin.right - margin.left;
    height = h - margin.bottom - margin.top;
  }

  var drawInto = function (chart, _perc_) {
    var ctx = chart.ctx;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    if (horizontalLines) {
      ctx.save();
      ctx.globalAlpha = chart.yAxis.opacity();
      forEach(chart.yAxis.labels(), function (line) {
        ctx.beginPath();
        if (line.label() == 0) {
          ctx.save();
          ctx.strokeStyle = "#999"; // TODO Axis Width and Color
        }
        ctx.moveTo(left, line.y());
        ctx.lineTo(right, line.y());
        ctx.stroke();
        if (line.label==0) ctx.restore();
      })
      ctx.restore();
    }

    if (verticalLines) {
      for (var i = 0; i < chart.xAxis.labels().length+1; i++) {
        var xOffset = chart.grid.left() + i*(chart.grid.width() / chart.xAxis.labels().length);

        ctx.beginPath();
        ctx.moveTo(xOffset, top);
        ctx.lineTo(xOffset, bottom);
        ctx.stroke();
      };
    }
  }

  var hasInRangeX = function (point) {
     return point.x() >= left && point.x() <= right;
  }

  // grid.drawCrosshairInto = function (chart) {

  //   var crosshair = chart.crosshair;

  //   if (crosshair.visible && chart.config.hovered) {
  //     chart.ctx.save();
  //     chart.ctx.strokeStyle = crosshair.color;
  //     chart.ctx.lineWidth = crosshair.lineWidth;

  //     if (chart.grid.hasInRangeX(chart.config.mouse)) {
  //       crosshair.x = chart.getMouse("x");
  //       if (crosshair.sticky && chart.itemsInHoverRange.length > 0) {
  //         var availablePoints = [];

  //         forEach(chart.hoveredItems, function (point) {
  //           availablePoints.push(point.position.x);
  //         })
  //         crosshair.x = closestElement(crosshair.x, availablePoints);
  //       }
  //     }
  //     else
  //       return;

  //     chart.ctx.beginPath();
  //     chart.ctx.moveTo(crosshair.x, grid.config.properties.top);
  //     chart.ctx.lineTo(crosshair.x, grid.config.properties.bottom);
  //     chart.ctx.stroke();
  //     chart.ctx.restore();
  //   }
  // }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.adapt = adapt;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return grid;
  }

  grid.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return grid;
  }

  grid.bottom = function (_) {
    if (!arguments.length) return bottom;
    bottom = _;
    return grid;
  }

  grid.left = function (_) {
    if (!arguments.length) return left;
    left = _;
    return grid;
  }

  grid.lineColor = function (_) {
    if (!arguments.length) return lineColor;
    lineColor = _;
    return grid;
  }

  grid.horizontalLines = function (_) {
    if (!arguments.length) return horizontalLines;
    horizontalLines = _;
    return grid;
  }

  grid.verticalLines = function (_) {
    if (!arguments.length) return verticalLines;
    verticalLines = _;
    return grid;
  }

  return grid;
}

Chartmander.components.axis = function () {

  var axis = this;

  var labels = []
    , labelSpace = 0
    , dataMin = 0
    , dataMax = 0
    , scale = 1
    , delta = 0
    , format = ""
    , opacity = 0;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////


  axis.min = function (_) {
    if (!arguments.length) return dataMin;
    dataMin = _;
    return axis; 
  }

  axis.max = function (_) {
    if (!arguments.length) return dataMax;
    dataMax = _;
    return axis;
  }

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  }
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  }

  axis.each = function (action) {
    forEach(labels, action);
  }

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  }

  axis.getLabel = function (index) {
    return labels[index];
  }

  axis.opacity = function () {
    return opacity;
  }

  axis.fadeIn = function () {
    opacity += .05;
    if (opacity > 1)
      opacity = 1;
  }

  axis.fadeOut = function () {
    opacity -= .05;
    if (opacity < 0)
      opacity = 0;
  }

  axis.delta = function (_) {
    if (!arguments.length) return delta;
    delta = _;
    return axis;
  }

  return axis;
}

Chartmander.components.xAxis = function () {

  var axis = new Chartmander.components.axis();

  // rename to timeAxis ?
  // make another numberAxis and category
  // implement in chart as x/y with options horizontal/vertical  aligned top, bottom or left,right

  var recalc = function (chart) {

    var steps = [
        {
          "days": 1,
          "label": "days"
        },
        {
          "days": 7,
          "label": "weeks"
        },
        {
          "days": 30,
          "label": "months"
        },
        {
          "days": 365,
          "label": "years"
        }
      ]
      , dayMSec = 60*60*24*1000
      , daysInRange = axis.delta()/dayMSec
      , startDate = moment(axis.min())
      , stepIndex = steps.length
      , labelCount = 0
      , labels = [];

    // Time per pixel
    axis.scale(axis.delta()/chart.grid.width());

    while (labelCount < 1) {
      stepIndex--;
      labelCount = daysInRange/steps[stepIndex].days;
    }

    labelsCount = Math.round(labelCount);
    for (var i = 0; i < labelCount; i++) {
      var label = moment(startDate).add(steps[stepIndex].label, i);
      axis.labels().push(label.valueOf());
    }
  }

  var drawInto = function (chart) {
    var ctx = chart.ctx
      , topOffset = chart.grid.bottom() + 25;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = axis.opacity();
    axis.each(function (label) {
      var leftOffset = chart.margin().left + (label-chart.xAxis.min())/chart.xAxis.scale();
      ctx.fillText(moment(label).format(axis.format()), leftOffset, topOffset);
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.adapt = function (chart, range) {
    axis.min(range.min).max(range.max).delta(axis.max() - axis.min());
    recalc(chart);
    return axis;
  }

  return axis;
}

Chartmander.components.yAxis = function (min, max) {

  var axis = new Chartmander.components.axis();

  var unit = ""
    , abbr = false
    , margin = 10 // Offset from grid
    , zeroLevel = 0
    , labelSteps = [1, 2, 5];


  // maybe rename to generate ... racalc is about scale - put it inside of adapt method 

  var recalc = function (chart) {

    var height = chart.grid.height()
      , maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
      , stepBase = axis.delta().toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelSteps);
    axis.labels( getLabels(getAxeSetup(stepBase, stepExponent)) );

    axis.scale(axis.delta()/height);
    zeroLevel = height - axis.max()/axis.scale();

    // Set Positions for labels
    for (var i=0, len=axis.labels().length; i<len; i++) {
      var label = axis.getLabel(i)
        , previous;
      
      if (label.value() < 0)
        previous = axis.getLabel(i+1);
      else if (label.value() > 0)
        previous = axis.getLabel(i-1);
      else if (label.value() == 0) {
        label.startAt(chart.base()).moveTo(false, chart.base());
        continue;
      }
      label.startAt(chart.base() - previous.value()/axis.scale()).moveTo(false, chart.base() - label.value()/axis.scale());
    }

    function getLabels (setup) {
      var labels = []
        , lefts = setup.labelCount
        , step = setup.valueStep
        , currLabel = 0
        , labelData = {
          label: 0,
          value: 0
        };

      labels.push(new Chartmander.components.label(labelData, "axis"));

      while ( -(axis.min() - currLabel) > step) {
        currLabel = currLabel - step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.splice(0, 0, new Chartmander.components.label(labelData, "axis"));
      }

      currLabel = 0;

      while ( (axis.max() - currLabel) > step) {
        currLabel = currLabel + step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.push(new Chartmander.components.label(labelData, "axis"))
      }

      return labels;
    }

    function getAxeSetup (base, exponent, stop) {
      var currIndex = indexOf.call(labelSteps, base)
        , newIndex
        , newExponent
        , currLabelValueStep = Math.pow(10, exponent)*base
        , currLabelCount = axis.delta()/currLabelValueStep
        ;

      if (stop)
        return {
          valueStep: currLabelValueStep,
          labelCount: Math.floor(currLabelCount)
        };

      // Debug
      // console.log("curr Index ", currIndex, " exponent", exponent, " currLabelValueStep ", currLabelValueStep, " labelCount ", currLabelCount, " maxLabelCount ", maxLabelCount )
      
      if (currLabelCount < maxLabelCount) {
        // Maybe there is space for more labels...
        newIndex = (currIndex - 1 <= -1) ? 2 : (currIndex - 1);
        newExponent = (newIndex == 2) ? (exponent - 1) : exponent;

        return getAxeSetup(labelSteps[newIndex], newExponent);
      }
      else {
        // Too far, return previous and stop
        newIndex = (currIndex + 1 >=  3) ? 0 : (currIndex + 1);
        newExponent = (newIndex == 0) ? (exponent + 1) : exponent;

        return getAxeSetup(labelSteps[newIndex], newExponent, true);
      }
    }
  }

  var drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , grid = chart.grid
      ;

    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = axis.opacity();
    forEach(axis.labels(), function (label) {
      // var labelValue = abbr ? (label.label()/1000).toString() : label.label().toString();
      label.updatePosition(_perc_);
      ctx.fillText(label.label().toString() + " " + unit, grid.left() - margin, label.y());
    });
    // if (axis.newConfig.labels.length > 0) {
    //   ctx.save();
    //   ctx.globalAlpha = axis.newConfig.opacity;
    //   forEach(axis.newConfig.labels, function (label) {
    //     var labelValue = abbr ? (label.label()/1000).toString() : label.label().toString();
    //     label.updatePosition(_perc_);
    //     ctx.fillText(labelValue + " " + axis.unit(), grid.left - margin, label.getY());
    //   });
    //   ctx.restore();

    //   axis.fadeIn("new");
    //   axis.fadeOut("current");
    //   if (axis.newConfig.opacity == 1) {
    //     // axis.config=axis.newConfig;
    //     labels = axis.newConfig.labels;
    //     opacity = axis.newConfig.opacity;

    //     // Reset values for next update
    //     axis.newConfig.labels = [];
    //     axis.newConfig.opacity = 0;
    //   }
    // }
    // else {
    //   axis.fadeIn("current");
    // }
    ctx.restore();
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.unit = function (_) {
    if(!arguments.length) return unit;
    unit = _;
    return axis;
  }

  axis.zeroLevel = function (_) {
    if(!arguments.length) return zeroLevel;
    zeroLevel = _;
    return axis;
  }

  axis.margin = function (_) {
    if(!arguments.length) return margin;
    margin = _;
    return axis;
  }

  axis.adapt = function (chart, range) {
    axis.min(range.min).max(range.max).delta(axis.max() - (axis.min() > 0 ? 0 : axis.min()));
    recalc(chart);
    return axis;
  }

  return axis;
}

Chartmander.components.element = function (data, title) {

  var element = this;

  var set = title
    , label = data.label
    , value = data.value
    , isAnimated = false
    , animationCompleted = 0 // normal => 0, hover => 1
    // , pendingDelete: false,
    // Actual position
    , now = {
        x: 0,
        y: 0
      }
    // Starting position
    , from = {
        x: 0,
        y: 0
      }
    // Destination
    , to = {
        x: 0,
        y: 0
      }
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  element.label = function (_) {
    if(!arguments.length) return label;
    label = _;
    return element;
  }

  element.value = function (_) {
    if(!arguments.length) return value;
    value = _;
    return element;
  }

  element.x = function (_) {
    if(!arguments.length) return now.x;
    now.x = _;
    return element;
  }

  element.y = function (_) {
    if(!arguments.length) return now.y;
    now.y = _;
    return element;
  }

  element.moveTo = function (x, y) {
    if (x!=false)
      to.x = x;
    if(y!=false)
      to.y = y;
    return element;
  }

  element.updatePosition = function (_perc_) {
    var deltaX = from.x - to.x
      , deltaY = from.y - to.y
      ;
    now.x = from.x - deltaX*_perc_;
    now.y = from.y - deltaY*_perc_;
    // console.log(now.x, now.y)
  }

  element.savePosition = function (x, y) {
    if (!arguments.length) {
      from.x = now.x;
      from.y = now.y;
    } else {
      from.x = x;
      from.y = y;
    }
    return element;
  }
  
  element.isAnimated = function (_) {
    if(!arguments.length) return isAnimated;
    isAnimated = _;
    return element;
  }

  element.getState = function () {
    return animationCompleted;
  }

  element.animIn = function () {
    isAnimated = true;
    animationCompleted += .07;
    if (animationCompleted >= 1) {
      isAnimated = false;
      animationCompleted = 1;
    }
  }

  element.animOut = function () {
    isAnimated = true;
    animationCompleted -= .07;
    if (animationCompleted <= 0) {
      isAnimated = false;
      animationCompleted = 0;
    }
  }

  // this.resetPosition = function (chart, yStart) {
  //   if(!isNaN(yStart))
  //     from.y = yStart;
  //   else
  //     from.y = chart.getBase();
  //   this.moveTo(false, chart.getBase() - value/chart.yAxis.VPP());
  // }

  return element;
}

Chartmander.components.slice = function (data, title) {

  /*
  ** IMPORTANT
  ** Slice uses X, Y methods but they refer to Start and End values
  */

  var slice = new Chartmander.components.element(data, title);

  var sliceIsHovered = function (pie) {
    var x = pie.mouse().x - pie.center().x
      , y = pie.mouse().y - pie.center().y
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter <= pie.radius() && fromCenter >= pie.radius()*pie.innerRadius()) {
      hoverAngle = Math.atan2(y, x) - pie.startAngle();
      if (hoverAngle < 0) {
        hoverAngle += Math.PI*2;
      }
      if (hoverAngle >= slice.x() && hoverAngle <= slice.y()) {
        hovered = true;
      }
    }

    return hovered;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  slice.drawInto = function (pie, set) {
    pie.ctx.beginPath();
    // Check if this slice was hovered
    if (pie.hovered()) {
      if (sliceIsHovered(pie)) {
        pie.ctx.fillStyle = set.hoverColor();
        // pie.tooltip.addItem({
        //   "set": set.title,
        //   "label": slice.label,
        //   "value": slice.value,
        //   "color": set.style.normal.color
        // });
      }
    }
    pie.ctx.arc(pie.center().x, pie.center().y, pie.radius(), pie.startAngle()+slice.x(), pie.startAngle()+slice.y());
    pie.ctx.arc(pie.center().x, pie.center().y, pie.radius()*pie.innerRadius(), pie.startAngle()+slice.y(), pie.startAngle()+slice.x(), true);
    pie.ctx.fill();
  }

  return slice;
};

Chartmander.components.bar = function (data, title) {

  var bar = new Chartmander.components.element(data, title);

  var base = {
        from: 0,
        to:   0,
        now:  0
      }
      ;

  drawInto = function (chart, set) {
    var ctx = chart.ctx;

    if (isHovered(chart)) {
      ctx.save();
      ctx.fillStyle = set.hoverColor();
      // ctx.strokeStyle = style.onHover.strokeColor;
      // chart.tooltip.addItem({
      //   "set": set.title
      //   "label": bar.label,
      //   "value": bar.value,
      //   "color": style.normal.color
      // });
    }

    ctx.fillRect(bar.x(), bar.base(), chart.barWidth(), bar.y());
    // if (style.normal.stroke > 0)
      // ctx.strokeRect(bar.x(), bar.getBase(), chart.barWidth(), bar.y());

    // if (hover) {
    //   if (style.onHover.stroke > 0)
    //     ctx.strokeRect(bar.x(), bar.getBase(), cfg.barWidth, bar.y());
    //   ctx.restore();
    // }

    // if (chart.displayValue()) {
    //   ctx.save();
    //   ctx.fillStyle = tinycolor.darken(set.color(), 30).toHex();
    //   ctx.translate(bar.x(), chart.getBase() - 20);
    //   ctx.rotate(-Math.PI/2);
    //   ctx.fillText(bar.value/1000, 0, 15);
    //   ctx.restore();
    // }

  }

  isHovered = function (chart) {
    var x = chart.mouse("x")
      , y = chart.mouse("y")
      , cfg = chart.config
      , hovered = false
      , yRange = [bar.base(), bar.base()+bar.y()].sort(function(a,b){return a-b})
      ;

    if (x >= bar.x() && x <= bar.x()+cfg.barWidth && y >= yRange[0] && y<= yRange[1]) {
      hovered = true;
    }

    return hovered;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  bar.drawInto = drawInto;

  bar.updatePositionBase = function (_perc_) {
    var baseDelta = base.from - base.to;
    base.now = base.from - baseDelta*_perc_;
  }

  bar.saveBase = function (_) {
    if (!arguments.length) {
      base.from = bar.base();
    }
    else {
      base.from = _;
    }
    return bar;
  }

  bar.moveBase = function (_) {
    base.to = _;
    return bar;
  }

  bar.base = function () {
    return base.now;
  }

  return bar;
};
Chartmander.components.point = function (data, title) {

  var point = new Chartmander.components.element(data, title);

  var drawInto = function (chart, set) {

    var ctx = chart.ctx;

    if (chart.hovered()) {
      var hover = isHovered(chart.mouse(), chart.pointHoverRadius(), chart.mergeHover());
    }

    // Draw circle in normal state
    ctx.beginPath();
    ctx.fillStyle = set.color();
    ctx.arc(point.x(), point.y(), chart.pointRadius()*(1-point.getState()), 0, Math.PI*2, false);
    ctx.fill();
    // Stroke circle
    // if (style.normal.stroke) {
    //   ctx.lineWidth = style.normal.stroke*(1-point.getState());
    //   ctx.strokeStyle = style.normal.strokeColor;
    //   ctx.stroke();
    // }

    if (point.getState() > 0) {
      cfg.hoverNotFinished = true;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = style.hoverColor();
      ctx.arc(point.x(), point.y(),10*point.getState(), 0, Math.PI*2, false);
      ctx.fill();
      // if (style.onHover.stroke > 0) {
      //   ctx.lineWidth = style.onHover.stroke*point.getState();
      //   ctx.strokeStyle = style.onHover.strokeColor;
      //   ctx.stroke();
      // }
      ctx.restore();
    }
    //
    if (chart.hovered()) {
      if (hover.was) {
        console.log("Handle hover")
        // chart.itemsInHoverRange.push({
        //   "set": set.title,
        //   "index": indexOf.call(set.elements, point),
        //   "hoverDistance": hover.distance
        // });
        // return;
      }
    }
    point.animOut();
  }

  var isHovered = function (mouse, hoverRadius, mergeHover) {
    var distance = Math.abs(mouse.x - point.x());

    if (!mergeHover) {
      distance = Math.sqrt(Math.pow(distance, 2) + Math.pow(mouse.y - point.y(), 2));
    }

    return {
      "was": distance < hoverRadius,
      "distance": distance
    };
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  point.drawInto = drawInto;

  return point;
};

Chartmander.components.label = function(data, title) {

	var label = new Chartmander.components.element(data, title);

  label.startAt = function (val) {
    label.savePosition(0, val);
    return label;
  } 

  return label;
};

})();
