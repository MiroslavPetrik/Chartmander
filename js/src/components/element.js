Chartmander.components.element = function (data, title) {

  var set = title
    , label = data.label
    , value = data.value
    , state = {
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
    ;


  element.label = function (_) {
    if(!arguments.length) return label;
    label = _;
    return element;
  }

  element.value = function (_) {
    if(!arguments.length) return value;
    value = _;
    return element;
  }

  // this.die = function () {
  //   this.permissionToDie = true;
  //   return this;
  // }

  element.moveTo = function (x, y) {
    if (x!=false)
      state.to.x = x;
    if(y!=false)
      state.to.y = y;
    return element;
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
    var deltaX = state.from.x - state.to.x
      , deltaY = state.from.y - state.to.y
      ;
    state.now.x = state.from.x - deltaX*_perc_;
    state.now.y = state.from.y - deltaY*_perc_;
  }

  this.savePosition = function (x, y) {
    if (!arguments.length) {
      state.from.x = state.now.x;
      state.from.y = state.now.y;
    } else {
      state.from.x = x;
      state.from.y = y;
    }
    return element;
  }

  this.isAnimated = function (_) {
    if(!arguments.length) return state.isAnimated;
    state.isAnimated = _;
    return element;
  }

  this.getState = function () {
    return state.animationCompleted;
  }

  this.getX = function () {
    return state.now.x;
  }

  this.getY = function () {
    return state.now.y;
  }

  this.setX = function (x) {
    state.now.x = x;
  }

  this.setY = function (y) {
    state.now.y = y;
  }

  // this.resetPosition = function (chart, yStart) {
  //   if(!isNaN(yStart))
  //     state.from.y = yStart;
  //   else
  //     state.from.y = chart.getBase();
  //   this.moveTo(false, chart.getBase() - value/chart.yAxis.VPP());
  // }

  return element;
}
