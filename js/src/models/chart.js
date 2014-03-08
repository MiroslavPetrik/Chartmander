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
