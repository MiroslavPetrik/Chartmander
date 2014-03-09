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
    , mouse = {}
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

  // canvas.addEventListener("mouseenter", handleEnter, false);
  // canvas.addEventListener("mousemove", handleHover, false);
  // canvas.addEventListener("mouseleave", handleLeave, false);

  // if (window.devicePixelRatio) {
  //   ctx.canvas.style.width = config.width + "px";
  //   ctx.canvas.style.height = config.height + "px";
  //   ctx.canvas.height = config.height * window.devicePixelRatio;
  //   ctx.canvas.width = config.width * window.devicePixelRatio;
  //   ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  // }

  clear = function () {
    ctx.clearRect(0, 0, width, height);
  };

  draw = function (drawComponents, finished) {
      // , tip = chart.tooltip
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

      // if (chart.xAxis)
      //   chart.xAxis.drawInto(chart);
      // if (chart.yAxis)
      //   chart.yAxis.drawInto(chart, _perc_);
      // if (chart.grid)
      //   chart.grid.drawInto(chart, _perc_);

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

      // if (cfg.title) {
      //   ctx.save();
      //   ctx.font = "18px Arial";
      //   ctx.fillText(cfg.title, chart.getGridProperties().left, chart.getGridProperties().top/2);
      //   ctx.restore();
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
    // Global paint settings
    // ctx.textBaseline = "middle";
    // ctx.font = config.font;
    // First paint
    requestAnimationFrame(loop);
  }

  // function handleHover (e) {
  //   var rect = canvas.getBoundingClientRect();
  //   config.mouse = {
  //     x: e.clientX - rect.left,
  //     y: e.clientY - rect.top
  //   }
  //   // console.log(chart.config.mouse.x, chart.config.mouse.y)
  //   // Allow repaint on hover only if chart and tooltip are done with self-repaint
  //   // AND if also hovered item is not repainting 
  //   if (config.animationCompleted >= 1 && !tooltip.isAnimated() && !config.hoverNotFinished ) {
  //     chart.render(true)
  //   }
  // }

  function handleEnter () {
    hovered = true;
  }

  // function handleLeave () {
  //   hovered = false;
  //   // chart.tooltip.removeItems();
  //   if (animationCompleted >= 1)
  //     draw(true);
  // }

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

  chart.getMouse = function (axis) {
    if (axis === "x")
      return mouse.x;
    else
      return mouse.y;
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

  // this.getGridProperties = function () {
  //   return chart.grid.config.properties;
  // }

  // chart.getBase = function () {
  //   if(chart.config.type === "pie")
  //     return "TODO";
  //   else 
  //     return chart.getGridProperties()["bottom"] - chart.yAxis.config.zeroLevel;
  // }

  chart.getElementCount = function () {
    var total = 0;
    forEach(this.datasets, function (set) {
      total += set.getElementCount();
    })
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
    this.config.font = _;
    return chart;
  }

  // this.crossColor = function (_) {
  //   this.crosshair.color = _;
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
    // var i = 0;
    // forEach(_, function (color) {
    //   chart.datasets[i].style.color = color;
    //   chart.datasets[i].repaint();
    //   i++;
    // });
    return chart;
  }

  return chart;
}

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
    console.log("Pie render")
    drawSlices(_perc_);
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  pie.render = render;

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
      total += element.value;
    })
    return total;
  }

  dataset.getElementCount = function () {
    return dataset.elements.length;
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
    return this;
  }

  // console.log(elements[0].value())

  return dataset;
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

  var sliceIsHovered = function (chart) {
    var x = chart.getMouse("x") - chart.center().x
      , y = chart.getMouse("y") - chart.center().y
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter <= chart.radius() && fromCenter >= chart.radius()*chart.innerRadius()) {
      hoverAngle = Math.atan2(y, x) - chart.startAngle();
      if (hoverAngle < 0)
        hoverAngle += Math.PI*2;
      if (hoverAngle >= slice.x() && hoverAngle <= slice.y())
        hovered = true;
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
        pie.ctx.fillStyle = set.color();
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
})();
