Chartmander.components.tooltip = function (id) {

  var tooltip = this;

  var items      = []
    , container  = document.createElement('div')
    , header     = document.createElement('span')
    , content    = document.createElement('ul')
    , margin     = 30
    , dateFormat = 'MMMM YYYY'
    , showHeader = true
    , percReference = null
    ;

  // Build tooltip
  container.id = "cm-tip-"+id;
  container.className = "cm-tip";
  container.appendChild(header);
  container.appendChild(content);

  header.className = "cm-tip--header";

  var moveTo = function (pos) {
    container.style.top  = pos.y + 'px';
    container.style.left = pos.x + margin + 'px';
    return tooltip;
  }

  var generate = function () {
    container.style.opacity = 1;
    // header from first item
    if (showHeader)
      header.innerHTML = moment(items[0].label).format(dateFormat);
    forEach(items, function (item) {
      content.appendChild(new TipNode(item.color, item.value, item.set));
    });
  };

  var TipNode = function (color, value, setTitle) {
    var node = document.createElement('li')
      , val  = document.createElement('strong')
      , icon = document.createElement('div')
      , set  = document.createTextNode(" " + setTitle)
      , perc = document.createTextNode(" " + (value/percReference*100).toFixed(1) + "%")
      ;

    val.innerHTML = value;
    icon.style.backgroundColor = color;

    node.appendChild(icon);
    node.appendChild(val);
    node.appendChild(set);
    if (percReference != null) 
      node.appendChild(perc);
    return node;
  }

  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  tooltip.container = container;
  tooltip.moveTo = moveTo;
  tooltip.generate = generate;

  tooltip.addItem = function (_) {
    items.push(_);
  };

  tooltip.clear = function () {
    items = [];
    container.style.opacity = 0;
    header.innerHTML = null;
    content.innerHTML = null;
  }

  tooltip.hasItems = function () {
    return items.length > 0;
  };

  tooltip.dateFormat = function (_) {
    if (!arguments.length) return dateFormat;
    dateFormat = _;
    return tooltip;
  };

  tooltip.percReference = function (_) {
    if (!arguments.length) return percReference;
    percReference = _;
    return tooltip;
  };

  tooltip.showHeader = function (_) {
    if (!arguments.length) return showHeader;
    showHeader = _;
    if (!_) {
      header.style.display = "none";
    }
    return tooltip;
  };

  return tooltip;
}
