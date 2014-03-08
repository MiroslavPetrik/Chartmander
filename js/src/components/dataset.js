Chartmander.components.dataset = function (set, color, type) {

  var title = set.title
    , elements = getElements(type)
    , type = type
    , style = {
        color: color
      }
    ;

  this.each = function (action) {
    forEach(this.elements, action);
  }

  this.size = function () {
    var total = 0;
    this.each(function (element) {
      total += element.value;
    })
    return total;
  }

  this.getElementCount = function () {
    return this.elements.length;
  }

  this.repaint = function () {
    if (this.type == "bar" || this.type == "pie") {
      this.style.normal = {
        color: tinycolor.lighten(this.style.color, 10).toHex(),
        stroke: 1,
        strokeColor: tinycolor.darken(this.style.color, 30).toHex()
      };
      this.style.onHover = {
        color: tinycolor.lighten(this.style.color, 10).toHex(),
        stroke: 1,
        strokeColor: tinycolor.darken(this.style.color, 30).toHex()
      };
    }
    else if (this.type == "line") {
      this.style.normal = {
        color: "#FFFFFF",
        stroke: 1,
        strokeColor: tinycolor.darken(this.style.color, 20).toHex()
      };
      this.style.onHover = {
        color: tinycolor.lighten(this.style.color).toHex(),
        stroke: 1,
        strokeColor: tinycolor.darken(this.style.color, 20).toHex()
      };
    }
  }

  this.merge = function (newData, chart) {
    var newElements = newData.values
      , oldElements = this.elements
      ;

    // Test equality of datastream
    if (this.title != newData.title) {
      throw new Error("Different datastream on update!");
    }

    // Update existing elements, if new > old add new elements
    for (var i=0, len=newElements.length; i != len; i++) {
      // Update existing
      if (oldElements[i] instanceof Element) {
        this.elements[i].updateValue(newElements[i].label, newElements[i].value).savePosition();
      }
      // Create
      else {
        var element = new Element(newElements[i], this.title);

        if (this.type == "bar")
          element = element.Bar();
        else if (this.type == "line")
          element = element.Point();
        // Each segment in pieChart is dataset with only one element therefore next lines will never get executec
        // else if (this.type == "pie")
        //   element = element.Segment();
        this.elements.push(element.savePosition(chart.getGridProperties().width, chart.getBase()));
      }
    }
    // Flush old 
    if (oldElements.length > newElements.length) {
      for (var j=oldElements-newElements; j!=0; j--) {
        // supr FAUX
        console.log("Delete");
        this.elements[oldElements-j].die();
      }
    }
  }

  this.element = function (index) {
    if (index == "last")
      return this.elements[this.elements.length-1];
    else
      return this.elements[index]
  }

  function getElements (type) {
    var result = [];
    
    switch (type) {
      case "bar": forEach(set.values, function (barData) {
              result.push(new Element(barData, set.title).Bar());
            });
            break;
      case "pie": forEach(set.values, function (segmentData) {
              result.push(new Element(segmentData, set.title).Slice());
            });
            break;
      case "line": forEach(set.values, function (pointData) {
              result.push(new Element(pointData, set.title).Point());
            });
            break;
      default: return;
    }
    return result;
  }

  this.repaint();

  return this;
}
