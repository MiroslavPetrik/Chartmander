Chartmander.components.layer = function (canvasID) {

  // main component for each chart or multiple charts

  var layer = this;

  var id = canvasID // unique ID selector
    , canvas = document.getElementById(canvasID)
    , ctx = canvas.getContext('2d')
    , width = ctx.canvas.width
    , height = ctx.canvas.height
    , margin = { top: 0, right: 0, bottom: 0, left: 0 } // layer offset
    , mouse = { x: 0, y: 0 }
    , hovered = false
    , animationSteps = 100
    , animationCompleted = 0
    , hoverFinished = true
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
    // if (animationCompleted >= 1 && !tooltip.isAnimated() && !config.hoverFinished ) {
    if (animationCompleted >= 1 && hoverFinished) {
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

  layer.ctx     = ctx;
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

  layer.completed = function (_) {
    if(!arguments.length) return animationCompleted;
    animationCompleted = _;
    return layer;
  };

  layer.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
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

  layer.erase = function (x, y, width, height) {
    ctx.clearRect(x, y, width, height);
    return layer;
  }

  return layer;
};
