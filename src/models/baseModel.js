Chartmander.models.baseModel = function (chart) {
  
  // parent for each chartmander model
  // stores data and state

  var model = this;

  var datasets  = []
    , width     = chart.width()
    , height    = chart.height()
    , margin    = { top: 0, right: 0, bottom: 0, left: 0 }
    , colors    = ["blue", "green", "red"]
    , font      = "13px Arial, sans-serif"
    , fontColor = "#555"
    , updated   = false
    ;

  ///////////////////////////////////
  // model Update - Parse Data
  ///////////////////////////////////

  var parse = function (data, element) {
    if (data === undefined) {
      throw new Error("No data specified for model (canvas#id) - " + model.layer.id());
    }
    // First render, create new datasets
    if (model.setsCount() === 0) {
      var i=0;
      forEach(data, function (set) {
        datasets.push(new Chartmander.components.dataset(set, colors[i], element));
        i++;
      });
    } else { // Update
      var i=0;
      forEach(datasets, function (set) {
        if (data[i] === undefined) {
          throw new Error("Missing dataset. Dataset count on update must match.");
        }
        set.merge(data[i], model, element);
        i++;
      });
    }
  }

  ///////////////////////////////
  // Binding & Methods
  ///////////////////////////////
  
  model.chart = chart;  // Every model has access to chart 
  model.parse = parse;

  // Visual properties

  model.width = function (_) {
    if(!arguments.length) return width;
    width = _;
    return model;
  };

  model.height = function (_) {
    if(!arguments.length) return height;
    height = _;
    return model;
  };

  model.margin = function (_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return model;
  };

  model.colors = function (_) {
    if(!arguments.length) return colors;
    colors = _;
    return model;
  };

  // FAUX
  model.color = function (i) {
    if (colors[i] !== undefined)
      return colors[i];
    else
      return "red";
  };

  model.fontColor = function (_) {
    if (!arguments.length) return fontColor;
    fontColor = _;
    return model;
  };

  model.font = function (_) {
    if (!arguments.length) return font;
    font = _;
    return model;
  };

  // Data properties

  model.datasets = function (_) {
    if(!arguments.length) return datasets;
    datasets = _;
    return model;
  };
  
  model.dataset = function (_) {
    return datasets[_];
  };
  
  model.setsCount = function () {
    return datasets.length;
  };

  model.elementCount = function () {
    var total = 0;
    forEach(datasets, function (set) {
      total += set.elementCount();
    });
    return total;
  };

  // Animation properties

  model.updated = function (_) {
    if (!arguments.length) return updated;
    updated = _;
    return model;
  };

  // Interaction

  model.hovered = function () {
    var mouse = chart.mouse();

    return mouse.x >= model.margin().left && 
           mouse.x <= model.margin().left + model.width() &&
           mouse.y >= model.margin().top  &&
           mouse.y <= model.margin().top  + model.height();
  };

  return model;
};
