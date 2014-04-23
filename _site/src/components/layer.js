Chartmander.components.layer = function (canvasID) {

  var layer = this;

  var id            = canvasID // unique ID selector
    , canvas        = document.getElementById(canvasID) // DOM element
    , wrapper       = document.createElement('div') // for canvas element (tooltip is relatively positioned to this element)
    , ctx           = canvas.getContext('2d')
    , width         = ctx.canvas.width
    , height        = ctx.canvas.height
    , mouse         = { x: 0, y: 0 }
    , hovered       = false
    , hoverFinished = true
    , animate            = true
    , animationSteps     = 100
    , animationCompleted = 0
    , easing             = "easeInQuint"
    , updated            = false
    , onHover       = null  // function specified by every chart (e.g. in /src/charts/pie.js)
    , onLeave       = null  // detto
    , drawChart     = null  // detto
    ;

  ///////////////////////////////////
  // Wrapper for layer
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
    // if (animationCompleted >= 1 && !tooltip.isAnimated() && !config.hoverFinished ) {
    if (hoverFinished) {
      onHover();
    }
  }

  function handleEnter () {
    hovered = true;
  }

  function handleLeave () {
    hovered = false;
    // chart.tooltip.removeItems();
    // if (animationCompleted >= 1)
    onLeave();
  }

  ///////////////////////////////
  // Animation loop
  ///////////////////////////////

  var draw = function (finished) {
    var easingFunction = easings[easing]
      , animationIncrement = 1/animationSteps
      , _perc_
      ;

    if (!updated)
      animationCompleted = animate ? 0 : 1;

    function loop () {
      if (finished) {
        animationCompleted = 1;
      } else if (animationCompleted < 1) {
        animationCompleted += animationIncrement;
      }

      _perc_ = easingFunction(animationCompleted);

      tooltip.clear();
      ctx.clearRect(0, 0, width, height);
      hoverFinished = true;

      drawChart(ctx, _perc_);
      
      if (hovered && tooltip.hasItems()) {
        tooltip.generate();
        tooltip.moveTo(chart.layer.mouse());
      }

      // Request self-repaint if chart or data element has not finished animating yet
      if (animationCompleted < 1 || !hoverFinished) {
        requestAnimationFrame(loop);
      }
      else {
        console.log("Animation Finished.");
      }
    }
    requestAnimationFrame(loop);
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  layer.draw = draw;
  layer.ctx = ctx;
  layer.tooltip = tooltip;

  layer.id = function (_) {
    if(!arguments.length) return id;
    id = _;
    return layer;
  };

  layer.width = function (_) {
    if(!arguments.length) return width;
    width = _;
    return layer;
  };

  layer.height = function (_) {
    if(!arguments.length) return height;
    height = _;
    return layer;
  };

  layer.mouse = function (_) {
    if(!arguments.length) return mouse;
    mouse.x = typeof _.x != 'undefined' ? _.x : mouse.x;
    mouse.y = typeof _.y != 'undefined' ? _.y : mouse.y;
    return layer;
  };

  layer.hovered = function (_) {
    if (!arguments.length) return hovered;
    hovered = _;
    return layer;
  };

  layer.hoverFinished = function (_) {
    if (!arguments.length) return hoverFinished;
    hoverFinished = _;
    return layer;
  };

  layer.completed = function (_) {
    if(!arguments.length) return animationCompleted;
    animationCompleted = _;
    return layer;
  };

  layer.easing = function (_) {
    if (!arguments.length) return easing;
    easing = _;
    return layer;
  };

  layer.animate = function (_) {
    if (!arguments.length) return animate;
    animate = _;
    return layer;
  };

  layer.updated = function (_) {
    if (!arguments.length) return updated;
    updated = _;
    return layer;
  };

  layer.onHover = function (f) {
    onHover = f;
    return layer;
  };

  layer.onLeave = function (f) {
    onLeave = f;
    return layer;
  };

  layer.drawChart = function (f) {
    drawChart = f;
    return layer;
  };

  return layer;
};
