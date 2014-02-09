
var Chartmander = function (canvasID) {

  var chart = this

  this.canvas = document.getElementById(canvasID);
  this.ctx = this.canvas.getContext('2d');

  // Global Chartmander defaults
  this.config = {
    width: this.ctx.canvas.width,
    height: this.ctx.canvas.height,
    colors: ["#EC6650", "#86D5F1", "#FAC84B"],
    font: "13px Arial, sans-serif",
    fontColor: "#555",
    animate: true,
    hovered: false,
    animationStep: 100,
    animationCompleted: 0,
    easing: "easeOutCubic",
    onAnimationCompleted: null,
    mouse: {}
  };

  this.datasets = [];
  this.crosshair = {
    x: null,
    y: null,
    visible: true,
    sticky: true,
    color: "orangered",
    lineWidth: 1
  };
  // Create tooltip
  this.tooltip = new Tooltip([{
    set: "blank",
    y: "0"
  }]);

  this.canvas.addEventListener("mouseenter", handleEnter, false);
  this.canvas.addEventListener("mousemove", handleHover, false);
  this.canvas.addEventListener("mouseleave", handleLeave, false);

  if (window.devicePixelRatio) {
    this.ctx.canvas.style.width = this.config.width + "px";
    this.ctx.canvas.style.height = this.config.height + "px";
    this.ctx.canvas.height = this.config.height * window.devicePixelRatio;
    this.ctx.canvas.width = this.config.width * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  this.clear = function () {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height);
  };

  this.draw = function (finished) {
    var ctx = chart.ctx
      , cfg = chart.config
      , margin = cfg.margin
      , tip = chart.tooltip
      , easingFunction = chart.easing(cfg.easing)
      , animationStep = 1/cfg.animationStep
      ;

    cfg.animationCompleted = cfg.animate ? 0 : 1

    function loop () {
      if (finished)
        cfg.animationCompleted = 1;
      else if (cfg.animationCompleted < 1)
        // catch overflow
        cfg.animationCompleted += animationStep;

      // Clear hover every time
      // Filled during painting
      // Used and rendered by tooltip
      chart.hoveredItems = [];

      chart.clear();

      if (chart.xAxis)
        chart.xAxis.drawInto(chart);
      if (chart.yAxis)
        chart.yAxis.drawInto(chart);
      if (chart.grid)
        chart.grid.drawInto(chart);

      if (cfg.type === "line") {
        chart.drawLines(easingFunction(cfg.animationCompleted));
        chart.grid.drawCrosshairInto(chart);
        chart.drawHovered();
      }
      else if (cfg.type === "bar") {
        chart.drawBars(chart.grid.config.properties, easingFunction(cfg.animationCompleted));
      }
      else if (cfg.type === "pie") {
        chart.drawSegments(easingFunction(cfg.animationCompleted));
      }

      if (tip) 
        tip.drawInto(chart);

      if ( cfg.animationCompleted < 1 || (tip.getState() > 0 && tip.getState() < 1) ) {
        requestAnimationFrame(loop);
      }
      else {
        console.log("Animation Finished.")
      }
    }
    // Global paint settings
    ctx.textBaseline = "middle";
    ctx.font = cfg.font;
    // First paint
    requestAnimationFrame(loop);
  }

  function handleHover (e) {
    chart.config.mouse = {
      x: e.pageX - this.offsetLeft,
      y: e.pageY - this.offsetTop
    }
    if (chart.config.animationCompleted >= 1 && !chart.tooltip.isAnimated()){
      chart.draw(true)
    }
  }

  function handleEnter () {
    chart.config.hovered = true;
  }

  function handleLeave () {
    chart.config.hovered = false;
    if (chart.config.animationCompleted >= 1)
      chart.draw(true)
  }

  this.easingFunction = function (_) {
    this.config.easing = _;
    return chart
  }

  this.pointRadius = function (_) {
    this.config.pointRadius = _;
    return chart
  }

  this.fontColor = function (_) {
    this.config.fontColor = _;
    return chart
  }

  this.font = function (_) {
    this.config.font = _;
    return chart
  }

  this.crossColor = function (_) {
    this.crosshair.color = _;
    return chart
  }

  this.colors = function (_) {
    this.config.colors = _;
    return chart
  }

  return chart;
}


Chartmander.prototype.Bar = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Bar Chart Default
  cfg.type = "bar";
  cfg.margin = { top: 50, right: 50, bottom: 50, left: 50 };
  cfg.stacked = false;
  cfg.maxBarWidth = 20;
  cfg.datasetSpacing = 5;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type);
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalc
  chart.grid.calculateProperties(cfg.margin, cfg);
  cfg.labelSpace = chart.grid.config.properties.width/chart.xAxis.labels.length;
  chart.yAxis.recalc(chart.grid.config.properties.height)

  this.drawBars = function (grid, _perc_) {
    var setsCount = chart.datasets.length
      , barWidth = cfg.maxBarWidth

    if( (setsCount * barWidth + (setsCount-1)*cfg.datasetSpacing) > cfg.labelSpace )
      barWidth = Math.floor( (cfg.labelSpace - ((setsCount-1)*cfg.datasetSpacing)) / setsCount );

    var datasetCounter = 0
      , groupWidth = barWidth*chart.datasets.length + cfg.datasetSpacing*(chart.datasets.length-1)
      , groupOffset = (cfg.labelSpace - groupWidth)/2

    ctx.save();
    forEach(chart.datasets, function (set) {
      ctx.fillStyle = cfg.colors[datasetCounter];
      var counter = 0;
      set.each(function (bar) {
        var fromLeft = grid.left + groupOffset + datasetCounter*barWidth + counter*cfg.labelSpace + datasetCounter*cfg.datasetSpacing;
        ctx.fillRect(fromLeft, grid.bottom - chart.yAxis.zeroLevel, barWidth, -bar.value/chart.yAxis.valuePerPixel*_perc_ );
        counter++;
      })
      datasetCounter++;
    })
    ctx.restore();
  }

  // User methods
  this.datasetSpacing = function (_) {
    this.config.datasetSpacing = _;
    return chart;
  }

  // Ignite
  chart.draw();
  return chart;
}

Chartmander.prototype.Pie = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Pie Chart Defaults
  cfg.type = "pie";
  cfg.margin = { top: 50, right: 50, bottom: 50, left: 50 };
  cfg.radius = 100;
  cfg.innerRadius = 70;
  cfg.scaleAnimation = false;
  cfg.rotateAnimation = true;

  // Construct
  chart.dataset = new Dataset(data[0], "pie");

  this.drawSegments = function (_perc_) {
    var   segmentsTotal = chart.dataset.size()
      , radiusScale = cfg.scaleAnimation ? _perc_ : 1
      , pieRotate = cfg.rotateAnimation ? _perc_ : 1
      , centerX = ( ( cfg.width - (cfg.radius*2) ) / 2 ) + cfg.radius
      , centerY = ( ( cfg.height - (cfg.radius*2) ) / 2 ) + cfg.radius
      , startAngle = -Math.PI/2
      , segmentIndex = 0
      ;

    chart.dataset.each(function (segment) {
      var segmentAngle = segment.getAngle(segmentsTotal)*pieRotate;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusScale * cfg.radius, startAngle, startAngle + segmentAngle, false);
      ctx.arc(centerX, centerY, radiusScale * cfg.innerRadius, startAngle + segmentAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = cfg.colors[segmentIndex];
      ctx.fill();

      segmentIndex++;
      startAngle += segmentAngle;
    })
  }

  // User methods
  this.innerRadius = function (_) {
    this.config.innerRadius = _;
    return chart;
  }

  // Ignite
  chart.draw();
  return this;
};

Chartmander.prototype.Line = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Line Chart Defaults
  cfg.type = "line";
  cfg.margin = { top: 50, right: 50, bottom: 50, left: 50 };
  cfg.pointRadius = 6;
  cfg.lineWidth = 2;
  cfg.pointHoverRadius = 30;
  cfg.mergeHover = true;

  // Construct
  chart.datasets = getDatasetFrom(data, "line");
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalculation based on provided data
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.yAxis.recalc(chart.grid.config.properties.height)
  cfg.labelSpace = chart.grid.config.properties.width/chart.xAxis.labels.length;
  forEach(chart.datasets, function(set){
    set.recalcPosition(chart);
  })

  this.drawLines = function (_perc_) {

    var counter = {
        dataset: 0,
        element: 1
      }
      , setsCount = chart.datasets.length
      , barWidth = cfg.maxBarWidth
      ;

    if( (setsCount * barWidth + (setsCount-1)*cfg.datasetSpacing) > cfg.labelSpace )
      barWidth = Math.floor( (cfg.labelSpace - ((setsCount-1)*cfg.datasetSpacing)) / setsCount );

    ctx.lineWidth = cfg.lineWidth;
    ctx.save();

    forEach(chart.datasets, function (set) {
      ctx.strokeStyle = cfg.colors[counter.dataset];
      ctx.fillStyle = cfg.colors[counter.dataset];

      ctx.beginPath();
      // Draw Lines
      counter.element = 1;
      set.each(function (point) {
        point.drawInto(chart, counter, _perc_, "line")
        counter.element++;
      });
      ctx.stroke();

      // Draw circles
      counter.element = 1;
      set.each(function (point) {
        point.drawInto(chart, counter, _perc_, "circle");
        counter.element++;
      });

      counter.dataset++;
    })

    ctx.restore();
  }

  chart.drawHovered = function () {
    var ctx = chart.ctx;
    ctx.save();
    forEach(chart.hoveredItems, function(item) {
      ctx.fillStyle = cfg.colors[item.setID];
      ctx.beginPath();
      if(chart.crosshair.x == item.position.x)
        ctx.arc(item.position.x, item.position.y, cfg.pointRadius+5, 0, Math.PI*2, false);
      else {
        chart.hoveredItems.splice(indexOf.call(chart.hoveredItems, item), 1);
      }
      ctx.fill();
    })
    ctx.restore();
  }

  // User methods

  // Ignite
  chart.draw();
  return chart;
};

// Components
var xAxis = function (labels) {

  this.labels = labels;

  this.each = function (action) {
    forEach(this.labels, action)
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , config = chart.config
      , grid = chart.grid.config.properties

    var counter = 0;
    ctx.save();
    ctx.fillStyle = config.fontColor;
    ctx.font = config.font;
    this.each(function(label){
      var labelWidth = ctx.measureText(label).width
        , start = config.labelSpace/2 + (grid.left + config.labelSpace*counter) - labelWidth / 2

      ctx.fillText(label, start, grid.bottom + 25);
      counter++;
    });
    ctx.restore();
  }

}

var yAxis = function (labels) {

  var axis = this

  this.dataMin = labels[0];
  this.dataMax = labels[1];
  this.labels = [];
  this.zeroLevel = 0;
  this.valuePerPixel = 0.1;
  this.labelOffset

  this.recalc = function (height) {

    var   delta = this.dataMax - this.dataMin
      , maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
      , labelValueSteps = [1, 2, 5]
      , stepBase = delta.toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelValueSteps);

    this.valuePerPixel = delta/height
    this.zeroLevel = height - this.dataMax/this.valuePerPixel
    this.labels = getLabels( getAxeSetup(stepBase, stepExponent) )

    function getLabels (setup) {
      var labels = []
        , lefts = setup.labelCount
        , step = setup.valueStep
        , currLabel = 0
        ;

      labels.push({
        value: 0,
        string: "0",
        position: axis.zeroLevel
      });

      while(Math.abs(currLabel - axis.dataMin) > step){
        currLabel = currLabel - step;
        labels.splice(0, 0, {
          value: currLabel,
          string: currLabel.toString(),
          position: axis.zeroLevel + currLabel/axis.valuePerPixel
        })
      }

      currLabel = 0;

      while( (axis.dataMax - currLabel) > step){
        currLabel = currLabel + step;
        labels.push({
          value: currLabel,
          string: currLabel.toString(),
          position: axis.zeroLevel + currLabel/axis.valuePerPixel
        })
      }

      return labels;
    }

    function getAxeSetup (base, exponent, stop) {
      var currIndex = indexOf.call(labelValueSteps, base)
        , newIndex
        , newExponent
        , currLabelValueStep = Math.pow(10, exponent)*base
        , currLabelCount = delta/currLabelValueStep
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
        newIndex = (currIndex - 1 <= -1) ? 2 : (currIndex - 1)
        newExponent = (newIndex == 2) ? (exponent - 1) : exponent

        return getAxeSetup(labelValueSteps[newIndex], newExponent);
      }
      else {
        // Too far, return previous and stop
        newIndex = (currIndex + 1 >=  3) ? 0 : (currIndex + 1)
        newExponent = (newIndex == 0) ? (exponent + 1) : exponent

        return getAxeSetup(labelValueSteps[newIndex], newExponent, true);
      }

    }
  }

  this.each = function (action) {
    forEach(this.labels, action);
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , config = chart.config
      , grid = chart.grid.config.properties

    var counter = this.labels.length;
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = config.fontColor;
    ctx.font = config.font;
    this.each(function(label){
      ctx.fillText(label.string, grid.left - 10, grid.bottom - label.position);
      counter--;
    });
    ctx.restore();
  }
}

var Grid = function () {

  // Grid defaults
  this.config = {
    visible : true,
    horizontalLines : true,
    verticalLines : true,
    lineColor : "#DBDFE5",
    lineWidth : 1,
    evenOddContrast : true,
    oddColor : "#EAEAEA"
  }

  this.calculateProperties = function (margin, config) {
    this.config.properties = {
      top: margin.top,
      right: config.width - margin.right,
      bottom: config.height - margin.bottom,
      left: margin.left,
      width: (config.width - margin.right) - margin.left,
      height: (config.height - margin.bottom) - margin.top
    }
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , grid = this.config;

    if (grid.visible) {
      ctx.strokeStyle = grid.lineColor;
      ctx.lineWidth = grid.lineWidth;

      if (grid.horizontalLines) {
        chart.yAxis.each(function(line){
          var yOffset = grid.properties.bottom - line.position;
          ctx.beginPath();
          ctx.moveTo(grid.properties.left, yOffset);
          ctx.lineTo(grid.properties.right, yOffset);
          ctx.stroke();
        })
      }

      if (grid.verticalLines) {
        for (var i = 0; i < chart.xAxis.labels.length+1; i++) {
          var xOffset = grid.properties.left + i*(grid.properties.width / chart.xAxis.labels.length);

          ctx.beginPath();
          ctx.moveTo(xOffset, grid.properties.top);
          ctx.lineTo(xOffset, grid.properties.bottom);
          ctx.stroke();
        };
      }
    }
  }

  this.isInsideX = function (point) {
     return point.x >= this.config.properties.left && point.x <= this.config.properties.right
  }

  this.drawCrosshairInto = function (chart) {

    var crosshair = chart.crosshair

    if (crosshair.visible && chart.config.hovered) {
      chart.ctx.save()
      chart.ctx.strokeStyle = crosshair.color;
      chart.ctx.lineWidth = crosshair.lineWidth;

      if (chart.grid.isInsideX(chart.config.mouse)) {
        crosshair.x = chart.config.mouse.x;
        if (crosshair.sticky && chart.hoveredItems.length > 0) {
          var availablePoints = []
          forEach(chart.hoveredItems, function (point) {
            availablePoints.push(point.position.x)
          })
          crosshair.x = closestElement(crosshair.x, availablePoints)
        }
      }
      else
        return;

      chart.ctx.beginPath();
      chart.ctx.moveTo(crosshair.x, this.config.properties.top);
      chart.ctx.lineTo(crosshair.x, this.config.properties.bottom);
      chart.ctx.stroke();
      chart.ctx.restore();
    }
  }

  this.lineColor = function (_){
    this.config.lineColor = _;
    return this;
  }
  this.verticalLines = function (_){
    this.config.verticalLines = _;
    return this;
  }
}

var Dataset = function (set, type) {

  this.title = set.title;
  this.elements = getElements(type);
  this.type = type

  this.each = function (action) {
    forEach(this.elements, action)
  }

  this.size = function () {
    var total = 0;
    this.each(function(element){
      total += element.value
    })
    return total
  }

  this.recalcPosition = function (chart) {
    var yBase = chart.grid.config.properties.bottom - chart.yAxis.zeroLevel
      ;
    this.each(function (element) {
      element.setCurrent(yBase);
      element.setDesired(element.value/chart.yAxis.valuePerPixel)
    })
  }

  function getElements (type) {
    var result = [];
    
    switch (type) {
      case "bar": forEach(set.values, function (barData) {
              result.push(new Bar(barData, set.title));
            });
            break;
      case "pie": forEach(set.values, function (segmentData) {
              result.push(new Segment(segmentData, set.title));
            });
            break;
      case "line": forEach(set.values, function (pointData) {
              result.push(new Point(pointData, set.title));
            });
            break;
      default: return;
    }
    return result;
  }

  return this;
}

var Tooltip = function (items) {

  var tip = this

  this.items = items

  // Tooltip defaults
  this.config = {
    gravity: "left",
    margin: 20,
    steps: 100
  }
  this.state = {
    isAnimated: false,
    animationCompleted: 0,
    current: {
      x: 0,
      y: 0
    },
    desired: {
      x: 0,
      y: 0
    }
  }

  this.getStrings = function () {
    var strings = []
    forEach(tip.items, function (item) {
      strings.push(item.set + " " + item.y);
    })
    return strings;
  }

  this.getXLabel = function () {
    return tip.items ? tip.items[0].x : "undefined";
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , tip = chart.tooltip
      , mouse = chart.config.mouse
      , cross = chart.crosshair
      // , leftOffset = mouse.x
      , topOffset = mouse.y
      , leftOffset = cross.x
      , labelCounter = 1 // Categories in tooltip
      ;

    // Set drawing position
    if (tip.gravity() === "left")
      leftOffset += tip.config.margin;

    // Check for new tooltip data
    if (tip.hoveredItems() !== chart.hoveredItems && chart.hoveredItems.length > 0)
      tip.hoveredItems(chart.hoveredItems)

    tip.isAnimated(true);

    if (chart.hoveredItems.length > 0)
      tip.fadeIn();
    else
      tip.fadeOut();


    ctx.save();
    ctx.globalAlpha = tip.getState();
    ctx.fillStyle = "#555";
    ctx.fillRect(leftOffset, topOffset, 150, 150);
    ctx.fillStyle = "#FFF";
    // TODO padding ...
    ctx.fillText(tip.getXLabel(), leftOffset + 10, topOffset+labelCounter*20)
    labelCounter++;
    ctx.fillText("animated:" + tip.state.animationCompleted, leftOffset + 10, topOffset+labelCounter*20)
    labelCounter++;

    forEach(tip.getStrings(), function (string) {
      ctx.fillText(string, leftOffset + 10, mouse.y+labelCounter*20);
      labelCounter++;
    })
    ctx.restore();
  }

  this.hoveredItems = function (_) {
    if(!arguments.length) return tip.items;
    tip.items = _;
  }

  this.fadeOut = function () {
      tip.state.animationCompleted -= .05;

      if (tip.state.animationCompleted <= 0) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 0;
      }
  } 

  this.fadeIn = function () {
      tip.state.animationCompleted += .05;

      if (tip.state.animationCompleted >= 1) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 1;
      }
  }

  this.getState = function () {
    return tip.state.animationCompleted;
  }
  this.isAnimated = function (_) {
    if(!arguments.length)
      return tip.state.isAnimated
    else
      tip.state.isAnimated = _;
  }
  // User methods
  this.gravity = function (_) {
    if (!arguments.length) return tip.config.gravity;
    tip.gravity = _;
    return this;
  }

  return this;
}

var Bar = function (data) {
  this.value = data.value;
  this.label = data.label;
}

var Segment = function (data) {
  this.value = data.value;
  this.label = data.label;
  this.getAngle = function (total) {
    return (this.value/total)*Math.PI*2;
  }
}

var Point = function (data, title) {

  this.set = title;
  this.label = data.label;
  this.value = data.value;
  this.state = {
    hovered: false,
    animationCompleted: 0,
    current: {
      x: 0,
      y: 0
    },
    desired: {
      x: 0,
      y: 0
    }
  }

  this.drawInto = function (chart, counter, _perc_, type) {
    var ctx = chart.ctx
      , cfg = chart.config
      , grid = chart.grid.config.properties
      , shiftX = cfg.labelSpace/2
      , pointX = grid.left + counter.element*cfg.labelSpace - shiftX
      , pointY = this.state.current.y - (this.state.desired.y)*_perc_
      // , radius = 
      ;

    if (type === "line") {
      ctx.lineTo(pointX, pointY);
    }
    else if (type === "circle") {
      ctx.beginPath();
      ctx.arc(pointX, pointY, cfg.pointRadius, 0, Math.PI*2, false);
      ctx.fill();
    }

    if (this.isHovered(cfg.mouse, {x: pointX, y: pointY}, cfg.pointHoverRadius, cfg.mergeHover) && cfg.hovered) {
      chart.hoveredItems.push({
        set: this.set,
        setID: counter.dataset,
        y: this.value,
        x: this.label,
        position: {
          x: pointX,
          y: pointY
        }
      })
    }
  }

  this.isHovered = function (mouse, point, radius, mergeHover) {
    if (mergeHover)
      return Math.abs(mouse.x - point.x) < radius
    else
      return Math.abs(mouse.x - point.x) < radius && Math.abs(mouse.y - point.y) < radius
  }

  this.setCurrent = function (value) {
    this.state.current.y = value;
  }

  this.setDesired = function (value) {
    this.state.desired.y = value;
  }
}

Chartmander.prototype.easing = function (myEasing) {

  var functions = {
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

  return functions[myEasing];
};

//////////////////////////////////////////////////////////////

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
  for (var i = 0; i < items.length; i++) {
    action(items[i])
  };
}

function getDatasetFrom (data, type) {
  var result = [];
  forEach(data, function(set) {
    result.push(new Dataset(set, type));
  });
  return result;
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
