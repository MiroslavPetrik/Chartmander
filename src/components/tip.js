Chartmander.components.tooltip = function (id) {

  var tooltip = this;

  var items      = []
    , container  = document.createElement('div')
    , header     = document.createElement('span')
    , content    = document.createElement('ul')
    , margin     = 30
    , dateFormat = 'MMMM YYYY'
    ;

  // Build tooltip
  container.id = "cm-tip-"+id;
  container.className = "cm-tip";
  container.appendChild(header);
  container.appendChild(content);

  var moveTo = function (pos) {
    container.style.top  = pos.y + 'px';
    container.style.left = pos.x + margin + 'px';
    return tooltip;
  }

  var generate = function () {
    container.style.opacity = 1;
    header.innerHTML = moment(items[0]).format(dateFormat);
    forEach(items, function (item) {
      content.appendChild(new TipNode(item.color, item.value, item.set));
    });
  };

  var TipNode = function (color, value, setTitle) {
    var node = document.createElement('li')
      , val  = document.createElement('strong')
      , icon = document.createElement('div')
      , set  = document.createTextNode(" " + setTitle)
      ;

    val.innerHTML = value;
    icon.style.backgroundColor = color;

    node.appendChild(icon);
    node.appendChild(val);
    node.appendChild(set);
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

  return tooltip;
}
