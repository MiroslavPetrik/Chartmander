Chartmander.components.element = function (data, title) {

  var element = new Chartmander.components.animatedPart();

  var set = title
    , label = data.label
    , value = data.value
    // , pendingDelete: false,
    // Actual position
    , now = {
        x: 0,
        y: 0
      }
    // Starting position
    , from = {
        x: 0,
        y: 0
      }
    // Destination
    , to = {
        x: 0,
        y: 0
      }
    ;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  element.label = function (_) {
    if(!arguments.length) return label;
    label = _;
    return element;
  };

  element.value = function (_) {
    if(!arguments.length) return value;
    value = _;
    return element;
  };

  element.x = function (_) {
    if(!arguments.length) return now.x;
    now.x = _;
    return element;
  };

  element.y = function (_) {
    if(!arguments.length) return now.y;
    now.y = _;
    return element;
  };

  element.moveTo = function (x, y) {
    if (x!=false)
      to.x = x;
    if(y!=false)
      to.y = y;
    return element;
  };

  element.updatePosition = function (_perc_) {
    var deltaX = from.x - to.x
      , deltaY = from.y - to.y
      ;
    now.x = from.x - deltaX*_perc_;
    now.y = from.y - deltaY*_perc_;
    // console.log(now.x, now.y)
  };

  element.savePosition = function (x, y) {
    if (!arguments.length) {
      from.x = now.x;
      from.y = now.y;
    } else {
      from.x = x;
      from.y = y;
    }
    return element;
  };

  // this.resetPosition = function (chart, yStart) {
  //   if(!isNaN(yStart))
  //     from.y = yStart;
  //   else
  //     from.y = chart.getBase();
  //   this.moveTo(false, chart.getBase() - value/chart.yAxis.VPP());
  // }

  return element;
}
