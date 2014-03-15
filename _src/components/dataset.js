Chartmander.components.dataset = function (data, color, element) {

  var dataset = this;

  var title = data.title
    , elements = []
    , yMin = 0
    , yMax = 0
    , normal = {
        color: tinycolor.lighten(color, 5).toHex(),
        strokeColor: tinycolor.darken(color, 10).toHex()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHex(),
        strokeColor: tinycolor.darken(color, 20).toHex()
      }
    ;

  forEach(data.values, function (el) {
    elements.push(new element(el, data.title));
  });

  var yRange = getRange(getArrayBy(data, "value"));
  yMin = yRange.min;
  yMax = yRange.max;

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

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

  // dataset.merge = function (newData, chart) {
  //   var newElements = newData.values
  //     , oldElements = dataset.elements
  //     ;

  //   // Test equality of datastream
  //   if (dataset.title != newData.title) {
  //     throw new Error("Different datastream on update!");
  //   }

  //   // Update existing elements, if new > old add new elements
  //   for (var i=0, len=newElements.length; i != len; i++) {
  //     // Update existing
  //     if (oldElements[i] instanceof Element) {
  //       dataset.elements[i].updateValue(newElements[i].label, newElements[i].value).savePosition();
  //     }
  //     // Create
  //     else {
  //       var element = new Element(newElements[i], dataset.title);

  //       if (dataset.type == "bar")
  //         element = element.Bar();
  //       else if (dataset.type == "line")
  //         element = element.Point();
  //       // Each segment in pieChart is dataset with only one element therefore next lines will never get executec
  //       // else if (dataset.type == "pie")
  //       //   element = element.Segment();
  //       dataset.elements.push(element.savePosition(chart.getGridProperties().width, chart.getBase()));
  //     }
  //   }
  //   // Flush old 
  //   if (oldElements.length > newElements.length) {
  //     for (var j=oldElements-newElements; j!=0; j--) {
  //       // supr FAUX
  //       console.log("Delete");
  //       dataset.elements[oldElements-j].die();
  //     }
  //   }
  // }

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
    if(!arguments.length) return yMin;
    yMin = _;
    return dataset;
  };

  dataset.max = function (_) {
    if(!arguments.length) return yMax;
    yMax = _;
    return dataset;
  };

  dataset.hoverColor = function (_) {
    if(!arguments.length) return hover.color;
    hover.color = _;
    return dataset;
  };

  return dataset;
}
