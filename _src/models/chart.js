Chartmander.models.chart = function (canvasID) {
  
  var chart = this;

  var type = ""
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

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  chart.tooltip = tooltip;
  chart.draw = draw;
  chart.ctx = ctx;

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

  return chart;
};
