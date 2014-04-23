Chartmander.components.label = function (data, title) {

	var label = new Chartmander.components.element();
			label.label(data.label).value(data.value);

  // for old axis
  label.startAt = function (val) {
    label.savePosition(0, val);
    return label;
  };

  label.startAtY = function (val) {
    label.savePosition(0, val);
    return label;
  };

  label.startAtX = function (val) {
    label.savePosition(val, 0);
    return label;
  };

  return label;
};
