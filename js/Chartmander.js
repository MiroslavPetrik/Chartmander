// ==================================================
// Chartmander.js - Interactive Canvas Charts
// --------------------------------------------------
// Version   : 0.1.1
// Homepage  : 11th.github.io/Chartmander/
// GitHub    : github.com/11th/Chartmander
// Copyright : (c) 2014 Miroslav Petrik, MIT License
// Contact   : miroslavpetrik@outlook.com
// ==================================================

(function(){

  "use strict";

  var Chartmander = window.Chartmander || {};
  window.Chartmander = Chartmander;

  Chartmander.version    = '0.1.1';
  Chartmander.models     = Chartmander.models     || {};
  Chartmander.components = Chartmander.components || {};
  Chartmander.charts     = []; // Store all rendered charts

  Chartmander.addChart = function (callback) {
    var newChart = callback()
      , isUnique = true;

    forEach(Chartmander.charts, function (chart) {
      if (newChart.id() === chart.id())
        isUnique = false;
    });

    if (isUnique)
      Chartmander.charts.push(newChart);

    return Chartmander;
  };

  Chartmander.select = function (id, model) {
    // Check if chart already exists
    for (var i=0, l=Chartmander.charts.length; i<l; i++) {
      if (id === Chartmander.charts[i].id()) {
        // Do update...
        return Chartmander.charts[i].updated(true);
      }
    }
    // Provide new chart
    if (model === "pie")
      return new Chartmander.models.pieChart(id);

    if (model === "bar")
      return new Chartmander.models.barChart(id);

    if (model === "categoryBar")
      return new Chartmander.models.categoryBarChart(id);

    if (model === "line")
      return new Chartmander.models.lineChart(id);

    throw new Error("Unknown model of chart.");
  };

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

  var requestAnimationFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
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

  function getArrayBy (data, property, exclusiveEntry) {
    var result = []
      , i = 0;

    forEach(data, function (set) {
      if (exclusiveEntry && i == 1) return result;
      result = result.concat(set.values.map(function (element) {
        return element[property];
      }));
      i++;
    });
    return result;
  }

  function getRange (values) {
    return {
      "min": Math.min.apply(null, values),
      "max": Math.max.apply(null, values)
    }
  }

  if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) { throw Error('Second argument not supported');}
            if (o === null) { throw Error('Cannot set a null [[Prototype]]');}
            if (typeof o != 'object') { throw TypeError('Argument must be an object');}
            F.prototype = o;
            return new F;
        };
    })();
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
  }

Chartmander.models.chart = function (canvasID) {
  
  var chart = this;

  var id = canvasID // unique ID selector
    , type = ""
    , canvas = document.getElementById(canvasID)
    , ctx = canvas.getContext('2d')
    , datasets = []
    , width = ctx.canvas.width
    , height = ctx.canvas.height
    , margin = { top: 0, right: 0, bottom: 0, left: 0 }
    , mouse = { x: 0, y: 0 }
    , colors = ["blue", "green", "red"]
    , font = "13px Arial, sans-serif"
    , fontColor = "#555"
    , animate = true
    , hovered = false
    , animationSteps = 100
    , animationCompleted = 0
    , easing = "easeInQuint"
    , updated = false
    // , onAnimationCompleted = null
    ;

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var tooltip = new Chartmander.components.tooltip();

  ///////////////////////////////////
  // Interaction Setup
  ///////////////////////////////////

  canvas.addEventListener("mouseenter", handleEnter, false);
  canvas.addEventListener("mousemove",  handleHover, false);
  canvas.addEventListener("mouseleave", handleLeave, false);

  if (window.devicePixelRatio) {
    ctx.canvas.style.width  =  width + "px";
    ctx.canvas.style.height = height + "px";
    ctx.canvas.height       = height * window.devicePixelRatio;
    ctx.canvas.width        = width  * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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

  ///////////////////////////////////
  // The Loop
  ///////////////////////////////////

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
      // hoverNotFinished = false;
      ctx.clearRect(0, 0, width, height);
      tooltip.flush();

      drawComponents(_perc_);

      if (hovered && tooltip.hasItems()) {
        tooltip.recalc(ctx);
        tooltip.drawInto(chart);
      }

      // Request self-repaint if chart or tooltip or data element has not finished animating yet

      // if (animationCompleted < 1 || (tip.getState() > 0 && tip.getState() < 1) || hoverNotFinished ) {
      if (animationCompleted < 1) {
        requestAnimationFrame(loop);
      }
      else {
        console.log("Animation Finished.");
      }
    }
    // Ignite
    requestAnimationFrame(loop);
  }

  ///////////////////////////////////
  // Chart Update - Parse Data
  ///////////////////////////////////

  var parse = function (data, element) {
    if (data === undefined) {
      throw new Error("No data specified for chart " + id);
    }
    // First render, create new datasets
    if (chart.setsCount() === 0) {
      var i=0;
      forEach(data, function (set) {
        datasets.push(new Chartmander.components.dataset(set, colors[i], element));
        i++;
      });
    } else { // Update
      var i=0;
      forEach(datasets, function (set) {
        if (data[i] === undefined) {
          throw new Error("Missing dataset. Dataset count on update must match.");
        }
        set.merge(data[i], chart, element);
        i++;
      });
    }
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.tooltip = tooltip;
  chart.draw    = draw;
  chart.parse  = parse;
  chart.ctx     = ctx;

  chart.id = function (_) {
    // if(!arguments.length)
      return id;
    // id = _;
    // return chart;
  };

  chart.type = function (_) {
    if(!arguments.length) return type;
    type = _;
    return chart;
  };

  chart.width = function () {
    return width;
  };

  chart.height = function () {
    return height;
  };

  chart.mouse = function (_) {
    if(!arguments.length) return mouse;
    mouse.x = typeof _.x != 'undefined' ? _.x : mouse.x;
    mouse.y = typeof _.y != 'undefined' ? _.y : mouse.y;
    return chart;
  };

  chart.completed = function (_) {
    if(!arguments.length) return animationCompleted;
    animationCompleted = _;
    return chart;
  };

  chart.setsCount = function () {
    return datasets.length;
  };

  chart.datasets = function (_) {
    if(!arguments.length) return datasets;
    datasets = _;
    return chart;
  };

  chart.dataset = function (_) {
    return datasets[_];
  };

  chart.elementCount = function () {
    var total = 0;
    forEach(datasets, function (set) {
      total += set.elementCount();
    });
    return total;
  };

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.colors = function (_) {
    if(!arguments.length) return colors;
    colors = _;
    return chart;
  };

  // FAUX
  chart.color = function (i) {
    if (colors[i] !== undefined)
      return colors[i];
    else
      return "red";
  };

  chart.fontColor = function (_) {
    if (!arguments.length) return fontColor;
    fontColor = _;
    return chart;
  };

  chart.hovered = function (_) {
    if (!arguments.length) return hovered;
    hovered = _;
    return chart;
  };

  chart.font = function (_) {
    if (!arguments.length) return font;
    font = _;
    return chart;
  };

  chart.easing = function (_) {
    if (!arguments.length) return easing;
    easing = _;
    return chart;
  };
  
  chart.updated = function (_) {
    if (!arguments.length) return updated;
    updated = _;
    return chart;
  };

  return chart;
};

Chartmander.models.pieChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas)
    , center = { x: chart.width()/2, y: chart.height()/2 }
    , radius = Math.min.apply(null, [center.x, center.y])
    , innerRadius = .6
    , rotateAnimation = true
    , startAngle = 0
    ;

  chart.type("pie").easing("easeOutBounce");

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
    // chart.completed(0);
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
  };

  chart.startAngle = function (_) {
    if(!arguments.length) return startAngle;
    startAngle = _;
    return chart;
  };

  return chart;
};

Chartmander.models.barChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var stacked        = false
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barwidth is higher
    , datasetSpacing = 0
    , groupWidth     = 0
    , groupOffset    = 0
    , xAxisVisible   = true
    , yAxisVisible   = true
    ;

  chart.type("bar").margin({ top: 30, right: 40, bottom: 30, left: 70 });

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis      = new Chartmander.components.xAxis()
    , yAxis      = new Chartmander.components.yAxis()
    , grid       = new Chartmander.components.grid()
    , crosshair  = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    chart.parse(data, Chartmander.components.bar);
    var oldYScale; //undefined
    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (chart.updated()) {
      x0 = xAxis.copy(); // just object with labels and scale
      y0 = yAxis.copy();
      oldYScale = y0.scale;
    }
    // grid before axes
    grid.adapt(chart.width(), chart.height(), chart.margin());
    // axes use grid height to calculate their scale
    xAxis.adapt(chart, xrange);
    yAxis.adapt(chart, yrange, oldYScale);

    // recalc old labels to new position
    if (chart.updated()) {
      forEach(y0.labels, function (label) {
        label.savePosition().moveTo(false, chart.base() - label.value()/yAxis.scale());
      });
    }

    recalcBars();
    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

  var recalcBars = function () {
    var counter = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/chart.elementCount() );

    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    // leftFix = (barWidth*bars.setsCount())/2;

    forEach(chart.datasets(), function (set) {
      set.each(function (bar) {
        x = grid.left() + (bar.label()-xAxis.min())/xAxis.scale() + counter*barWidth;
        y = -bar.value()/yAxis.scale();
        if (chart.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
          // bar.savePosition(grid.width()/2, 0);
        }
        bar.moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
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
        bar.updatePosition(_perc_)
           .updatePositionBase(_perc_)
           .drawInto(chart, set);
      });
      counter++;
    })
    ctx.restore();
  }

  var drawComponents = function (_perc_) {
    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn().drawInto(chart, _perc_);
      // if (x0 && x0.state > 0) {
      //   ctx.save();
      //   forEach(x0.labels, function (label) {

      //   });
      //   ctx.restore();
      // } 
    }

    if (yAxisVisible) {
      yAxis.animIn().drawInto(chart, _perc_);
      if (y0 && y0.state > 0) {
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = chart.fontColor();
        ctx.font = chart.font();
        ctx.globalAlpha = y0.state;
        forEach(y0.labels, function (label) {
          label.updatePosition(_perc_);
          ctx.fillText(label.label().toString() + " " + yAxis.unit(), grid.left() - yAxis.margin(), label.y());
        });
        ctx.restore();
        y0.state -= .01;
      } 
    }

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
  chart.crosshair = crosshair;

  chart.render = render;
  chart.drawFull = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  };

  chart.barWidth = function (_) {
    if(!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return chart;
  };

  chart.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return chart;
  };

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  };

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  };

  return chart;
}

Chartmander.models.categoryBarChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var stacked        = false
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 20 // used only if default barwidth is higher
    , datasetSpacing = 0
    , groupWidth     = 0
    , groupOffset    = 0
    , xAxisVisible   = true
    , yAxisVisible   = true
    ;

  chart.type("bar").margin({ top: 30, right: 40, bottom: 30, left: 70 });

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis      = new Chartmander.components.categoryAxis()
    , yAxis      = new Chartmander.components.yAxis()
    , grid       = new Chartmander.components.grid()
    , crosshair  = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    chart.parse(data, Chartmander.components.bar);
    var oldYScale; //undefined
    var xLabels = [];
    chart.dataset(0).each(function (element) {
      xLabels.push(element.label());
    });
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (chart.updated()) {
      // x0 = xAxis.copy(); // just object with labels and scale
      y0 = yAxis.copy();
      oldYScale = y0.scale;
    }
    grid.adapt(chart.width(), chart.height(), chart.margin());
    xAxis.labels(xLabels).adapt(chart);
    yAxis.adapt(chart, yrange, oldYScale);

    // recalc old labels to new position
    if (chart.updated()) {
      forEach(y0.labels, function (label) {
        label.savePosition().moveTo(false, chart.base() - label.value()/yAxis.scale());
      });
    }

    recalcBars();
    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

  var recalcBars = function () {
    var i=0, j=0, x, y, categoryOffset;

    barWidth = Math.floor( grid.width()/chart.elementCount() );

    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    console.log(xAxis.labelSpace())

    categoryOffset = grid.width()/xAxis.labelSpace();

    forEach(chart.datasets(), function (set) {
      j=0;
      set.each(function (bar) {
        x = grid.left() + j*xAxis.labelSpace() + i*barWidth;
        y = -bar.value()/yAxis.scale();
        if (chart.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
          // bar.savePosition(grid.width()/2, 0);
        }
        bar.moveTo(x, y).saveBase(chart.base()).moveBase(chart.base());
        j++;
      });
      i++;
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
        bar.updatePosition(_perc_)
           .updatePositionBase(_perc_)
           .drawInto(chart, set);
      });
      counter++;
    })
    ctx.restore();
  }

  var drawComponents = function (_perc_) {
    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn().drawInto(chart, _perc_);
      // if (x0 && x0.state > 0) {
      //   ctx.save();
      //   forEach(x0.labels, function (label) {

      //   });
      //   ctx.restore();
      // } 
    }

    if (yAxisVisible) {
      yAxis.animIn().drawInto(chart, _perc_);
      if (y0 && y0.state > 0) {
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = chart.fontColor();
        ctx.font = chart.font();
        ctx.globalAlpha = y0.state;
        forEach(y0.labels, function (label) {
          label.updatePosition(_perc_);
          ctx.fillText(label.label().toString() + " " + yAxis.unit(), grid.left() - yAxis.margin(), label.y());
        });
        ctx.restore();
        y0.state -= .01;
      } 
    }

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
  chart.crosshair = crosshair;

  chart.render = render;
  chart.drawFull = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  };

  chart.barWidth = function (_) {
    if(!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return chart;
  };

  chart.datasetSpacing = function (_) {
    if(!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return chart;
  };

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  };

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  };

  return chart;
}

Chartmander.models.lineChart = function (canvas) {

  var chart = new Chartmander.models.chart(canvas);

  var lineWidth        = 2
    , pointRadius      = 5
    , pointHoverRadius = 20
    , areaVisible      = true
    , areaOpacity      = .33
    , mergeHover       = true
    , xAxisVisible     = true
    , yAxisVisible     = true
    , hoveredItems     = []
    ;

  chart.type("line").margin({ top: 30, right: 50, bottom: 50, left: 50 })

  // Shorthand for drawing functions
  var ctx = chart.ctx;

  ///////////////////////////////////
  // Use components
  ///////////////////////////////////

  var xAxis     = new Chartmander.components.xAxis()
    , yAxis     = new Chartmander.components.yAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  var x0, y0;

  var render =  function (data) {
    chart.parse(data, Chartmander.components.point);

    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(chart.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    // grid before axes
    grid.adapt(chart.width(), chart.height(), chart.margin());
    // axes use grid height to calculate their scale
    xAxis.adapt(chart, xrange);
    yAxis.adapt(chart, yrange);

    recalcPoints();
    // chart.completed(0);
    chart.draw(drawComponents, false);
  }

  var recalcPoints = function () {
    var x, y;
    forEach(chart.datasets(), function (set) {
      set.each(function (point) {
        x = Math.ceil(grid.left() + (point.label()-xAxis.min())/xAxis.scale());
        y = chart.base()- point.value()/yAxis.scale();
        if (chart.updated()) {
          point.savePosition();
        } else {
          point.savePosition(grid.width()/2, chart.base());
        }
        point.moveTo(x, y);
      });
    });
  }

  var updatePoints = function (set, _perc_) {
    set.each(function (point) {
      point.updatePosition(_perc_);
    });
  }

  var drawArea = function (set) {
    ctx.save();
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
    ctx.restore();
  }

  var drawLines = function (set) {
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = set.color();
    ctx.beginPath();
    set.each(function (point) {
      ctx.lineTo(point.x(), point.y());
    });
    ctx.stroke();
    ctx.restore();
  }

  var drawPoints = function (set) {
    ctx.save();
    ctx.strokeStyle = set.color();
    ctx.fillStyle = set.color();
    set.each(function (point) {
      point.drawInto(chart, set);
    });

    // With high-density data there can be more hovered points
    // We need to find the one with the lowest distance from mouse

    if (hoveredItems.length > 0) {
      var closestHovered = hoveredItems[0];

      for (var i = 1, len = hoveredItems.length; i < len; i++) {
        if (hoveredItems[i].distance < closestHovered.distance)
          closestHovered = hoveredItems[i];
      }
      closestHovered = set.getElement(closestHovered.index);
      closestHovered.animIn();
      chart.tooltip.addItem({
        "set"  : set.title(),
        "label": closestHovered.label(),
        "value": closestHovered.value(),
        "x"    : closestHovered.x(),
        "color": set.color()
      });
    }

    ctx.restore();
  }

  var drawComponents = function (_perc_) {
    grid.drawInto(chart, _perc_);

    if (xAxisVisible) {
      xAxis.animIn()
           .drawInto(chart, _perc_);
    }

    if (yAxisVisible) {
      yAxis.animIn()
           .drawInto(chart, _perc_);
    }

    if (chart.hovered() && crosshair.visible() && grid.hovered(chart.mouse()) ) {
      crosshair.drawInto(chart);
    }

    forEach(chart.datasets(), function (set) {
      hoveredItems = [];
      updatePoints(set, _perc_);
      if (areaVisible) {
        drawArea(set);
      }
      drawLines(set);
      drawPoints(set);
    });
  }

  var drawFull = function () {
    chart.draw(drawComponents, true);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.xAxis     = xAxis;
  chart.yAxis     = yAxis;
  chart.grid      = grid;
  chart.crosshair = crosshair;
  
  chart.render    = render;
  chart.drawFull  = drawFull;

  chart.base = function (_) {
    return grid.bottom() - yAxis.zeroLevel();
  }

  chart.areaVisible = function (_) {
    if (!arguments.length) return areaVisible;
    areaVisible = _;
    return chart;
  }

  chart.areaOpacity = function (_) {
    if (!arguments.length) return areaOpacity;
    areaOpacity = _;
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

  chart.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return chart;
  }

  chart.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return chart;
  }

  chart.hoveredItems = function (_) {
    if (!arguments.length) return hoveredItems;
    hoveredItems = _;
    return chart;
  };

  chart.addHoveredItem = function (_) {
    hoveredItems.push(_);
    return chart;
  };

  return chart;
};

Chartmander.components.animatedPart = function () {

  var part = this;

  var isAnimated = false
    , animationCompleted = 0 // normal => 0, hover => 1
    , speed = .01
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////
  
  part.isAnimated = function (_) {
    if(!arguments.length) return isAnimated;
    isAnimated = _;
    return part;
  };

  part.getState = function () {
    return animationCompleted;
  };

  part.animIn = function () {
    // isAnimated = true;
    animationCompleted += speed;
    if (animationCompleted >= 1) {
      // isAnimated = false;
      animationCompleted = 1;
    }
    return part;
  };

  part.animOut = function () {
    // isAnimated = true;
    animationCompleted -= speed;
    if (animationCompleted <= 0) {
      // isAnimated = false;
      animationCompleted = 0;
    }
    return part;
  };

  part.speed = function () {
    if(!arguments.length) return speed;
    speed = _;
    return part;
  };

  return part;
}

Chartmander.components.dataset = function (data, color, element) {

  var dataset = this;

  var title = data.title
    , elements = []
    , min = 0
    , max = 0
    , normal = {
        color: tinycolor.lighten(color, 5).toHex(),
        strokeColor: tinycolor.darken(color, 10).toHex()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHex(),
        strokeColor: tinycolor.darken(color, 20).toHex()
      }
    ;

  var getMaxMin = function () {
    var yRange = getRange(function () {
      var result = [];
      forEach(elements, function (el) {
        result.push(el.value());
      });
      return result;
    }());

    min = yRange.min;
    max = yRange.max;
  }


  var merge = function (data, chart, element) {
    // Test equality of datastream
    if (title != data.title) {
      throw new Error("Different datastream on update!");
    }
    // Update or create
    for (var i=0, len=data.values.length; i != len; i++) {
      if (elements[i] !== undefined) {
        elements[i].label(data.values[i].label).value(data.values[i].value).savePosition();
      }
      else {
        var element = new element(data.values[i], dataset.title);
        elements.push(element.savePosition(chart.grid.width(), chart.getBase()));
      }
    }
    // Delete
    if (elements.length > data.values.length) {
      for (var j = elements.length - data.values; j!=0; j--) {
        console.log("Delete");
        elements[elements.length-j].delete();
      }
    }
    getMaxMin();
  }

  ///////////////////////////////
  // Init
  ///////////////////////////////

  forEach(data.values, function (el) {
    elements.push(new element(el, data.title));
  });

  getMaxMin();

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  dataset.merge = merge;

  dataset.each = function (action) {
    forEach(elements, action);
  };

  dataset.title = function (action) {
    return title;
  };

  dataset.size = function () {
    var total = 0;
    dataset.each(function (element) {
      total += element.value();
    });
    return total;
  };

  dataset.elementCount = function () {
    return elements.length;
  };

  dataset.getElement = function (index) {
    if (index == "last")
      return elements[elements.length-1];
    else
      return elements[index];
  };

  dataset.els = function () {
    return elements;
  };

  dataset.color = function (_) {
    if(!arguments.length) return normal.color;
    normal.color = _;
    return dataset;
  };

  dataset.min = function (_) {
    if(!arguments.length) return min;
    min = _;
    return dataset;
  };

  dataset.max = function (_) {
    if(!arguments.length) return max;
    max = _;
    return dataset;
  };

  dataset.hoverColor = function (_) {
    if(!arguments.length) return hover.color;
    hover.color = _;
    return dataset;
  };

  return dataset;
}

Chartmander.components.grid = function () {

  var grid = this;

  var horizontalLines = true
    , verticalLines = true
    , lineColor = "#ddd"
    , lineWidth = 1
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

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = _perc_;

    if (horizontalLines) {
      forEach(chart.yAxis.labels(), function (line) {
        var y = Math.ceil(line.y());
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      });
    }

    if (verticalLines) {
      for (var i = 0; i < chart.xAxis.labels().length+1; i++) {
        var xOffset = Math.ceil( chart.grid.left() + i*(chart.grid.width() / chart.xAxis.labels().length) );
        ctx.beginPath();
        ctx.moveTo(xOffset, top);
        ctx.lineTo(xOffset, bottom);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  var hovered = function (mouse) {
     return mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.adapt = adapt;
  grid.hovered = hovered;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return grid;
  };

  grid.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return grid;
  };

  grid.bottom = function (_) {
    if (!arguments.length) return bottom;
    bottom = _;
    return grid;
  };

  grid.left = function (_) {
    if (!arguments.length) return left;
    left = _;
    return grid;
  };

  grid.top = function (_) {
    if (!arguments.length) return top;
    top = _;
    return grid;
  };

  grid.lineColor = function (_) {
    if (!arguments.length) return lineColor;
    lineColor = _;
    return grid;
  };

  grid.horizontalLines = function (_) {
    if (!arguments.length) return horizontalLines;
    horizontalLines = _;
    return grid;
  };

  grid.verticalLines = function (_) {
    if (!arguments.length) return verticalLines;
    verticalLines = _;
    return grid;
  };

  return grid;
}

Chartmander.components.axis = function () {

  var axis = new Chartmander.components.animatedPart();

  var labels = []
    // , labelSpace = 0
    , dataMin = 0
    , dataMax = 0
    , scale = 1
    , delta = 0
    , format = ""
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.min = function (_) {
    if (!arguments.length) return dataMin;
    dataMin = _;
    return axis; 
  };

  axis.max = function (_) {
    if (!arguments.length) return dataMax;
    dataMax = _;
    return axis;
  };

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  };
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  };

  axis.each = function (action) {
    forEach(labels, action);
  };

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  };

  axis.getLabel = function (index) {
    return labels[index];
  };

  axis.delta = function (_) {
    if (!arguments.length) return delta;
    delta = _;
    return axis;
  };

  axis.copy = function () {
    return {
      state: axis.getState(),
      labels: labels,
      scale: scale
    };
  }

  return axis;
}

Chartmander.components.xAxis = function () {

  var axis = new Chartmander.components.axis();

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
    ;
    
  axis.format("MM/YYYY");
  // rename to timeAxis ?
  // make another numberAxis and category
  // implement in chart as x/y with options horizontal/vertical  aligned top, bottom or left,right

  var recalc = function (chart) {
    var startDate = moment(axis.min())
      , daysInRange = axis.delta()/dayMSec
      , stepIndex = steps.length
      , labelCount = 0
      ;

    // clear labels
    axis.labels([]);
    // Time per pixel
    axis.scale(axis.delta()/chart.grid.width());

    while (labelCount < 1) {
      stepIndex--;
      labelCount = daysInRange/steps[stepIndex].days;
    }

    labelCount = Math.round(labelCount);
    for (var i = 0; i < labelCount; i++) {
      var label = moment(startDate).add(steps[stepIndex].label, i);
      axis.labels().push(label.valueOf());
    }
  }

  var drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , topOffset = chart.grid.bottom() + 25;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = 1;
    axis.each(function (label) {
      var leftOffset = chart.margin().left + (label-chart.xAxis.min())/chart.xAxis.scale();
      ctx.fillText(moment(label).format(axis.format()), leftOffset, topOffset);
    });
    ctx.restore();
    return axis;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.adapt = function (chart, range) {
    // Apply values required for label recalculation
    axis.min(range.min).max(range.max).delta(axis.max() - axis.min());
    recalc(chart);
    return axis;
  };

  return axis;
}

Chartmander.components.yAxis = function () {

  var axis = new Chartmander.components.axis();

  var unit = ""
    , abbr = false
    , margin = 10 // Offset from grid
    , zeroLevel = 0
    , labelSteps = [1, 2, 5]
    ;

  // generate?
  var recalc = function (chart, oldScale) {

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
      // where to start animating labels
      if (!isNaN(oldScale)) {
        label.startAt(chart.base() - label.value()/oldScale).moveTo(false, chart.base() - label.value()/axis.scale());
      } else {
        label.startAt(chart.base() - previous.value()/axis.scale()).moveTo(false, chart.base() - label.value()/axis.scale());
      }
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
    ctx.globalAlpha = _perc_;
    forEach(axis.labels(), function (label) {
      // var labelValue = abbr ? (label.label()/1000).toString() : label.label().toString();
      label.updatePosition(_perc_);
      ctx.fillText(label.label().toString() + " " + unit, grid.left() - margin, label.y());
    });
    ctx.restore();
    return axis;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.unit = function (_) {
    if(!arguments.length) return unit;
    unit = _;
    return axis;
  };

  axis.zeroLevel = function (_) {
    if(!arguments.length) return zeroLevel;
    zeroLevel = _;
    return axis;
  };

  axis.margin = function (_) {
    if(!arguments.length) return margin;
    margin = _;
    return axis;
  };

  // oldScale FAUX 
  axis.adapt = function (chart, range, oldScale) {
    axis.min(range.min).max(range.max).delta(axis.max() - (axis.min() > 0 ? 0 : axis.min()));
    recalc(chart, oldScale);
    return axis;
  };

  return axis;
}

Chartmander.components.categoryAxis = function () {

  var axis = new Chartmander.components.axis();

  var labelSpace = 10
    ;

  var recalc = function (chart) {
    labelSpace = chart.grid.width()/axis.labels().length;
    return axis;
  }

  axis.drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , topOffset = chart.grid.bottom() + 25
      , counter = 0
      ;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.globalAlpha = 1;
    ctx.font = chart.font();
    axis.each(function (label) {
      var leftOffset = chart.grid.left() + counter*labelSpace + labelSpace/2 - ctx.measureText(label).width/2;
      ctx.fillText(label, leftOffset, topOffset);
      counter++;
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.adapt = function (chart) {
    recalc(chart);
    return axis;
  }

  axis.labelSpace = function () {
    return labelSpace;
  }

  return axis;
}

Chartmander.components.element = function () {

  var element = new Chartmander.components.animatedPart();

  var set = null
    , label = null
    , value = null
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

  element.set = function (_) {
    if(!arguments.length) return set;
    set = _;
    return element;
  };

  element.label = function (_) {
    if(!arguments.length) return label;
    label = _;
    return element;
  };

  element.value = function (_) {
    if(!arguments.length) return value;
    value = _;
    return element;
  };

  element.x = function (_) {
    if(!arguments.length) return now.x;
    now.x = _;
    return element;
  };

  element.y = function (_) {
    if(!arguments.length) return now.y;
    now.y = _;
    return element;
  };

  element.moveTo = function (x, y) {
    if (x!=false)
      to.x = x;
    if(y!=false)
      to.y = y;
    return element;
  };

  element.updatePosition = function (_perc_) {
    var deltaX = from.x - to.x
      , deltaY = from.y - to.y
      ;
    now.x = from.x - deltaX*_perc_;
    now.y = from.y - deltaY*_perc_;
    
    return element;
  };

  element.savePosition = function (x, y) {
    if (!arguments.length) {
      from.x = now.x;
      from.y = now.y;
    } else {
      from.x = x;
      from.y = y;
    }
    return element;
  };

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

  var slice = new Chartmander.components.element();
      slice.set(title).label(data.label).value(data.value);

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
  };

  return slice;
};

Chartmander.components.bar = function (data, title) {

  var bar = new Chartmander.components.element();
      bar.set(title).label(data.label).value(data.value);

  var base = {
        from: 0,
        to:   0,
        now:  0
      }
    ;

  var drawInto = function (chart, set) {
    var ctx = chart.ctx;

    ctx.save();
    if (chart.hovered() && isHovered(chart)) {
      ctx.fillStyle = set.hoverColor();
      ctx.strokeStyle = set.color();
      chart.tooltip.addItem({
        "set"  : set.title(),
        "label": bar.label(),
        "value": bar.value(),
        "color": set.color()
      });
    }

    ctx.fillRect(bar.x(), bar.base(), chart.barWidth(), bar.y());
    ctx.restore();
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
    return bar;
  }

  var isHovered = function (chart) {
    var x = chart.mouse().x
      , y = chart.mouse().y
      , hovered = false
      , yRange = [bar.base(), bar.base()+bar.y()].sort(function(a,b){return a-b})
      ;

    if (x >= bar.x() && x <= bar.x()+chart.barWidth() && y >= yRange[0] && y<= yRange[1]) {
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
    return bar;
  };

  bar.saveBase = function (_) {
    if (!arguments.length) {
      base.from = bar.base();
    }
    else {
      base.from = _;
    }
    return bar;
  };

  bar.moveBase = function (_) {
    base.to = _;
    return bar;
  };

  bar.base = function () {
    return base.now;
  };

  return bar;
};

Chartmander.components.point = function (data, title) {

  var point = new Chartmander.components.element();
      point.set(title).label(data.label).value(data.value);

  var drawInto = function (chart, set) {
    var ctx = chart.ctx;
    if (chart.hovered()) {
      var hover = isHovered(chart.mouse(), chart.pointHoverRadius(), chart.mergeHover());
    }
    // Draw circle in normal state
    ctx.beginPath();
    ctx.arc(point.x(), point.y(), chart.pointRadius()*(1-point.getState()), 0, Math.PI*2, false);
    ctx.fill();
    // Stroke circle
    // if (style.normal.stroke) {
    //   ctx.lineWidth = style.normal.stroke*(1-point.getState());
    //   ctx.strokeStyle = style.normal.strokeColor;
    //   ctx.stroke();
    // }

    if (point.getState() > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(point.x(), point.y(),10*point.getState(), 0, Math.PI*2, false);
      ctx.fill();
      // if (style.onHover.stroke > 0) {
      //   ctx.lineWidth = style.onHover.stroke*point.getState();
      //   ctx.strokeStyle = style.onHover.strokeColor;
      //   ctx.stroke();
      // }
      ctx.restore();
    }

    if (chart.hovered() && hover.was) {
      chart.addHoveredItem({
        "index"   : indexOf.call(set.els(), point),
        "distance": hover.distance
      });
      return;
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

Chartmander.components.label = function (data, title) {

	var label = new Chartmander.components.element();
			label.label(data.label).value(data.value);

  label.startAt = function (val) {
    label.savePosition(0, val);
    return label;
  } 

  return label;
};

Chartmander.components.crosshair = function () {

  var crosshair = this;

  var x = null
    , y = null
    , visible = true
    , sticky = true
    , color = "#555"
    , lineWidth = 1
    ;

  var drawInto = function (chart) {
    var ctx = chart.ctx;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    x = chart.mouse().x;

    if (sticky && chart.tooltip.hasItems()) {
      x = chart.tooltip.items()[0].x
    }

    chart.ctx.beginPath();
    chart.ctx.moveTo(x, chart.grid.top());
    chart.ctx.lineTo(x, chart.grid.bottom());
    chart.ctx.stroke();
    chart.ctx.restore();
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  crosshair.drawInto = drawInto;


  crosshair.x = function (_) {
    if(!arguments.length) return x;
    x = _;
    return crosshair;
  };

  crosshair.y = function (_) {
    if(!arguments.length) return y;
    y = _;
    return crosshair;
  };

  crosshair.visible = function (_) {
    if(!arguments.length) return visible;
    visible = _;
    return crosshair;
  };

  crosshair.sticky = function (_) {
    if(!arguments.length) return sticky;
    sticky = _;
    return crosshair;
  };

  crosshair.color = function (_) {
    if(!arguments.length) return color;
    color = _;
    return crosshair;
  };

  return crosshair;
}

Chartmander.components.tooltip = function (items) {

  var tooltip = new Chartmander.components.animatedPart();

  var items = []
    , margin = 20
    , padding = 10
    , backgroundColor = "rgba(46,59,66,.8)"
    , width = 0
    , height = 0
    , dateFormat = "MMMM YYYY"
    , fontSize = 12
    , lineHeight = 1.5
    , iconSize = 10
    , fontColor = "#fff"
    , current = { // Position
        x: 0,
        y: 0
      }
    , desired = {
        x: 0,
        y: 0
      }
    ;

  var drawInto = function (chart) {
    var ctx = chart.ctx
      , topOffset  = chart.mouse().y
      , leftOffset = chart.mouse().x + margin
      , lineOffset = fontSize*lineHeight
      ;

    tooltip.animIn();

    ctx.save();
    // Draw Tooltip body
    ctx.globalAlpha = tooltip.getState();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(leftOffset, topOffset, width + padding*2, height + padding*2);

    // Draw Tooltip items
    ctx.fillStyle = fontColor;
    leftOffset += padding;
    topOffset += padding;
    ctx.textBaseline = "top";

    // Tooltip header
    ctx.fillText(moment(items[0].label).format(dateFormat), leftOffset, topOffset);
    topOffset += lineOffset;

    // Items
    forEach(items, function (item) {
      ctx.fillText(item.set + " " + item.value, leftOffset, topOffset);
      topOffset += lineOffset;
    });
    ctx.restore();
  }

  var recalc = function (ctx) {
    var lineWidth = 0;
    height = 0;
    height += fontSize*lineHeight;
    width = ctx.measureText( moment(items[0].label).format(dateFormat) ).width

    forEach(items, function (item) {
      lineWidth = ctx.measureText(item.set).width + ctx.measureText(item.value).width;
      if (lineWidth > width) width = lineWidth;
      height += lineHeight;
    });
  };


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  tooltip.drawInto = drawInto;
  tooltip.recalc = recalc;

  tooltip.addItem = function (_) {
    items.push(_);
  };

  tooltip.flush = function () {
    items = [];
  }

  tooltip.hasItems = function () {
    return items.length > 0;
  };

  tooltip.backgroundColor = function (_) {
    if (!arguments.length) return backgroundColor;
    backgroundColor = _;
    return tooltip;
  };

  tooltip.dateFormat = function (_) {
    if (!arguments.length) return dateFormat;
    dateFormat = _;
    return tooltip;
  };

  return tooltip;
}

})();
