Chartmander.models.chart = function (canvasID) {

  var chart = this;

  this.canvas = document.getElementById(canvasID);
  this.ctx = this.canvas.getContext('2d');

  // Global Chartmander defaults
  this.config = {
    width: this.ctx.canvas.width,
    height: this.ctx.canvas.height,
    colors: ["#1E90FF", "#6633CC", "#D00564"],
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

    if (chart.grid) {
      var grid = chart.getGridProperties();
    }

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
      tip.removeItems();

      if (chart.xAxis)
        chart.xAxis.drawInto(chart);
      if (chart.yAxis)
        chart.yAxis.drawInto(chart, _perc_);
      if (chart.grid)
        chart.grid.drawInto(chart, _perc_);

      if (cfg.type === "line") {
        chart.itemsInHoverRange = [];
        chart.updatePoints(_perc_);
        if (cfg.drawArea) {
          chart.drawArea(_perc_);
        }
        chart.drawLines();
        chart.grid.drawCrosshairInto(chart);
        chart.drawPoints();
      } else if (cfg.type === "bar") {
        chart.drawBars(_perc_);
      } else if (cfg.type === "pie") {
        chart.drawSlices(_perc_);
      }

      if (tip) {
        if (tip.hasItems()) {
          tip.recalc(chart.ctx);
        }
        tip.drawInto(chart);
      }

      if (cfg.title) {
        ctx.save();
        ctx.font = "18px Arial";
        ctx.fillText(cfg.title, chart.getGridProperties().left, chart.getGridProperties().top/2);
        ctx.restore();
      }

      if (cfg.legend) {
        ctx.save();
        // ctx.font = "18px Arial";
        var legendWidth = 100, counter = 0;
        forEach(chart.datasets, function (set) {
          var left = chart.getGridProperties().width-200+counter*legendWidth
          ctx.fillStyle = set.style.color;
          ctx.fillRect(left-15, chart.getGridProperties().top/2-5, 10, 10);
          ctx.fillStyle = "#000";
          ctx.fillText(set.title, left, chart.getGridProperties().top/2);
          counter++;
        });
        ctx.restore();
      }

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

  function handleHover (e) {
    var rect = this.getBoundingClientRect();
    chart.config.mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    // console.log(chart.config.mouse.x, chart.config.mouse.y)
    // Allow repaint on hover only if chart and tooltip are done with self-repaint
    // AND if also hovered item is not repainting 
    if (chart.config.animationCompleted >= 1 && !chart.tooltip.isAnimated() && !chart.config.hoverNotFinished ) {
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

  this.getElementCount = function () {
    var total = 0;
    forEach(this.datasets, function (set) {
      total += set.getElementCount();
    })
    return total;
  }

  // Warning
  // might be negative values in line or bar chart, this is used only by pieChart
  this.getElementValue = function () {
    var total = 0;
    forEach(this.datasets, function (set) {
      forEach(set.elements, function (e) {
        total += e.value;
      })
    });
    return total;
  }

  // User methods
  this.title = function (_) {
    if(!arguments.length) return this.config.title;
    this.config.title = _;
    return this;
  }

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

  this.margin = function (_) {
    if (!arguments.length) return chart.config.margin;
    chart.config.margin.top    = typeof _.top    != 'undefined' ? _.top    : chart.config.margin.top;
    chart.config.margin.right  = typeof _.right  != 'undefined' ? _.right  : chart.config.margin.right;
    chart.config.margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : chart.config.margin.bottom;
    chart.config.margin.left   = typeof _.left   != 'undefined' ? _.left   : chart.config.margin.left;
    return chart;
  }

  this.colors = function (_) {
    var i = 0;
    forEach(_, function (color) {
      chart.datasets[i].style.color = color;
      chart.datasets[i].repaint();
      i++;
    });
    return chart;
  }

  return chart;
}
