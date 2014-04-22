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
  Chartmander.models     = Chartmander.models     || {}; // base models
  Chartmander.charts     = Chartmander.charts     || {}; // models combined into charts
  Chartmander.components = Chartmander.components || {};
  Chartmander.renderedCharts = [];

  Chartmander.addChart = function (callback) {
    var newChart = callback()
      , isUnique = true;

    forEach(Chartmander.renderedCharts, function (chart) {
      if (newChart.id() === chart.id())
        isUnique = false;
    });

    if (isUnique)
      Chartmander.renderedCharts.push(newChart);

    return Chartmander;
  };

  Chartmander.select = function (id, userChart) {
    // Check if chart already exists
    for (var i=0, l=Chartmander.charts.length; i<l; i++) {
      if (id === Chartmander.charts[i].id()) {
        // Do update...
        return Chartmander.charts[i].updated(true);
      }
    }
    // Provide new chart
    for (var chart in Chartmander.charts) {
      if (chart === userChart) {
        return new Chartmander.charts[userChart](id);
      }
    }

    throw new Error('Unknown chart \"' + userChart + '\" requested.');
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

  // jQuery wrap
  // Wrap an HTMLElement around each element in an HTMLElement array.
  HTMLElement.prototype.wrap = function(elms) {
      // Convert `elms` to an array, if necessary.
      if (!elms.length) elms = [elms];
      
      // Loops backwards to prevent having to clone the wrapper on the
      // first element (see `child` below).
      for (var i = elms.length - 1; i >= 0; i--) {
          var child = (i > 0) ? this.cloneNode(true) : this;
          var el    = elms[i];
          
          // Cache the current parent and sibling.
          var parent  = el.parentNode;
          var sibling = el.nextSibling;
          
          // Wrap the element (is automatically removed from its current
          // parent).
          child.appendChild(el);
          
          // If the element had a sibling, insert the wrapper before
          // the sibling to maintain the HTML structure; otherwise, just
          // append it to the parent.
          if (sibling) {
              parent.insertBefore(child, sibling);
          } else {
              parent.appendChild(child);
          }
      }
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
        color: tinycolor.lighten(color, 5).toHexString(),
        strokeColor: tinycolor.darken(color, 10).toHexString()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHexString(),
        strokeColor: tinycolor.darken(color, 20).toHexString()
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
        elements.push(element.savePosition(chart.grid.width(), chart.base()));
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

Chartmander.components.grid = function (chart, xAxis,  yAxis) {

  var grid = this;

  var horizontalLines = true
    , verticalLines = true
    , lineColor = "#ddd"
    , lineWidth = 1
    ;

  ///////////////////////
  // Func
  ///////////////////////

  var drawInto = function (ctx, _perc_) {
    var bound = grid.bound();
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = _perc_;
    if (horizontalLines) {
      forEach(chart.yAxis.labels(), function (line) {
        var y = Math.ceil(line.y() + bound.bottom);
        ctx.beginPath();
        ctx.moveTo(bound.left, y);
        ctx.lineTo(bound.right, y);
        ctx.stroke();
      });
    }

    if (verticalLines) {
      for (var i = 0; i < xAxis.labels().length+1; i++) {
        var xOffset = Math.ceil( chart.margin().left + i*(grid.width() / xAxis.labels().length) );
        ctx.beginPath();
        ctx.moveTo(xOffset, bound.top);
        ctx.lineTo(xOffset, bound.bottom);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  var hovered = function (mouse) {
    var bound = grid.bound();
    return mouse.x >= bound.left && mouse.x <= bound.right && mouse.y >= bound.top && mouse.y <= bound.bottom;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  grid.hovered = hovered;
  grid.drawInto = drawInto;

  grid.width = function (_) {
    var bound = grid.bound();
    return bound.right - bound.left;
  };

  grid.height = function (_) {
    var bound = grid.bound();
    return bound.bottom - bound.top;
  };

  grid.bound = function (_) {
    var margin = chart.margin();
    return {
      top: margin.top,
      right: chart.width() - margin.right,
      bottom: chart.height() - margin.bottom,
      left: margin.left
    }
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

  // implement in chart as x/y with options horizontal/vertical  aligned top, bottom or left,right

  var labels      = [] // stored labels
    // , labelSpace = 0
    , min         = 0 // lowest value
    , max         = 0 // largest value 
    , scale       = 1 // value per pixel || time per pixel etc... (delta divided by chart height)
    , delta       = 0 // maxVal - min value
    , format      = "" // moment.js format string
    , orientation = "horizontal" // or vertical
    , margin      = 10 // distance from grid
    , visible     = true
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return axis;
  };

  axis.getLabel = function (index) {
    return labels[index];
  };

  axis.each = function (action) {
    forEach(labels, action);
  };

  axis.min = function (_) {
    if (!arguments.length) return min;
    min = _;
    return axis; 
  };

  axis.max = function (_) {
    if (!arguments.length) return max;
    max = _;
    return axis;
  };

  axis.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return axis; 
  };
  
  axis.delta = function (_) {
    if (!arguments.length) return delta;
    delta = _;
    return axis;
  };
  
  axis.format = function (_) {
    if (!arguments.length) return format;
    format = _;
    return axis;
  };

  axis.orientation = function (_) {
    if (!arguments.length) return orientation;
    orientation = _;
    return axis;
  };

  axis.margin = function (_) {
    if(!arguments.length) return margin;
    margin = _;
    return axis;
  };

  axis.visible = function (_) {
    if(!arguments.length) return visible;
    visible = _;
    return axis;
  };

  // faux
  axis.copy = function () {
    return {
      state: axis.getState(),
      labels: labels,
      scale: scale
    };
  };

  return axis;
}

Chartmander.components.numberAxis = function () {

  var axis = new Chartmander.components.axis();

  var labelSteps = [1, 2, 5]
    , spacing = 25 // minimum space between 2 labels
    ;

  var generate = function (chart, oldScale) {

    var height = axis.orientation() == "vertical" ? chart.grid.height() : chart.grid.width()
      , maxLabelCount = Math.floor(height / spacing)
      , stepBase = axis.delta().toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelSteps);
    axis.labels( getLabels(getAxeSetup(stepBase, stepExponent)) );

    axis.scale(axis.delta()/height);
    // zeroLevel = height - axis.max()/axis.scale();

    // Set Positions for labels
    for (var i=0, len=axis.labels().length; i<len; i++) {
      var label = axis.getLabel(i)
        , previous;
      
      if (label.value() < 0)
        previous = axis.getLabel(i+1);
      else if (label.value() > 0)
        previous = axis.getLabel(i-1);
      else if (label.value() == 0) {
        if (axis.orientation() == "vertical")
          label.startAtY(chart.base()).moveTo(false, chart.base());
        if (axis.orientation() == "horizontal")
          label.startAtX(chart.grid.bound().left).moveTo(chart.grid.bound().left, false);
        continue;
      }
      // where to start animating labels
      if (!isNaN(oldScale)) {
        if (axis.orientation() == "vertical")
          label.startAtY(chart.base() - label.value()/oldScale).moveTo(false, chart.base() - label.value()/axis.scale());
        if (axis.orientation() == "horizontal")
          label.startAtX(chart.grid.bound().left - label.value()/oldScale).moveTo(chart.grid.bound().left - label.value()/axis.scale(), false);
      } else {
        if (axis.orientation() == "vertical")
          label.startAtY(chart.base() - previous.value()/axis.scale()).moveTo(false, chart.base() - label.value()/axis.scale());
        if (axis.orientation() == "horizontal")
          label.startAtX(chart.grid.bound().left - previous.value()/axis.scale()).moveTo(chart.grid.bound().left - label.value()/axis.scale(), false);
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
    var ctx = chart.layer.ctx;

    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = _perc_;
    forEach(axis.labels(), function (label) {
      label.updatePosition(_perc_);
      ctx.fillText(label.label().toString() + " ", chart.grid.bound().left - axis.margin(), label.y());
    });
    ctx.restore();
    return axis;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.adapt = function (chart, range, oldScale) {
    axis.min(range.min).max(range.max).delta(axis.max() - (axis.min() > 0 ? 0 : axis.min()));
    generate(chart, oldScale);
    return axis;
  };

  return axis;
}

Chartmander.components.timeAxis = function (chart, model) {

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
    
  axis.format("MM/YYYY").margin(20);

  var generate = function () {
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

  var drawInto = function (ctx, _perc_) {
    var topOffset = chart.grid.bound().bottom + axis.margin();
    ctx.save();
    ctx.fillStyle = model.fontColor();
    ctx.font = model.font();
    ctx.globalAlpha = 1;
    axis.each(function (label) {
      var leftOffset = chart.grid.bound().left + (label-axis.min())/axis.scale();
      ctx.fillText(moment(label).format(axis.format()), leftOffset, topOffset);
    });
    ctx.restore();
    return axis;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.drawInto = drawInto;

  axis.adapt = function (range) {
    // Apply values required for label recalculation
    axis.min(range.min).max(range.max).delta(axis.max() - axis.min());
    generate();
    return axis;
  };

  return axis;
}

Chartmander.components.yAxis = function (chart, model) {

  var axis = new Chartmander.components.axis();

  var unit = ""
    , abbr = false
    , zeroLevel = 0
    , labelSteps = [1, 2, 5]
    ;

  // generate?
  var recalc = function (oldScale) {

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
        label.startAt(model.base()).moveTo(false, model.base());
        continue;
      }
      // where to start animating labels
      if (!isNaN(oldScale)) {
        label.startAt(model.base() - label.value()/oldScale).moveTo(false, model.base() - label.value()/axis.scale());
      } else {
        label.startAt(model.base() - previous.value()/axis.scale()).moveTo(false, model.base() - label.value()/axis.scale());
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

  var drawInto = function (ctx, _perc_) {
    var leftOffset = chart.grid.bound().left - axis.margin()
      , bottom = chart.grid.bound().bottom;
    ctx.save();
    ctx.textAlign = "right";
    ctx.font = model.font();
    ctx.fillStyle = model.fontColor();
    ctx.globalAlpha = _perc_;
    forEach(axis.labels(), function (label) {
      label.updatePosition(_perc_);
      ctx.fillText(label.label().toString() + " " + unit, leftOffset, bottom + label.y());
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

  // oldScale FAUX 
  axis.adapt = function (range, oldScale) {
    axis.min(range.min).max(range.max).delta(axis.max() - (axis.min() > 0 ? 0 : axis.min()));
    recalc(oldScale);
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
    var ctx = chart.layer.ctx
      , topOffset = chart.grid.bound().bottom + axis.margin()
      , i = 0
      ;

    ctx.save();
    ctx.fillStyle = chart.fontColor();
    ctx.globalAlpha = 1;
    ctx.font = chart.font();
    axis.each(function (label) {
      var leftOffset = chart.grid.bound().left + i*labelSpace + labelSpace/2 - ctx.measureText(label).width/2;
      ctx.fillText(label, leftOffset, topOffset);
      i++;
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
    if (y!=false)
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

  // Note
  // x & y methods refer to start and end angle values

  var slice = new Chartmander.components.element();

  slice.set(title).label(data.label).value(data.value);

  var sliceIsHovered = function (mouse, center, model) {
    var x = mouse.x - center.x
      , y = mouse.y - center.y
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;

    if (fromCenter >= model.radius()*model.innerRadius() && fromCenter <= model.radius()) {
      hoverAngle = Math.atan2(y, x) - model.startAngle();
      if (hoverAngle < 0) {
        hoverAngle += Math.PI*2;
      }
      if (hoverAngle >= slice.x() && hoverAngle <= slice.y()) {
        hovered = true;
      }
    }
    return hovered;
  }

  var drawInto = function (ctx, chart, model, set) {
    ctx.beginPath();
    // Check if this slice was hovered
    if (chart.hovered()) {
      if ( sliceIsHovered(chart.mouse(), model.center(), model) ) {
        ctx.fillStyle = set.hoverColor();
        chart.tooltip.addItem({
          "set"  : set.title(),
          "label": slice.label(),
          "value": slice.value(),
          "color": set.color()
        });
      }
    }
    ctx.arc(model.center().x, model.center().y, model.radius(), model.startAngle()+slice.x(), model.startAngle()+slice.y(), model.clockWise());
    ctx.arc(model.center().x, model.center().y, model.radius()*model.innerRadius(), model.startAngle()+slice.y(), model.startAngle()+slice.x(), !model.clockWise());
    ctx.fill();
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  slice.drawInto = drawInto;

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

  var drawInto = function (ctx, chart, model, set) {
    ctx.save();
    if (chart.hovered() && isHovered(chart.mouse(), model)) {
      chart.hoverFinished(false);
      ctx.fillStyle = set.hoverColor();
      ctx.strokeStyle = set.color();
      chart.tooltip.addItem({
        "set"  : set.title(),
        "label": bar.label(),
        "value": bar.value(),
        "color": set.color()
      });
    }

    ctx.fillRect(bar.x(), bar.base(), model.barWidth(), bar.y());
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

  var isHovered = function (mouse, model) {
    var x = mouse.x
      , y = mouse.y
      , hovered = false
      , yRange = [bar.base(), bar.base()+bar.y()].sort(function(a,b){return a-b})
      ;

    if (x >= bar.x() && x <= bar.x() + model.barWidth() && y >= yRange[0] && y<= yRange[1]) {
      hovered = true;
    }

    return hovered;
  }

  ///////////////////////////////
  // Binding & Methods
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

  var drawInto = function (ctx, chart, model, set) {
    if (chart.hovered()) {
      var hover = isHovered(chart.mouse(), model.pointHoverRadius(), model.mergeHover());
    }
    // Draw circle in normal state
    ctx.beginPath();
    ctx.arc(point.x(), point.y(), model.pointRadius()*(1-point.getState()), 0, Math.PI*2, false);
    ctx.fill();
    // Stroke circle
    // if (style.normal.stroke) {
    //   ctx.lineWidth = style.normal.stroke*(1-point.getState());
    //   ctx.strokeStyle = style.normal.strokeColor;
    //   ctx.stroke();
    // }

    if (point.getState() > 0) {
      chart.hoverFinished(false);
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = model.pointHoverColor();
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
      model.addHoveredItem({
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

  // for old axis
  label.startAt = function (val) {
    label.savePosition(0, val);
    return label;
  };

  label.startAtY = function (val) {
    label.savePosition(0, val);
    return label;
  };

  label.startAtX = function (val) {
    label.savePosition(val, 0);
    return label;
  };

  return label;
};

Chartmander.components.crosshair = function (chart) {

  var crosshair = this;

  var x = null
    , y = null
    , visible = true
    , sticky = true
    , color = "#555"
    , lineWidth = 1
    ;

  var drawInto = function (ctx) {
    var bound = chart.grid.bound();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    x = chart.mouse().x;

    // if (sticky && chart.tooltip.hasItems()) {
    //   x = chart.tooltip.items()[0].x
    // }

    ctx.beginPath();
    ctx.moveTo(x, bound.top);
    ctx.lineTo(x, bound.bottom);
    ctx.stroke();
    ctx.restore();
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

Chartmander.components.tooltip = function (id) {

  var tooltip = this;

  var items      = []
    , container  = document.createElement('div')
    , header     = document.createElement('span')
    , content    = document.createElement('ul')
    , margin     = 30
    , dateFormat = 'MMMM YYYY'
    ;

  // Build tooltip
  container.id = "cm-tip-"+id;
  container.className = "cm-tip";
  container.appendChild(header);
  container.appendChild(content);

  var moveTo = function (pos) {
    container.style.top  = pos.y + 'px';
    container.style.left = pos.x + margin + 'px';
    return tooltip;
  }

  var generate = function () {
    container.style.opacity = 1;
    // header from first item
    header.innerHTML = moment(items[0].label).format(dateFormat);
    forEach(items, function (item) {
      content.appendChild(new TipNode(item.color, item.value, item.set));
    });
  };

  var TipNode = function (color, value, setTitle) {
    var node = document.createElement('li')
      , val  = document.createElement('strong')
      , icon = document.createElement('div')
      , set  = document.createTextNode(" " + setTitle)
      ;

    val.innerHTML = value;
    icon.style.backgroundColor = color;

    node.appendChild(icon);
    node.appendChild(val);
    node.appendChild(set);
    return node;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  tooltip.container = container;
  tooltip.moveTo = moveTo;
  tooltip.generate = generate;

  tooltip.addItem = function (_) {
    items.push(_);
  };

  tooltip.clear = function () {
    items = [];
    container.style.opacity = 0;
    header.innerHTML = null;
    content.innerHTML = null;
  }

  tooltip.hasItems = function () {
    return items.length > 0;
  };

  tooltip.dateFormat = function (_) {
    if (!arguments.length) return dateFormat;
    dateFormat = _;
    return tooltip;
  };

  return tooltip;
}

Chartmander.models.baseModel = function (chart) {
  
  // parent for each chartmander model
  // stores data and state

  var model = this;

  var datasets  = []
    , colors    = ["blue", "green", "red"]
    , font      = "13px Arial, sans-serif"
    , fontColor = "#555"
    , updated   = false
    ;

  ///////////////////////////////////
  // model Update - Parse Data
  ///////////////////////////////////

  var parse = function (data, element) {
    if (data === undefined) {
      throw new Error("No data specified for model (canvas#id) - " + chart.id());
    }
    // First render, create new datasets
    if (model.setsCount() === 0) {
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
        set.merge(data[i], model, element);
        i++;
      });
    }
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////
  
  model.parse = parse;

  model.colors = function (_) {
    if(!arguments.length) return colors;
    colors = _;
    return model;
  };

  // FAUX
  model.color = function (i) {
    if (colors[i] !== undefined)
      return colors[i];
    else
      return "red";
  };

  model.fontColor = function (_) {
    if (!arguments.length) return fontColor;
    fontColor = _;
    return model;
  };

  model.font = function (_) {
    if (!arguments.length) return font;
    font = _;
    return model;
  };

  // Data properties

  model.datasets = function (_) {
    if(!arguments.length) return datasets;
    datasets = _;
    return model;
  };
  
  model.dataset = function (_) {
    return datasets[_];
  };
  
  model.setsCount = function () {
    return datasets.length;
  };

  model.elementCount = function () {
    var total = 0;
    forEach(datasets, function (set) {
      total += set.elementCount();
    });
    return total;
  };

  // Animation properties

  model.updated = function (_) {
    if (!arguments.length) return updated;
    updated = _;
    return model;
  };

  // Interaction

  model.hovered = function () {
    var mouse = chart.mouse();

    return mouse.x >= model.margin().left && 
           mouse.x <= model.margin().left + model.width() &&
           mouse.y >= model.margin().top  &&
           mouse.y <= model.margin().top  + model.height();
  };

  return model;
};

Chartmander.models.slices = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var center          = { x: 0, y: 0 }
    , radius          = chart.width()/2
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
      if (chart.updated()) {
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
    center.x = chart.margin().left + radius;
    center.y = chart.margin().top  + radius;
  }

  ///////////////////////////////
  // Binding & Methods
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

  // init
  centerize();

  return model;
};

Chartmander.models.bars = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var stacked        = false // grouped otherwise
    , barWidth       = 0  // calculated so all sets can fit in chart
    , userBarWidth   = 30 // used only if default barWidth is higher
    , datasetSpacing = 0
    , base = 0
    ;

  chart.margin({top: 10, right: 10, bottom: 50, left: 50});

  var recalc = function (xAxis, yAxis, grid) {
    var i = 0, leftFix, x, y;

    barWidth = Math.floor( grid.width()/model.elementCount() );

    // allow userBarWith only downscale so it won't break model
    if (barWidth > userBarWidth) {
      barWidth = userBarWidth;
    }

    forEach(model.datasets(), function (set) {
      set.each(function (bar) {
        x = Math.ceil(grid.bound().left + (bar.label() - xAxis.min())/xAxis.scale() + i*barWidth);
        y = -bar.value()/yAxis.scale();
        if (model.updated()) {
          bar.savePosition();
        } else {
          bar.savePosition(x, 0);
        }
        bar.moveTo(x, y).saveBase(model.base()).moveBase(model.base());
      });
      i++;
    });
    return model;
  }

  var drawBars = function (ctx, _perc_) {
    ctx.save();
    forEach(model.datasets(), function (set) {
      ctx.fillStyle = set.color();
      set.each(function (bar) {
        bar
          .updatePosition(_perc_)
          .updatePositionBase(_perc_)
          .drawInto(ctx, chart, model, set);
      });
    });
    ctx.restore();
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  model.recalc = recalc;
  model.drawInto = drawBars;

  model.stacked = function (_) {
    if (!arguments.length) return stacked;
    stacked = _;
    return model;
  };

  model.barWidth = function (_) {
    if (!arguments.length) return barWidth; // Internal
    userBarWidth = _; // User defined
    return model;
  };

  model.datasetSpacing = function (_) {
    if (!arguments.length) return datasetSpacing;
    datasetSpacing = _;
    return model;
  };

  model.base = function (_) {
    if (!arguments.length) return base;
    base = _;
    return model;
  };
  
  return model;
}

Chartmander.models.lines = function (chart) {

  var model = new Chartmander.models.baseModel(chart);

  var lineWidth        = 2
    , showPoint        = true
    , pointRadius      = 5
    , pointHoverRadius = 20
    , pointHoverColor  = "orange"
    , areaVisible      = true
    , areaOpacity      = .29
    , mergeHover       = true
    , hoveredItems     = [] // hover buffer for all-in-mouse-range elements
    , base             = 0
    , startPosition    = "direct" // or center
    ;

  chart.margin({top: 10, right: 10, bottom: 50, left: 50});

  var recalc = function (xAxis, yAxis, grid) {
    var x, y;
    forEach(model.datasets(), function (set) {
      set.each(function (point) {
        // time axis specific
        x = Math.ceil(grid.bound().left + (point.label() - xAxis.min())/xAxis.scale());
        y = model.base() - point.value()/yAxis.scale();
        if (model.updated()) {
          point.savePosition();
        } else {
          if (startPosition == "center")
            point.savePosition(model.margin().left + grid.width()/2, model.base());
          if (startPosition == "direct")
            point.savePosition(x, model.base());
        }
        point.moveTo(x, y);
      });
    });
    return model;
  }

  var updatePoints = function (set, _perc_) {
    set.each(function (point) {
      point.updatePosition(_perc_);
    });
  }

  var drawArea = function (ctx, set) {
    ctx.save();
    ctx.fillStyle = set.color();
    ctx.globalAlpha = areaOpacity;
    ctx.beginPath();
    ctx.moveTo(set.getElement(0).x(), model.base());
    ctx.lineTo(set.getElement(0).x(), set.getElement(0).y());
    set.each(function (point) {
      ctx.lineTo(point.x(), point.y());
    });
    ctx.lineTo(set.getElement("last").x(), model.base());
    ctx.fill();
    ctx.restore();
  }

  var drawLines = function (ctx, set) {
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

  var drawPoints = function (ctx, set) {
    ctx.save();
    ctx.strokeStyle = set.color();
    ctx.fillStyle = set.color();
    set.each(function (point) {
      point.drawInto(ctx, chart, model, set);
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

  var drawInto = function (ctx, _perc_) {
    forEach(model.datasets(), function (set) {
      hoveredItems = [];
      updatePoints(set, _perc_);
      if (areaVisible) {
        drawArea(ctx, set);
      }
      drawLines(ctx, set);
      if (showPoint)
        drawPoints(ctx, set);
    });
  }

  ///////////////////////////////
  // Public Methods
  ///////////////////////////////

  model.recalc = recalc;
  model.drawInto = drawInto;

  model.areaVisible = function (_) {
    if (!arguments.length) return areaVisible;
    areaVisible = _;
    return model;
  }

  model.areaOpacity = function (_) {
    if (!arguments.length) return areaOpacity;
    areaOpacity = _;
    return model;
  }

  model.lineWidth = function (_) {
    if (!arguments.length) return lineWidth;
    lineWidth = _;
    return model;
  }

  model.pointRadius = function (_) {
    if (!arguments.length) return pointRadius;
    pointRadius = _;
    return model;
  }

  model.pointHoverRadius = function (_) {
    if (!arguments.length) return pointHoverRadius;
    pointHoverRadius = _;
    return model;
  }

  model.pointHoverColor = function (_) {
    if (!arguments.length) return pointHoverColor;
    pointHoverColor = _;
    return model;
  }

  model.mergeHover = function (_) {
    if (!arguments.length) return mergeHover;
    mergeHover = _;
    return model;    
  }

  model.hoveredItems = function (_) {
    if (!arguments.length) return hoveredItems;
    hoveredItems = _;
    return model;
  };

  model.addHoveredItem = function (_) {
    hoveredItems.push(_);
    return model;
  };

  model.base = function (_) {
    if (!arguments.length) return base;
    base = _;
    return model;
  };

  model.showPoint = function (_) {
    if (!arguments.length) return showPoint;
    showPoint = _;
    return model;
  };

  model.startPosition = function (_) {
    if (!arguments.length) return startPosition;
    startPosition = _;
    return model;
  };

  return model;
};

Chartmander.components.baseChart = function (canvasID) {

  var chart = this;

  var id            = canvasID // unique ID selector
    , canvas        = document.getElementById(canvasID) // DOM element
    , wrapper       = document.createElement('div') // for canvas element (tooltip is relatively positioned to this element)
    , ctx           = canvas.getContext('2d')
    , width         = ctx.canvas.width
    , height        = ctx.canvas.height
    , margin    = { top: 0, right: 0, bottom: 0, left: 0 }
    , mouse         = { x: 0, y: 0 }
    , hovered       = false
    , hoverFinished = true
    , animate            = true
    , duration           = 1000 // animation duration on load
    , animationProgress = 0
    , easing             = "easeInQuint"
    , updated            = false
    , onHover       = null  // function specified by every chart (e.g. in /src/charts/pie.js)
    , onLeave       = null  // detto
    , drawChart     = null  // detto
    ;

  ///////////////////////////////////
  // Wrapper for chart
  ///////////////////////////////////

  wrapper.id = "chartmander-"+id;
  wrapper.className = "cm-wrapper";
  wrapper.wrap(canvas);

  ///////////////////////////////////
  // Tooltip
  ///////////////////////////////////

  var tooltip = new Chartmander.components.tooltip(id);
  wrapper.insertBefore(tooltip.container, canvas);

  ///////////////////////////////////
  // Interaction Setup
  ///////////////////////////////////

  canvas.addEventListener("mouseenter", handleEnter, false);
  canvas.addEventListener("mousemove",  handleHover, false);
  canvas.addEventListener("mouseleave", handleLeave, false);

  if (window.devicePixelRatio) {
    ctx.canvas.style.width  = width  + "px";
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
    // if (animationProgress >= 1 && !tooltip.isAnimated() && !config.hoverFinished ) {
    if (hoverFinished) {
      if (animationProgress >= 1) {
        draw(true);
        // onHover();
      }
    }
  }

  function handleEnter () {
    hovered = true;
  }

  function handleLeave () {
    hovered = false;
    if (animationProgress >= 1) {
      draw(true);
      // onLeave();
    }
  }

  ///////////////////////////////
  // Animation loop
  ///////////////////////////////

  var draw = function (finished) {
    var easingFunction = easings[easing]
      , _perc_
      , elapsedTime = 0
      , lastFrame = Date.now()
      , currentFrame
      , frameDelta
      ;

    if (!updated)
      animationProgress = animate ? 0 : 1;

    function loop () {
      currentFrame = Date.now();
      frameDelta = currentFrame - lastFrame;
      lastFrame = currentFrame;
      elapsedTime += frameDelta;
      if (finished) {
        animationProgress = 1;
      } else {
        if (elapsedTime > duration)
          elapsedTime = duration;
        animationProgress = elapsedTime/duration;
      }

      _perc_ = easingFunction(animationProgress);

      tooltip.clear();
      ctx.clearRect(0, 0, width, height);
      hoverFinished = true;

      drawChart(ctx, _perc_);
      
      if (hovered && tooltip.hasItems()) {
        tooltip.generate();
        tooltip.moveTo(mouse);
      }

      // Request self-repaint if chart or data element has not finished animating yet
      if (animationProgress < 1 || !hoverFinished) {
        requestAnimationFrame(loop);
      }
      else {
        console.log("Animation Finished.");
      }
    }
    requestAnimationFrame(loop);
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  chart.draw = draw;
  chart.ctx = ctx;
  chart.tooltip = tooltip;

  chart.id = function (_) {
    if(!arguments.length) return id;
    id = _;
    return chart;
  };

  chart.width = function (_) {
    if(!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if(!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.mouse = function (_) {
    if(!arguments.length) return mouse;
    mouse.x = typeof _.x != 'undefined' ? _.x : mouse.x;
    mouse.y = typeof _.y != 'undefined' ? _.y : mouse.y;
    return chart;
  };

  chart.hovered = function (_) {
    if (!arguments.length) return hovered;
    hovered = _;
    return chart;
  };

  chart.hoverFinished = function (_) {
    if (!arguments.length) return hoverFinished;
    hoverFinished = _;
    return chart;
  };

  chart.completed = function (_) {
    if(!arguments.length) return animationProgress;
    animationProgress = _;
    return chart;
  };

  chart.easing = function (_) {
    if (!arguments.length) return easing;
    easing = _;
    return chart;
  };

  chart.duration = function (_) {
    if (!arguments.length) return duration;
    duration = _;
    return chart;
  };

  chart.animate = function (_) {
    if (!arguments.length) return animate;
    animate = _;
    return chart;
  };

  chart.updated = function (_) {
    if (!arguments.length) return updated;
    updated = _;
    return chart;
  };

  chart.onHover = function (f) {
    onHover = f;
    return chart;
  };

  chart.onLeave = function (f) {
    onLeave = f;
    return chart;
  };

  chart.drawChart = function (f) {
    drawChart = f;
    return chart;
  };

  return chart;
};

Chartmander.charts.pie = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var pie = new Chartmander.models.slices(chart);

  ///////////////////////////////////
  // Setup drawing & defaults
  ///////////////////////////////////
  // pie
  //   .radius(chart.width()/2)
  //   ;
  
  chart
    .drawChart(function (ctx, _perc_) {
      pie.drawInto(ctx, _perc_);
    })
    ;


  var render =  function (data) {
    pie.parse(data, Chartmander.components.slice);
    pie.recalc();
    
    chart
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  chart.pie = pie;

  chart.render = render;

  return chart;
};

Chartmander.charts.historicalBar = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var bars      = new Chartmander.models.bars(chart)
    , xAxis     = new Chartmander.components.timeAxis(chart, bars)
    , yAxis     = new Chartmander.components.yAxis(chart, bars)
    , grid      = new Chartmander.components.grid(chart, xAxis, yAxis)
    , x0, y0
    ;

  ///////////////////////////////////
  // Setup defaults
  ///////////////////////////////////

  chart.drawChart(function (ctx, _perc_) {
    grid.drawInto(ctx, _perc_);

    if (xAxis.visible()) {
      xAxis
        .animIn()
        .drawInto(ctx, _perc_);
      // if (x0 && x0.state > 0) {
      //   ctx.save();
      //   forEach(x0.labels, function (label) {

      //   });
      //   ctx.restore();
      // } 
    }

    if (yAxis.visible()) {
      yAxis
        .animIn()
        .drawInto(ctx, _perc_);

      if (y0 && y0.state > 0) {
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = bars.fontColor();
        ctx.font = bars.font();
        ctx.globalAlpha = y0.state;
        forEach(y0.labels, function (label) {
          label.updatePosition(_perc_);
          ctx.fillText(label.label().toString() + " " + yAxis.unit(), grid.bound().left - yAxis.margin(), label.y());
        });
        ctx.restore();
        y0.state -= .01;
      }
    }
    bars.drawInto(ctx, _perc_);
  });

  ///////////////////////////////
  // Life cycle
  ///////////////////////////////

  var render =  function (data) {
    bars.parse(data, Chartmander.components.bar);
    var oldYScale; //undefined
    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(bars.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (bars.updated()) {
      x0 = xAxis.copy();
      y0 = yAxis.copy();

      oldYScale = y0.scale;
    }

    // axes use grid height to calculate their scale
    xAxis.adapt(xrange);
    yAxis.adapt(yrange, oldYScale);
    bars.base(grid.bound().bottom - yAxis.zeroLevel());

    // recalc old labels to new position
    if (bars.updated()) {
      forEach(y0.labels, function (label) {
        label.savePosition().moveTo(false, bars.base() - label.value()/yAxis.scale());
      });
    }

    bars.recalc(xAxis, yAxis, grid);
    
    chart
      .completed(0)
      .draw(false);
  }


  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.grid = grid;
  chart.bars = bars;

  chart.render = render;

  return chart;
}

Chartmander.charts.categoryBar = function (canvas) {

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var layer     = new Chartmander.components.layer(canvas)
    , bars      = new Chartmander.models.bar()
    , xAxis     = new Chartmander.components.categoryAxis()
    , yAxis     = new Chartmander.components.numberAxis()
    , grid      = new Chartmander.components.grid()
    , crosshair = new Chartmander.components.crosshair()
    ;

  bars.layer = layer; // super important

  var
    // , datasetSpacing = 0
    // , groupWidth     = 0
    // , groupOffset    = 0
      xAxisVisible   = true
    , yAxisVisible   = true
    ;

  layer
    .onHover(function () {
      bars.draw(true);
    })
    .onLeave(function () {
      if ( bars.completed() ) {
        bars.draw(true);
      }
    })
    ;

  bars
    .width(layer.width())
    .height(layer.height())
    ;

  var y0;

  var render =  function (data) {
    bars.parse(data, Chartmander.components.bar);
    var oldYScale; //undefined
    var xLabels = [];
    // excract categories - just from #1 dataset
    bars.dataset(0).each(function (element) {
      xLabels.push(element.label());
    });

    var yrange = getRange(function(){
      var values = [];
      forEach(bars.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    if (bars.updated()) {
      y0 = yAxis.copy();
      oldYScale = y0.scale;
    }

    grid.adapt(bars);
    xAxis.adapt(bars, xLabels);
    yAxis.adapt(bars, yrange, oldYScale);

    bars.base()

    // recalc old labels to new position
    if (bars.updated()) {
      forEach(y0.labels, function (label) {
        label.savePosition().moveTo(false, bars.base() - label.value()/yAxis.scale());
      });
    }
    
    bars
      .recalc(xAxis, yAxis, grid)
      .completed(0)
      .draw(false);
  }

  bars.drawChart(function (_perc_) {
    var ctx = layer.ctx;

    grid.drawInto(bars, _perc_);

    if (xAxisVisible) {
      xAxis
        .animIn()
        .drawInto(bars, _perc_);
      // if (x0 && x0.state > 0) {
      //   ctx.save();
      //   forEach(x0.labels, function (label) {

      //   });
      //   ctx.restore();
      // } 
    }

    if (yAxisVisible) {
      yAxis
        .animIn()
        .drawInto(bars, _perc_);

      if (y0 && y0.state > 0) {
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = bars.fontColor();
        ctx.font = bars.font();
        ctx.globalAlpha = y0.state;
        forEach(y0.labels, function (label) {
          label.updatePosition(_perc_);
          ctx.fillText(label.label().toString() + " " + yAxis.unit(), grid.bound().left - yAxis.margin(), label.y());
        });
        ctx.restore();
        y0.state -= .01;
      }
    }

    bars.drawModel(_perc_);
  });

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  bars.xAxis = xAxis;
  bars.yAxis = yAxis;
  bars.grid = grid;
  bars.crosshair = crosshair;

  bars.render = render;

  bars.base = function (_) {
    return grid.bound().bottom;
  };

  bars.showXAxis = function (_) {
    if (!arguments.length) return xAxisVisible;
    xAxisVisible = _;
    return bars;
  };

  bars.showYAxis = function (_) {
    if (!arguments.length) return yAxisVisible;
    yAxisVisible = _;
    return bars;
  };

  return bars;
}

Chartmander.charts.line = function (canvas) {

  var chart = new Chartmander.components.baseChart(canvas);

  ///////////////////////////////////
  // Use Components
  ///////////////////////////////////

  var lines     = new Chartmander.models.lines(chart)
    , xAxis     = new Chartmander.components.timeAxis(chart, lines)
    , yAxis     = new Chartmander.components.yAxis(chart, lines)
    , grid      = new Chartmander.components.grid(chart, xAxis, yAxis)
    , crosshair = new Chartmander.components.crosshair(chart)
    , x0, y0
    ;

  ///////////////////////////////////
  // Setup Defaults
  ///////////////////////////////////

  chart.drawChart(function (ctx, _perc_) {
    grid.drawInto(ctx, _perc_);
    
    if (xAxis.visible()) {
      xAxis
        .animIn()
        .drawInto(ctx, _perc_);
    }

    if (yAxis.visible()) {
      yAxis
        .animIn()
        .drawInto(ctx, _perc_);
    }

    if (chart.hovered() && crosshair.visible() && grid.hovered(chart.mouse())) {
      crosshair.drawInto(ctx);
    }
    
    lines.drawInto(ctx, _perc_);
  });

  ///////////////////////////////
  // Life cycle
  ///////////////////////////////

  var render =  function (data) {
    lines.parse(data, Chartmander.components.point);

    var xrange = getRange(getArrayBy(data, "label"));
    var yrange = getRange(function(){
      var values = [];
      forEach(lines.datasets(), function (set) {
        values.push(set.min());
        values.push(set.max());
      });
      return values;
    }());

    // grid before axes
    // axes use grid height to calculate their scale
    xAxis.adapt(xrange);
    yAxis.adapt(yrange);
    lines.base(grid.bound().bottom - yAxis.zeroLevel());

    lines.recalc(xAxis, yAxis, grid);
    
    chart
      .completed(0)
      .draw(false);
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////

  chart.xAxis     = xAxis;
  chart.yAxis     = yAxis;
  chart.grid      = grid;
  chart.crosshair = crosshair;
  chart.lines     = lines;

  chart.render    = render;

  return chart;
};

})();
