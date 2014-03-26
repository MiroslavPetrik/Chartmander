Chartmander.components.dataset = function (data, color, element) {

  var dataset = this;

  var title = data.title
    , elements = []
    , min = 0
    , max = 0
    , normal = {
        color: tinycolor.lighten(color, 5).toHex(),
        strokeColor: tinycolor.darken(color, 10).toHex()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHex(),
        strokeColor: tinycolor.darken(color, 20).toHex()
      }
    ;

  var getMaxMin = function () {
    var yRange = getRange(function () {
      var result = [];
      forEach(elements, function (el) {
        result.push(el.value());
      });
      return result;
    }());

    min = yRange.min;
    max = yRange.max;
  }

  var merge = function (data, chart, element) {
    // Test equality of datastream
    if (title != data.title) {
      throw new Error("Different datastream on update!");
    }
    // Update or create
    for (var i=0, len=data.values.length; i != len; i++) {
      if (elements[i] !== undefined) {
        elements[i].label(data.values[i].label).value(data.values[i].value).savePosition();
      }
      else {
        var element = new element(data.values[i], dataset.title);
        elements.push(element.savePosition(chart.grid.width(), chart.base()));
      }
    }
    // Delete
    if (elements.length > data.values.length) {
      for (var j = elements.length - data.values; j!=0; j--) {
        console.log("Delete");
        elements[elements.length-j].delete();
      }
    }
    getMaxMin();
  }

  ///////////////////////////////
  // Init
  ///////////////////////////////

  forEach(data.values, function (el) {
    elements.push(new element(el, data.title));
  });

  getMaxMin();

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  dataset.merge = merge;

  dataset.each = function (action) {
    forEach(elements, action);
  };

  dataset.title = function (action) {
    return title;
  };

  dataset.size = function () {
    var total = 0;
    dataset.each(function (element) {
      total += element.value();
    });
    return total;
  };

  dataset.elementCount = function () {
    return elements.length;
  };

  dataset.getElement = function (index) {
    if (index == "last")
      return elements[elements.length-1];
    else
      return elements[index];
  };

  dataset.els = function () {
    return elements;
  };

  dataset.color = function (_) {
    if(!arguments.length) return normal.color;
    normal.color = _;
    return dataset;
  };

  dataset.min = function (_) {
    if(!arguments.length) return min;
    min = _;
    return dataset;
  };

  dataset.max = function (_) {
    if(!arguments.length) return max;
    max = _;
    return dataset;
  };

  dataset.hoverColor = function (_) {
    if(!arguments.length) return hover.color;
    hover.color = _;
    return dataset;
  };

  return dataset;
}
