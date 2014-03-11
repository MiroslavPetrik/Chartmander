Chartmander.components.label = function() {

	var label = Chartmander.components.element();

  label.startAt = function (val) {
    label.state.from.y = val;
    return label;
  } 

  return label;
};
