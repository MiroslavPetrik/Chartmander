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
