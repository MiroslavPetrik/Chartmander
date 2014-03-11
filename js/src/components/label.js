Chartmander.components.label = function(data, title) {

	var label = new Chartmander.components.element(data, title);

  label.startAt = function (val) {
    label.savePosition(0, val);
    return label;
  } 

  return label;
};
