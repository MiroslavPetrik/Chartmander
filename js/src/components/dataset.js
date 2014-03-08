Chartmander.components.dataset = function (set, color, type) {

  var dataset = this;

  var title = set.title
    , elements = getElements(type)
    , normal = {
        color: tinycolor.lighten(color, 5).toHex(),
        strokeColor: tinycolor.darken(color, 10).toHex()
      }
    , hover = {
        color: tinycolor.lighten(color, 15).toHex(),
        strokeColor: tinycolor.darken(color, 20).toHex()
    }
    ;


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  dataset.each = function (action) {
    forEach(elements, action);
  }

  dataset.size = function () {
    var total = 0;
    dataset.each(function (element) {
      total += element.value;
    })
    return total;
  }

  dataset.getElementCount = function () {
    return dataset.elements.length;
  }

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
  }

  function getElements (type) {
    var result = [];
    
    switch (type) {
      case "bar": forEach(set.values, function (bar) {
              result.push(Chartmander.components.bar(bar, set.title));
            });
            break;
      case "pie": forEach(set.values, function (slice) {
              result.push(Chartmander.components.slice(slice, set.title));
            });
            break;
      case "line": forEach(set.values, function (point) {
              result.push(Chartmander.components.point(point, set.title));
            });
            break;
      default: return;
    }
    return result;
  }

  dataset.color = function (_) {
    if(!arguments.length) return normal.color;
    normal.color = _;
    return this;
  }

  return dataset;
}
