
var Chartmander = function (canvasID) {

  var chart = this;

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
      , _perc_
      ;

    cfg.animationCompleted = cfg.animate ? 0 : 1

    function loop () {
      if (finished)
        cfg.animationCompleted = 1;
      else if (cfg.animationCompleted < 1)
        // catch overflow
        cfg.animationCompleted += animationStep;

      chart.clear();
      chart.hoveredItems = [];
      _perc_ = easingFunction(cfg.animationCompleted);

      if (chart.xAxis)
        chart.xAxis.drawInto(chart);
      if (chart.yAxis)
        chart.yAxis.drawInto(chart, _perc_);
      if (chart.grid)
        chart.grid.drawInto(chart, _perc_);

      if (cfg.type === "line") {
        chart.drawDataAs("line", _perc_);
        chart.grid.drawCrosshairInto(chart);
        chart.drawDataAs("point", _perc_);
      }
      else if (cfg.type === "bar") {
        chart.drawBars(_perc_);
      }
      else if (cfg.type === "pie") {
        chart.drawSegments(_perc_);
      }

      if (tip)
        tip.drawInto(chart);
      
      // Request self-repaint if chart or tooltip or data element has not finished animating yet
      if (cfg.animationCompleted < 1 || (tip.getState() > 0 && tip.getState() < 1) || chart.lastHoveredAnimated() ) {
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

  this.update = function (data) {
    var i = 0
      , newValues = []
      ;

    // Find min and max values in provided data
    forEach(data, function (set) {
      newValues = newValues.concat(set.values.map(function(element){
        return element.value;
      }));
    })

    chart.yAxis.dataMin = Math.min.apply(null, newValues);
    chart.yAxis.dataMax = Math.max.apply(null, newValues);
    chart.yAxis.recalc(chart);
    chart.xAxis.recalc(chart, data);

    // Provide new data to sets
    forEach(this.datasets, function (set) {
      if (data[i] === undefined)
        throw new Error("Missing dataset. Dataset count on update must match.")

      set.merge(data[i]);

      // Move element
      set.each(function (element) {
        // Rectangle need height not coordinates
        if (set.type == "bar") {
          element.savePosition().moveTo(false, - element.value/chart.yAxis.VPP()).saveBase().moveBase(chart.getBase());
        }
        else if (set.type == "line")
          element.savePosition().moveTo(false, chart.getBase()- element.value/chart.yAxis.VPP());
      });
      i++;
    });

    if (chart.config.type == "bar") {
      chart.recalcBars();
    }
    else  if (chart.config.type == "line") {
      chart.recalcPoints();
    }

    chart.animationCompleted = 0;
    chart.draw();
  } 

  function handleHover (e) {
    chart.config.mouse = {
      x: e.pageX - this.offsetLeft,
      y: e.pageY - this.offsetTop
    }
    // Allow repaint on hover only if chart and tooltip are done with self-repaint
    // AND if also hovered item is not repainting 
    if (chart.config.animationCompleted >= 1 && !chart.tooltip.isAnimated() && !chart.lastHoveredAnimated() ){
      chart.draw(true)
    }
  }

  function handleEnter () {
    chart.config.hovered = true;
  }

  function handleLeave () {
    chart.config.hovered = false;
    if (chart.config.animationCompleted >= 1)
      chart.draw(true);
  }

  this.easingFunction = function (_) {
    this.config.easing = _;
    return chart;
  }

  this.pointRadius = function (_) {
    this.config.pointRadius = _;
    return chart;
  }

  this.fontColor = function (_) {
    this.config.fontColor = _;
    return chart;
  }

  this.font = function (_) {
    this.config.font = _;
    return chart;
  }

  this.crossColor = function (_) {
    this.crosshair.color = _;
    return chart;
  }

  this.colors = function (_) {
    this.config.colors = _;
    return chart;
  }

  this.lastHoveredAnimated = function () {
    var last = chart.hoveredItems[chart.hoveredItems.length-1]
      , echo = false
      ;

    if (last !== undefined) {
      echo = last.point.isAnimated;
    }
    return echo;
  }

  this.getWidth = function () {
    return this.config.width;
  }

  this.getHeight = function () {
    return this.config.height;
  }

  this.getMouse = function (axis) {
    if (axis === "x")
      return chart.config.mouse.x;
    else
      return chart.config.mouse.y;
  }

  this.getSetsCount = function () {
    return chart.datasets.length;
  }

  this.getGridProperties = function () {
    return chart.grid.config.properties;
  }

  this.getBase = function () {
    if(chart.config.type === "pie")
      return "TODO";
    else 
      return chart.getGridProperties()["bottom"] - chart.yAxis.config.zeroLevel;
  }

  return chart;
}


//////////////////////////////
// Chartmander types
//////////////////////////////

Chartmander.prototype.Bar = function (data) {

  var chart = this
    , ctx = chart.ctx
    , cfg = chart.config
    ;

  // Bar Chart Default
  cfg.type = "bar";
  cfg.margin = { top: 50, right: 50, bottom: 50, left: 50 };
  cfg.stacked = false;
  cfg.maxBarWidth = 30;
  cfg.datasetSpacing = 0;

  // Chart state variables
  cfg.barWidth = cfg.maxBarWidth;
  cfg.groupWidth = 0;
  cfg.groupOffset = 0;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type);
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalc
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.xAxis.recalc(chart);
  // cfg.labelSpace = chart.grid.config.properties.width/chart.xAxis.labels.length;
  chart.yAxis.recalc(chart);

  this.recalcBars = function () {
    var counter = {
        dataset: 0,
        element: 0
      }
      , SETS = chart.getSetsCount()
      , grid = chart.getGridProperties()
      , x
      , y
      ;

    if( (SETS * cfg.barWidth + (SETS-1)*cfg.datasetSpacing) > chart.xAxis.labelSpace )
      cfg.barWidth = Math.floor( (chart.xAxis.labelSpace - ((SETS-1)*cfg.datasetSpacing)) / SETS );

    console.log(cfg.barWidth)

    cfg.groupWidth = cfg.barWidth*SETS + cfg.datasetSpacing*(SETS-1);
    cfg.groupOffset = (chart.xAxis.labelSpace - cfg.groupWidth)/2;

    forEach(chart.datasets, function (set) {
      counter.element = 0;
      set.each(function (bar) {
        x = grid.left + cfg.groupOffset + counter.dataset*cfg.barWidth + counter.element*chart.xAxis.labelSpace + counter.dataset*cfg.datasetSpacing;
        y = -bar.value/chart.yAxis.VPP();
        bar.moveTo(x, y).saveBase(chart.getBase()).moveBase(chart.getBase());
        counter.element++;
      })
      counter.dataset++;
    });
  }

  this.drawBars = function (_perc_) {
    var counter = {
        dataset: 0
      }
      ;

    ctx.save();
    forEach(chart.datasets, function (set) {
      ctx.fillStyle = cfg.colors[counter.dataset];
      set.each(function (bar) {
        bar.updateNow(_perc_);
        bar.updateNowBase(_perc_);
        bar.drawInto(chart);
      })
      counter.dataset++;
    })
    ctx.restore();
  }

  // User methods
  this.datasetSpacing = function (_) {
    this.config.datasetSpacing = _;
    return chart;
  }

  chart.recalcBars();
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
    var segmentsTotal = chart.dataset.size()
      , scale = cfg.scaleAnimation ? _perc_ : 1
      , rotate = cfg.rotateAnimation ? _perc_ : 1
      , startAngle = -Math.PI/2
      , segmentAngle
      , counter = 0
      ;

    chart.dataset.each(function (segment) {
      segmentAngle = segment.getAngle(segmentsTotal)*rotate;
      ctx.fillStyle = cfg.colors[counter]
      segment.drawInto(chart, rotate, scale, startAngle, segmentAngle);
      counter++;
      startAngle += segmentAngle;
    });
  }

  // User methods
  this.innerRadius = function (_) {
    if(!arguments.length) return this.config.innerRadius;
    this.config.innerRadius = _;
    return this;
  }

  this.radius = function (_) {
    if(!arguments.length) return this.config.radius;
    this.config.radius = _;
    return this;
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
  cfg.margin = { top: 30, right: 50, bottom: 50, left: 50 };
  cfg.pointRadius = 6;
  cfg.lineWidth = 2;
  cfg.pointHoverRadius = 30;
  cfg.mergeHover = false;

  // Construct
  chart.datasets = getDatasetFrom(data, "line");
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalculation based on provided data
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.yAxis.recalc(chart);
  chart.xAxis.recalc(chart);

  this.recalcPoints = function () {
    var grid = chart.getGridProperties()
      , counter
      , x
      , y
      ;

    forEach(chart.datasets, function (set) {
      counter = 1;
      set.each(function (point) {
        x = Math.ceil(grid.left + counter*chart.xAxis.labelSpace - chart.xAxis.labelSpace/2);
        // y = -point.value/chart.yAxis.VPP;
        point.resetPosition(chart);
        point.moveTo(x, false);
        counter++;
      })
    });
  }

  this.drawDataAs = function (type, _perc_) {

    var counter = {
        dataset: 0,
        element: 1
      }
      , setsCount = chart.datasets.length
      ;

    ctx.lineWidth = cfg.lineWidth;
    ctx.save();

    forEach(chart.datasets, function (set) {
      ctx.strokeStyle = cfg.colors[counter.dataset];
      ctx.fillStyle = cfg.colors[counter.dataset];

      if (type === "line") ctx.beginPath();
      
      counter.element = 1;
      set.each(function (point) {
        point.updateNow(_perc_);
        point.drawInto(chart, type);
        counter.element++;
      });

      if (type === "line") ctx.stroke();

      counter.dataset++;
    })

    ctx.restore();
  }
   
  // User methods

  chart.recalcPoints();
  // Ignite
  chart.draw();
  return chart;
};


///////////////////////
// Components
///////////////////////

var xAxis = function (labels) {
  var axis = this;
  this.labels = labels;
  this.labelSpace = 0;

  this.recalc = function (chart, data) {

    // FAUX
    if (data != undefined) {
      var newLabels = [];
      forEach(data, function (set) {
        console.log(data)
        forEach(set.values, function (element) {
          if (indexOf.call(newLabels, element.label) == -1)
            newLabels.push(element.label);
        })
      });
      this.labels = newLabels;
    }

    this.labelSpace = chart.getGridProperties().width/this.labels.length;
    console.log( this.labelSpace, this.labels.length )
    return this;
  }

  this.each = function (action) {
    forEach(this.labels, action);
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , cfg = chart.config
      , grid = chart.getGridProperties()
      , counter = 0
      ;

    ctx.save();
    ctx.fillStyle = cfg.fontColor;
    ctx.font = cfg.font;
    this.each(function (label) {
      var labelWidth = ctx.measureText(label).width
        , start = axis.labelSpace/2 + (grid.left + axis.labelSpace*counter) - labelWidth / 2
        ;
      ctx.fillText(label, start, grid.bottom + 25);
      counter++;
    });
    ctx.restore();
  }
}

var yAxis = function (labels) {

  var axis = this;

  this.dataMin = labels[0];
  this.dataMax = labels[1];
  this.config = {
    labels: [],
    zeroLevel: 0,
    VPP: 0,
    opacity: 0
  };
  this.newConfig = {
    labels: [],
    zeroLevel: 0,
    VPP: 0,
    opacity: 0
  };

  this.recalc = function (chart) {

    var range = this.dataMax - this.dataMin
      , height = chart.grid.config.properties.height
      , maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
      , labelValueSteps = [1, 2, 5]
      , stepBase = range.toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelValueSteps);
    var labels = getLabels( getAxeSetup(stepBase, stepExponent) );

    // First time 
    if (axis.config.labels.length == 0) {
      axis.config.VPP = range/height;
      axis.config.zeroLevel = height - this.dataMax/axis.config.VPP;
      axis.config.labels = labels;

      // Set Positions for labels
      for (var i=0, len=axis.config.labels.length; i<len; i++) {
        var label = axis.config.labels[i]
          , prev
          ;
        if (label.value < 0)
          prev = axis.config.labels[i+1];
        else if (label.value > 0)
          prev = axis.config.labels[i-1];
        else if (label.value == 0) {
          label.startAt(chart.getBase()).moveTo(false, chart.getBase());
          continue;
        }
        label.startAt(chart.getBase() - prev.value/axis.config.VPP).moveTo(false, chart.getBase() - label.value/axis.config.VPP);
      }
    }
    // On update
    else {
      axis.newConfig.VPP = range/height;
      axis.newConfig.zeroLevel = height - this.dataMax/axis.newConfig.VPP;
      axis.newConfig.labels = labels;

      forEach(axis.config.labels, function (label) {
        // Move to updated position
        label.savePosition().moveTo(false, chart.getGridProperties()["bottom"] - axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP)
      });

      forEach(axis.newConfig.labels, function (label) {
        // Render to old position and move to new
        label.startAt(chart.getGridProperties()["bottom"] - axis.config.zeroLevel - label.value/axis.config.VPP).moveTo(false,chart.getGridProperties()["bottom"]- axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP);
      });

      axis.config.VPP = axis.newConfig.VPP;
      axis.config.zeroLevel = axis.newConfig.zeroLevel;
    }

    function getLabels (setup) {
      var labels = []
        , lefts = setup.labelCount
        , step = setup.valueStep
        , currLabel = 0
        , labelData = {
          label: 0,
          value: 0
        }
        ;

      labels.push(new Element(labelData, "yAxis").Label());

      while(Math.abs(currLabel - axis.dataMin) > step){
        currLabel = currLabel - step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.splice(0, 0, new Element(labelData, "yAxis").Label());
      }

      currLabel = 0;

      while( (axis.dataMax - currLabel) > step){
        currLabel = currLabel + step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.push(new Element(labelData, "yAxis").Label())
      }

      return labels;
    }

    function getAxeSetup (base, exponent, stop) {
      var currIndex = indexOf.call(labelValueSteps, base)
        , newIndex
        , newExponent
        , currLabelValueStep = Math.pow(10, exponent)*base
        , currLabelCount = range/currLabelValueStep
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

        return getAxeSetup(labelValueSteps[newIndex], newExponent);
      }
      else {
        // Too far, return previous and stop
        newIndex = (currIndex + 1 >=  3) ? 0 : (currIndex + 1);
        newExponent = (newIndex == 0) ? (exponent + 1) : exponent;

        return getAxeSetup(labelValueSteps[newIndex], newExponent, true);
      }
    }
  }

  this.VPP = function () {
      return this.config.VPP;
  }

  this.fadeIn = function (axis) {
    if (axis=="new") {
      this.newConfig.opacity += .05;
      if(this.newConfig.opacity>1)
        this.newConfig.opacity = 1;
    }
    else if (axis=="current") {
      this.config.opacity += .05;
      if(this.config.opacity>1)
        this.config.opacity = 1;
    }
  }

  this.fadeOut = function (axis) {
    if (axis=="new") {
      this.newConfig.opacity -= .05;
      if(this.newConfig.opacity<0)
        this.newConfig.opacity = 0;
    }
    else if (axis=="current") {
      this.config.opacity -= .05;
      if(this.config.opacity<0)
        this.config.opacity = 0;
    }
  }

  this.drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , cfg = chart.config
      , grid = chart.grid.config.properties
      ;

    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = cfg.fontColor;
    ctx.font = cfg.font;
    ctx.save();
    ctx.globalAlpha = axis.config.opacity;
    forEach(this.config.labels, function (label) {
      label.updateNow(_perc_);
      ctx.fillText(label.label.toString(), grid.left - 10, label.getY());
    });
    ctx.restore();
    if (axis.newConfig.labels.length > 0) {
      ctx.save();
      ctx.globalAlpha = axis.newConfig.opacity;
      forEach(this.newConfig.labels, function (label) {
        label.updateNow(_perc_);
        ctx.fillText(label.label.toString(), grid.left - 10, label.getY());
      });
      ctx.restore();

      axis.fadeIn("new");
      axis.fadeOut("current");
      if (axis.newConfig.opacity == 1) {
        // axis.config=axis.newConfig;
        axis.config.labels = axis.newConfig.labels;
        axis.config.opacity = axis.newConfig.opacity;

        // Reset values for next update
        axis.newConfig.labels = [];
        axis.newConfig.opacity = 0;
      }
    }
    else {
      axis.fadeIn("current");
    }
    ctx.restore();
  }
  return this;
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

  this.drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , grid = this.config
      ;

    if (grid.visible) {
      ctx.strokeStyle = grid.lineColor;
      ctx.lineWidth = grid.lineWidth;

      if (grid.horizontalLines) {
        ctx.save();
        ctx.globalAlpha = chart.yAxis.config.opacity;
        forEach(chart.yAxis.config.labels, function (line) {
          ctx.beginPath();
          if (line.label == 0) {
            ctx.save();
            ctx.strokeStyle = "#999";
          }
          ctx.moveTo(grid.properties.left, line.getY());
          ctx.lineTo(grid.properties.right, line.getY());
          ctx.stroke();
          if (line.label==0) ctx.restore();
        })
        ctx.restore();
      }
      if (chart.yAxis.newConfig.labels.length > 0) {
        ctx.save();
        ctx.globalAlpha = chart.yAxis.newConfig.opacity;
        forEach(chart.yAxis.newConfig.labels, function (line) {
          ctx.beginPath();
          if (line.label == 0) {
            ctx.save();
            ctx.strokeStyle = "#999";
          }
          ctx.moveTo(grid.properties.left, line.getY());
          ctx.lineTo(grid.properties.right, line.getY());
          ctx.stroke();
          if (line.label==0) ctx.restore();
        })
        ctx.restore();
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

  this.hasInRangeX = function (point) {
     return point.x >= this.config.properties.left && point.x <= this.config.properties.right;
  }

  this.drawCrosshairInto = function (chart) {

    var crosshair = chart.crosshair;

    if (crosshair.visible && chart.config.hovered) {
      chart.ctx.save();
      chart.ctx.strokeStyle = crosshair.color;
      chart.ctx.lineWidth = crosshair.lineWidth;

      if (chart.grid.hasInRangeX(chart.config.mouse)) {
        crosshair.x = chart.getMouse("x");
        if (crosshair.sticky && chart.hoveredItems.length > 0) {
          var availablePoints = [];

          forEach(chart.hoveredItems, function (point) {
            availablePoints.push(point.position.x);
          })
          crosshair.x = closestElement(crosshair.x, availablePoints);
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

  this.lineColor = function (_) {
    this.config.lineColor = _;
    return this;
  }
  this.verticalLines = function (_) {
    this.config.verticalLines = _;
    return this;
  }
}

var Dataset = function (set, type) {

  this.title = set.title;
  this.elements = getElements(type);
  this.type = type;

  this.each = function (action) {
    forEach(this.elements, action);
  }

  this.size = function () {
    var total = 0;
    this.each(function(element){
      total += element.value;
    })
    return total;
  }

  this.merge = function (newData) {
    var newElements = newData.values
      , oldElements = this.elements
      ;

    // Test equality of datastream
    if (this.title != newData.title) {
      throw new Error("Different datastream on update!");
    }

    // Update existing elements, if new > old add new elements
    for (var i=0, len=newElements.length; i != len; i++) {
      // Update existing
      if (oldElements[i] instanceof Element) {
        this.elements[i].updateTo(newElements[i].label, newElements[i].value);
      }
      // Create
      else {
        var element = new Element(newElements[i], this.title);

        if (this.type == "bar")
          element = element.Bar();
        else if (this.type == "line")
          element = element.Point();
        // Each segment in pieChart is dataset with only one element therefore next lines will never get executec
        // else if (this.type == "pie")
        //   element = element.Segment();
        element.
        this.elements.push(element);
      }
    }
    // Flush old 
    if (oldElements.length > newElements.length) {
      for (var j=oldElements-newElements; j!=0; j--) {
        console.log("Delete");
        this.elements[oldElements-j].die();
      }
    }
  }

  function getElements (type) {
    var result = [];
    
    switch (type) {
      case "bar": forEach(set.values, function (barData) {
              result.push(new Element(barData, set.title).Bar());
            });
            break;
      case "pie": forEach(set.values, function (segmentData) {
              result.push(new Element(segmentData, set.title).Segment());
            });
            break;
      case "line": forEach(set.values, function (pointData) {
              result.push(new Element(pointData, set.title).Point());
            });
            break;
      default: return;
    }
    return result;
  }

  return this;
}

var Tooltip = function (items) {

  var tip = this;

  this.items = items;

  // Tooltip defaults
  this.config = {
    gravity: "left",
    margin: 20,
    steps: 100
  };
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
  };

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
    ctx.fillRect(leftOffset, topOffset, 100, 60);
    ctx.fillStyle = "#FFF";
    // TODO padding ...
    ctx.fillText(tip.getXLabel(), leftOffset + 10, topOffset+labelCounter*20)
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

      if (tip.getState() <= 0) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 0;
      }
  } 

  this.fadeIn = function () {
      tip.state.animationCompleted += .05;

      if (tip.getState() >= 1) {
        tip.isAnimated(false);
        tip.state.animationCompleted = 1;
      }
  }

  this.getState = function () {
    return tip.state.animationCompleted;
  }

  this.isAnimated = function (_) {
    if(!arguments.length) return tip.state.isAnimated
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

var Element = function (data, title) {

  this.set = title;
  this.label = data.label;
  this.value = data.value;
  this.state = {
    hovered: false,
    isAnimated: false,
    animationCompleted: 0, // normal => 0, hover => 1
    permissionToDie: false,
    normal: {
      color: "white",
      borderWidth: 4,
      borderColor: "red" // Inherit == color of dataset
    },
    onHover: {
      color: "red",
      borderWidth: 30,
      borderColor: "rgba(255,255,255,.8)"
    },
    // Positions
    now: {
      x: 0,
      y: 0
    },
    from: {
      x: 0,
      y: 0
    },
    to: {
      x: 0,
      y: 0
    }
  }

  this.updateTo = function (label, value) {
    this.label = label;
    this.value = value;
  }

  this.die = function () {
    this.permissionToDie = true;
    return this;
  }

  this.moveTo = function (x, y) {
    if (x!=false)
      this.state.to.x = x;
    if(y!=false)
      this.state.to.y = y;
    return this;
  }

  this.animIn = function () {
    this.state.animationCompleted += .07;
    if (this.getState() >= 1) {
      this.isAnimated(false);
      this.state.animationCompleted = 1;
    }
  }

  this.animOut = function () {
    this.state.animationCompleted -= .07;
    if (this.getState() <= 0) {
      this.isAnimated(false);
      this.state.animationCompleted = 0;
    }
  }

  this.updateNow = function (_perc_) {
    var deltaX = this.state.from.x - this.state.to.x
      , deltaY = this.state.from.y - this.state.to.y
      ;
    this.state.now.x = this.state.from.x - deltaX*_perc_;
    this.state.now.y = this.state.from.y - deltaY*_perc_;
  }

  this.save = function () {
    this.state.from.x = this.getX();
    this.state.from.y = this.getY();
    return this;
  }
  this.savePosition = function () {
    this.state.from.x = this.state.now.x;
    this.state.from.y = this.state.now.y;
    return this;
  }

  this.isAnimated = function (_) {
    if(!arguments.length) return this.state.isAnimated;
    this.state.isAnimated = _;
  }

  this.getState = function () {
    return this.state.animationCompleted;
  }

  this.getX = function () {
    return this.state.now.x;
  }

  this.getY = function () {
    return this.state.now.y;
  }

  this.setX = function (x) {
    this.state.now.x = x;
  }

  this.setY = function (y) {
    this.state.now.y = y;
  }

  this.resetPosition = function (chart, yStart) {
    if(!isNaN(yStart))
      this.state.from.y = yStart;
    else
      this.state.from.y = chart.getBase();
    this.moveTo(false, chart.getBase() - this.value/chart.yAxis.VPP());
  }

  return this;
}

Element.prototype.Bar = function () {

  // Bar moves in value and in base too...
  this.state.from.base = 0;
  this.state.to.base = 0;
  this.state.now.base = 0;

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , cfg = chart.config
      , hover = this.isHovered(chart)
      ;

    this.isAnimated(true);
    if (hover)
      ctx.fillStyle = "blue";
    ctx.fillRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());
  }

  this.isHovered = function (chart) {
    var x = chart.getMouse("x")
      , y = chart.getMouse("y")
      , cfg = chart.config
      , hovered = false
      , yRange = [this.getBase(), this.getBase()+this.getY()].sort(function(a,b){return a-b})
      ;

    if (x >= this.getX() && x <= this.getX()+cfg.barWidth && y >= yRange[0] && y<= yRange[1]) {
      hovered = true;
    }

    return hovered;
  }

  this.updateNowBase = function (_perc_) {
    var baseDelta = this.state.from.base - this.state.to.base
      ;
    this.state.now.base = this.state.from.base - baseDelta*_perc_;
  }

  this.saveBase = function (base) {
    if(!arguments.length)
      this.state.from.base = this.getBase();
    else
      this.state.from.base = base;

    return this;
  }

  this.moveBase = function (base) {
    this.state.to.base = base;
    return this;
  }

  this.getBase = function () {
    return this.state.now.base;
  }

  return this;
};

Element.prototype.Segment = function () {

  this.drawInto = function (chart, rotate, scale, startAngle, segmentAngle ) {
    var ctx = chart.ctx
      , cfg = chart.config
      , x = chart.getWidth()/2
      , y = chart.getHeight()/2
      , hover = this.isHovered(chart, startAngle, startAngle + segmentAngle)
      ;

      ctx.beginPath();
      if (hover)
        ctx.fillStyle = "red";
      ctx.arc(x, y, scale * cfg.radius, startAngle, startAngle + segmentAngle, false);
      ctx.arc(x, y, scale * cfg.innerRadius, startAngle + segmentAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();
  }

  this.getAngle = function (total) {
    return (this.value/total)*Math.PI*2;
  }

  this.isHovered = function (chart, startAngle, endAngle) {
    var x = chart.getMouse("x") - chart.getWidth()/2
      , y = chart.getMouse("y") - chart.getHeight()/2
      , fromCenter = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2))
      , hoverAngle
      , hovered = false
      ;


    if (fromCenter <= chart.radius()) {
      hoverAngle = Math.atan2(y, x);
      if (hoverAngle < 0)
        hoverAngle += Math.PI*2;
      console.log(startAngle.toFixed(2), endAngle.toFixed(2), hoverAngle.toFixed(2))
      if (hoverAngle >= startAngle && hoverAngle <= endAngle)
        hovered = true;
    }

    return hovered;
  }

  return this;
};

Element.prototype.Point = function () {

  this.drawInto = function (chart, type) {

    var ctx = chart.ctx
      , cfg = chart.config
      , grid = chart.grid.config.properties
      , hover = this.isHovered(cfg.mouse, cfg.pointHoverRadius, cfg.mergeHover) && cfg.hovered
      ;

    this.isAnimated(true);

    if (type === "line") {
      ctx.lineTo(this.getX(), this.getY());
    }
    else if (type === "point") {
      if (hover)
        this.animIn();
      else
        this.animOut();

      ctx.beginPath();
      ctx.fillStyle = this.color();
      ctx.arc(this.getX(), this.getY(), cfg.pointRadius*(1-this.getState()), 0, Math.PI*2, false);
      ctx.fill();
      if (this.stroke()) {
        ctx.lineWidth = this.stroke()*(1-this.getState());
        ctx.strokeStyle = this.strokeColor();
        ctx.stroke();
      }
      if (hover) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.getHovered("color");
        ctx.arc(this.getX(), this.getY(), cfg.pointRadius*this.getState(), 0, Math.PI*2, false);
        ctx.fill();
        if (this.getHovered("border") > 0) {
          ctx.lineWidth = this.getHovered("border")*this.getState();
          ctx.strokeStyle = this.getHovered("borderColor");
          ctx.stroke();
        }
        ctx.restore();

        chart.hoveredItems.push({
          set: this.set,
          setID: 1, // TODO parent
          y: this.value,
          x: this.label,
          position: {
            x: this.getX(),
            y: this.getY()
          },
          point: this
        })
      }
    }
  }

  this.isHovered = function (mouse, radius, mergeHover) {
    if (mergeHover)
      return Math.abs(mouse.x - this.getX()) < radius
    else
      return Math.abs(mouse.x - this.getX()) < radius && Math.abs(mouse.y - this.getY()) < radius
  }

  this.color = function (_) {
    if(!arguments.length) return this.state.normal.color;
    this.state.normal.color = _;
  }

  this.stroke = function (_) {
    if(!arguments.length) return this.state.normal.borderWidth;
    this.state.normal.borderWidth = _;
  }

  this.strokeColor = function (_) {
    if (!arguments.length) return this.state.normal.borderColor;
    this.state.normal.borderColor = _;
  }

  this.getHovered = function(prop) {
    var style = this.state.onHover;
    switch (prop) {
      case "color": return style.color;
      case "border": return style.borderWidth;
      case "borderColor": return style.borderColor;
      default: return;
    }
  }

  return this;
};

Element.prototype.Label = function() {

  this.startAt = function (val) {
    this.state.from.y = val;
    return this;
  } 

  return this;
};

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
