Chartmander.components.animatedPart = function () {

  var part = this;

  var isAnimated = false
    , animationCompleted = 0 // normal => 0, hover => 1
    , speed = .05
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
  };

  part.animOut = function () {
    // isAnimated = true;
    animationCompleted -= speed;
    if (animationCompleted <= 0) {
      isAnimated = false;
      animationCompleted = 0;
    }
  };

  part.speed = function () {
    if(!arguments.length) return speed;
    speed = _;
    return part;
  };

  return part;
}
