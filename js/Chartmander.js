// Chartmander v0.1
// https://github.com/11th/Chartmander
// Copyright (c) 2014 Miroslav Petrik, MIT License

var Chartmander = function (canvasID) {

  var chart = this;

  this.canvas = document.getElementById(canvasID);
  this.ctx = this.canvas.getContext('2d');

  // Global Chartmander defaults
  this.config = {
    width: this.ctx.canvas.width,
    height: this.ctx.canvas.height,
    colors: ["#1E90FF", "#6633CC", "#ADFF2F"],
    font: "13px Arial, sans-serif",
    fontColor: "#555",
    animate: true,
    hovered: false,
    animationStep: 100,
    animationCompleted: 0,
    easing: "easeOutCubic",
    onAnimationCompleted: null,
    mouse: {},
    hoverNotFinished: false
  };

  this.datasets = [];
  this.crosshair = {
    x: null,
    y: null,
    visible: true,
    sticky: true,
    color: "#555",
    lineWidth: 1
  };
  this.tooltip = new Tooltip();
  this.logs = [];

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

  this.log = function (item) {
    this.logs.push(item);
  }

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

      if (finished) {
        cfg.animationCompleted = 1;
      } else if (cfg.animationCompleted < 1) {
        cfg.animationCompleted += animationStep;
      }

      _perc_ = easingFunction(cfg.animationCompleted);
      cfg.hoverNotFinished = false;
      chart.clear();
      chart.tooltip.removeItems();
      chart.logs = [];

      if (chart.xAxis)
        chart.xAxis.drawInto(chart);
      if (chart.yAxis)
        chart.yAxis.drawInto(chart, _perc_);
      if (chart.grid)
        chart.grid.drawInto(chart, _perc_);

      if (cfg.type === "line") {
        chart.itemsInHoverRange = [];
        if (cfg.drawUnder) {
          chart.drawDataAs("under", _perc_);
        }
        chart.drawDataAs("line", _perc_);
        chart.grid.drawCrosshairInto(chart);
        chart.drawDataAs("point", _perc_);
      } else if (cfg.type === "bar") {
        chart.drawBars(_perc_);
      } else if (cfg.type === "pie") {
        chart.drawSegments(_perc_);
      }

      if (tip) {
        tip.recalc(chart.ctx);
        tip.drawInto(chart);
      }

      var logID = 0;
      forEach(chart.logs, function (log) {
        ctx.fillText(log.toString(), chart.getGridProperties().width + chart.getGridProperties().left + 20, 20 + 20*logID);
        logID++;
      });

      // Request self-repaint if chart or tooltip or data element has not finished animating yet
      if (cfg.animationCompleted < 1 || (tip.getState() > 0 && tip.getState() < 1) || cfg.hoverNotFinished ) {
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

    // if (chart.config.type == "bar") {
    //   chart.recalcBars();
    // }
    // else  if (chart.config.type == "line") {
    //   chart.recalcPoints();
    // }

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
    if (chart.config.animationCompleted >= 1 && !chart.tooltip.isAnimated() && !chart.config.hoverNotFinished ){
      chart.draw(true)
    }
  }

  function handleEnter () {
    chart.config.hovered = true;
  }

  function handleLeave () {
    chart.config.hovered = false;
    // chart.tooltip.removeItems();
    if (chart.config.animationCompleted >= 1)
      chart.draw(true);
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

  // User methods
  this.showXAxis = function (_) {
    this.config.xAxisVisible = _;
    return chart;
  }

  this.showYAxis = function (_) {
    this.config.yAxisVisible = _;
    return chart;
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

  // Axis defaults
  cfg.xAxisVisible = true;
  cfg.yAxisVisible = true;


  // Chart state variables
  cfg.barWidth = cfg.maxBarWidth;
  cfg.groupWidth = 0;
  cfg.groupOffset = 0;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type, cfg.colors);
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();

  // Recalc
  chart.grid.calculateProperties(cfg.margin, cfg);
  chart.xAxis.recalc(chart);
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

    cfg.groupWidth = cfg.barWidth*SETS + cfg.datasetSpacing*(SETS-1);
    cfg.groupOffset = (chart.xAxis.labelSpace - cfg.groupWidth)/2;

    forEach(chart.datasets, function (set) {
      counter.element = 0;
      set.each(function (bar) {
        x = grid.left + cfg.groupOffset + counter.dataset*cfg.barWidth + counter.element*chart.xAxis.labelSpace + counter.dataset*cfg.datasetSpacing;
        y = -bar.value/chart.yAxis.VPP();
        bar.savePosition(grid.width/2, 0).moveTo(x, y).saveBase(chart.getBase()).moveBase(chart.getBase());
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
      ctx.fillStyle = set.style.normal.color;
      ctx.lineWidth = set.style.normal.stroke;
      ctx.strokeStyle = set.style.normal.strokeColor;
      set.each(function (bar) {
        bar.updatePosition(_perc_);
        bar.updatePositionBase(_perc_);
        bar.drawInto(chart, set);
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
  cfg.margin = { top: 30, right: 200, bottom: 50, left: 50 };
  cfg.drawUnder = true;
  cfg.pointRadius = 5;
  cfg.lineWidth = 2;
  cfg.drawUnderOpacity = .15
  cfg.pointHoverRadius = 20;
  cfg.mergeHover = true;

  // Axis defaults
  cfg.xAxisVisible = true;
  cfg.yAxisVisible = true;

  // Construct
  chart.datasets = getDatasetFrom(data, cfg.type, cfg.colors);
  chart.xAxis = getAxesFrom(chart.datasets)[0];
  chart.yAxis = getAxesFrom(chart.datasets)[1];
  chart.grid = new Grid();
  chart.itemsInHoverRange = [];

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
        point.resetPosition(chart);
        point.moveTo(x, false);
        counter++;
      })
    });
  }

  this.drawDataAs = function (type, _perc_) {
    ctx.save();
    forEach(chart.datasets, function (set) {
      var hoveredInThisSet = []
        , closestHovered
        , style = set.style
        ;

      ctx.strokeStyle = set.style.color;
      ctx.fillStyle = set.style.color;

      if (type == "line" || type == "under")
        ctx.beginPath();

      if (type == "under") {
        ctx.moveTo(set.element(0).getX(), chart.getBase());
        ctx.lineTo(set.element(0).getX(), set.element(0).getY());
      }

      set.each(function (point) {
        // Update only on first drawing
        if (type == "under" || (type == "line" && !cfg.drawUnder) ) point.updatePosition(_perc_);
        point.drawInto(chart, set, type);
        // chart.itemsInHoverRange
      });

      // Get items only from current set
      forEach(chart.itemsInHoverRange, function (item) {
        if (item.set == set.title) {
          hoveredInThisSet.push(item);
        }
      });

      // Find closest hovered
      for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
        if (i == 0) {
          closestHovered = hoveredInThisSet[i];
          continue;
        }
        if (hoveredInThisSet[i].hoverDistance < closestHovered.hoverDistance) {
          closestHovered = hoveredInThisSet[i];
        }
      }

      // Control Hovered
      for (var i = 0, len = hoveredInThisSet.length; i < len; i++) {
        if (hoveredInThisSet[i] === closestHovered) {
          set.elements[closestHovered.index].animIn();
          chart.tooltip.addItem({
              set: set.title,
              label: set.elements[closestHovered.index].label,
              value: set.elements[closestHovered.index].value,
              color: style.normal.color
            })
          if (set.elements[closestHovered.index].isAnimated()){
            cfg.hoverNotFinished = true;
          }
        } else {
          set.elements[hoveredInThisSet[i].index].animOut();
        }
      }

      if (type == "line")
        ctx.stroke();

      if (type == "under") {
        ctx.lineTo(set.element("last").getX(), chart.getBase());
        ctx.save();
        ctx.globalAlpha = cfg.drawUnderOpacity;
        ctx.fill();
        ctx.restore();
      }
    });
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
        forEach(set.values, function (element) {
          if (indexOf.call(newLabels, element.label) == -1)
            newLabels.push(element.label);
        });
      });
      this.labels = newLabels;
    }

    this.labelSpace = chart.getGridProperties().width/this.labels.length;
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

    if (cfg.xAxisVisible) {
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

    if (cfg.yAxisVisible) {
      ctx.save();
      ctx.textAlign = "right";
      ctx.fillStyle = cfg.fontColor;
      ctx.font = cfg.font;
      ctx.save();
      ctx.globalAlpha = axis.config.opacity;
      forEach(this.config.labels, function (label) {
        label.updatePosition(_perc_);
        ctx.fillText(label.label.toString(), grid.left - 10, label.getY());
      });
      ctx.restore();
      if (axis.newConfig.labels.length > 0) {
        ctx.save();
        ctx.globalAlpha = axis.newConfig.opacity;
        forEach(this.newConfig.labels, function (label) {
          label.updatePosition(_perc_);
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
  }
  return this;
}

var Grid = function () {

  var grid = this;
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
            ctx.strokeStyle = "#999"; // TODO Axis Width and Color
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
            ctx.strokeStyle = "#999"; // TODO Axis Width and Color
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
        if (crosshair.sticky && chart.itemsInHoverRange.length > 0) {
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
      chart.ctx.moveTo(crosshair.x, grid.config.properties.top);
      chart.ctx.lineTo(crosshair.x, grid.config.properties.bottom);
      chart.ctx.stroke();
      chart.ctx.restore();
    }
  }

  this.lineColor = function (_) {
    this.config.lineColor = _;
    return this;
  }

  this.horizontalLines = function (_) {
    this.config.horizontalLines = _;
    return this;
  }

  this.verticalLines = function (_) {
    this.config.verticalLines = _;
    return this;
  }
}

var Dataset = function (set, color, type) {

  this.title = set.title;
  this.elements = getElements(type);
  this.type = type;
  this.style = {
    color: color
  };

  // Different config for chart type
  if (type == "bar") {
    this.style.normal = {
      color: tinycolor.lighten(this.style.color, 10).toHex(),
      stroke: 1,
      strokeColor: tinycolor.darken(this.style.color, 30).toHex()
    };
    this.style.onHover = {
      color: tinycolor.lighten(this.style.color, 5).toHex(),
      stroke: 1,
      strokeColor: tinycolor.darken(this.style.color, 30).toHex()
    };
  }
  else if (type == "line") {
    this.style.normal = {
      color: "#FFFFFF",
      stroke: 1,
      strokeColor: tinycolor.darken(this.style.color, 20).toHex()
    };
    this.style.onHover = {
      color: tinycolor.lighten(this.style.color).toHex(),
      stroke: 1,
      strokeColor: tinycolor.darken(this.style.color, 20).toHex()
    };
  }

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
        this.elements[i].updateValue(newElements[i].label, newElements[i].value);
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

  this.element = function (index) {
    if (index == "last")
      return this.elements[this.elements.length-1];
    else
      return this.elements[index]
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

  this.items = [];

  // Tooltip defaults
  this.config = {
    gravity: "left",
    margin: 20,
    padding: 10,
    steps: 100,
    backgroundColor: "rgba(46, 59, 66, .8)",
    width: 100,
    height: 60,
    header: {
      fontSize: 15,
      lineHeight: 1.5,
      fontColor: "#EEEEEE"
    },
    set: {
      fontSize: 12,
      lineHeight: 1.5,
      iconSize: 10,
      fontColor: "#FFFFFF"
    }
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
    return tip.items ? tip.items[0].label : "undefined";
  }

  this.drawInto = function (chart) {
    var ctx = chart.ctx
      , tip = chart.tooltip
      , cfg = tip.config
      , topOffset = chart.config.mouse.y
      , leftOffset = chart.crosshair.x + cfg.margin
      , lineHeight = cfg.set.fontSize*cfg.set.lineHeight
      ;


    if (chart.config.type == "bar")
      leftOffset = chart.config.mouse.x

    tip.isAnimated(true);
    
    if (!tip.isEmpty()) {
      tip.fadeIn();

      ctx.save();
      ctx.globalAlpha = tip.getState();
      ctx.fillStyle = tip.backgroundColor();
      ctx.fillRect(leftOffset, topOffset, cfg.width + cfg.padding*2, cfg.height + cfg.padding*2);
      ctx.fillStyle = cfg.set.fontColor;
      ctx.textBaseline = "top"
      forEach(tip.items, function (item) {
        ctx.fillText(item.set + " " + item.value, leftOffset + cfg.padding, topOffset + cfg.padding);
        topOffset += lineHeight;
      });
      ctx.restore();
    } else {
      tip.fadeOut();
    }
  }

  this.addItem = function (item) {
    tip.items.push(item);
  }

  this.isEmpty = function () {
    for(var key in this.items) {
      if(this.items.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  this.removeItems = function () {
    this.items = [];
  }

  this.recalc = function (ctx) {
    var maxWidth = 0
      , lineWidth = 0
      , height = 0
      , lineHeight = this.config.set.fontSize*this.config.set.lineHeight
      ;

    forEach(this.items, function (item) {
      lineWidth = ctx.measureText(item.set).width + ctx.measureText(item.value).width;
      if (lineWidth > maxWidth)
        maxWidth = lineWidth;
      height += lineHeight;
    });
    
    this.config.width = maxWidth;
    this.config.height = height;
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
  this.backgroundColor = function (_) {
    if (!arguments.length) return tip.config.backgroundColor;
    tip.config.backgroundColor = _;
    return this;
  }

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
    isAnimated: false,
    animationCompleted: 0, // normal => 0, hover => 1
    permissionToDie: false,
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

  this.updateValue = function (label, value) {
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
    this.isAnimated(true);
    this.state.animationCompleted += .07;
    if (this.getState() >= 1) {
      this.isAnimated(false);
      this.state.animationCompleted = 1;
    }
  }

  this.animOut = function () {
    this.isAnimated(true);
    this.state.animationCompleted -= .07;
    if (this.getState() <= 0) {
      this.isAnimated(false);
      this.state.animationCompleted = 0;
    }
  }

  this.updatePosition = function (_perc_) {
    var deltaX = this.state.from.x - this.state.to.x
      , deltaY = this.state.from.y - this.state.to.y
      ;
    this.state.now.x = this.state.from.x - deltaX*_perc_;
    this.state.now.y = this.state.from.y - deltaY*_perc_;
  }

  this.savePosition = function (x, y) {
    if (!arguments.length) {
      this.state.from.x = this.state.now.x;
      this.state.from.y = this.state.now.y;
    } else {
      this.state.from.x = x;
      this.state.from.y = y;
    }
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

  this.state.from.base = 0;
  this.state.to.base = 0;
  this.state.now.base = 0;

  this.drawInto = function (chart, set) {
    var ctx = chart.ctx
      , cfg = chart.config
      , style = set.style
      , hover = this.isHovered(chart)
      ;

    if (hover) {
      ctx.save();
      ctx.fillStyle = style.onHover.color;
      ctx.strokeStyle = style.onHover.strokeColor;
      chart.tooltip.addItem({
        "set": set.title,
        "label": this.label,
        "value": this.value,
        "color": style.normal.color
      });
    }

    ctx.fillRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());
    if (style.normal.stroke > 0)
      ctx.strokeRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());

    if (hover) {
      if (style.onHover.stroke > 0)
        ctx.strokeRect(this.getX(), this.getBase(), cfg.barWidth, this.getY());
      ctx.restore();
    }
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

  this.updatePositionBase = function (_perc_) {
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

  this.drawInto = function (chart, set, type) {

    var ctx = chart.ctx
      , cfg = chart.config
      , style = set.style
      ;

    if (cfg.hovered) {
      var hover = this.isHovered(cfg.mouse, cfg.pointHoverRadius, cfg.mergeHover);
    }

    if (type == "line" || type == "under") {
      ctx.lineTo(this.getX(), this.getY());
    } else if (type == "point") {
      // Draw circle in normal state
      ctx.beginPath();
      ctx.fillStyle = style.normal.color;
      ctx.arc(this.getX(), this.getY(), cfg.pointRadius*(1-this.getState()), 0, Math.PI*2, false);
      ctx.fill();
      // Stroke circle
      if (style.normal.stroke) {
        ctx.lineWidth = style.normal.stroke*(1-this.getState());
        ctx.strokeStyle = style.normal.strokeColor;
        ctx.stroke();
      }

      if (this.getState() > 0) {
        cfg.hoverNotFinished = true;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = style.onHover.color;
        ctx.arc(this.getX(), this.getY(), cfg.pointRadius*this.getState(), 0, Math.PI*2, false);
        ctx.fill();
        if (style.onHover.stroke > 0) {
          ctx.lineWidth = style.onHover.stroke*this.getState();
          ctx.strokeStyle = style.onHover.strokeColor;
          ctx.stroke();
        }
        ctx.restore();
      }
      //
      if (cfg.hovered) {
        if (hover.was) {
          chart.itemsInHoverRange.push({
            "set": set.title,
            "index": indexOf.call(set.elements, this),
            "hoverDistance": hover.distance
          });
          return;
        }
      }
      this.animOut();
    } else {
      throw new Error("Unknown drawing method for line chart.");
    }
  }

  this.isHovered = function (mouse, hoverRadius, mergeHover) {
    var distance = Math.abs(mouse.x - this.getX());

    if (!mergeHover) {
      distance = Math.sqrt(Math.pow(distance, 2) + Math.pow(mouse.y - this.getY(), 2));
    }

    return {
      "was": distance < hoverRadius,
      "distance": distance
    };
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

function getDatasetFrom (data, type, colors) {
  var index = 0
    , color
    , datasets = []
    ;
    
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
    datasets.push(new Dataset(set, color, type));
    index++;
  });
  return datasets;
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
