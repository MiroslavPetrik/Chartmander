Chartmander.components.yAxis = function (min, max) {

  var axis = new Chartmander.components.axis();

  var unit = ""
    , abbr = false
    , margin = 10 // Offset from grid
    , zeroLevel = 0
    ;

  recalc = function (chart) {

    var range = axis.max() - (axis.min() > 0 ? 0 : axis.min())
      , height = chart.grid.height()
      , maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
      , labelValueSteps = [1, 2, 5]
      , stepBase = range.toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelValueSteps);
    var labels = getLabels(getAxeSetup(stepBase, stepExponent));

    // First time 
    if (labels.length == 0) {
      axis.scale(range/height);
      zeroLevel = height - axis.max()/axis.scale();
      labels = labels;

      // Set Positions for labels
      for (var i=0, len=labels.length; i<len; i++) {
        var label = labels[i]
          , prev
          ;
        if (label.value() < 0)
          prev = labels[i+1];
        else if (label.value > 0)
          prev = labels[i-1];
        else if (label.value == 0) {
          label.startAt(chart.getBase()).moveTo(false, chart.getBase());
          continue;
        }
        label.startAt(chart.getBase() - prev.value/VPP).moveTo(false, chart.getBase() - label.value()/axis.scale());
      }
    }
    // On update
    // else {
    //   axis.newConfig.VPP = range/height;
    //   axis.newConfig.zeroLevel = height - axis.dataMax/axis.newConfig.VPP;
    //   axis.newConfig.labels = labels;

    //   forEach(labels, function (label) {
    //     // Move to updated position
    //     label.savePosition().moveTo(false, chart.getGridProperties()["bottom"] - axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP)
    //   });

    //   forEach(axis.newConfig.labels, function (label) {
    //     // Render to old position and move to new
    //     label.startAt(chart.getGridProperties()["bottom"] - zeroLevel - label.value/VPP).moveTo(false,chart.getGridProperties()["bottom"]- axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP);
    //   });

    //   VPP = axis.newConfig.VPP;
    //   zeroLevel = axis.newConfig.zeroLevel;
    // }
  }

  function getLabels (setup) {
    var labels = []
      , lefts = setup.labelCount
      , step = setup.valueStep
      , currLabel = 0
      , labelData = {
        label: 0,
        value: 0
      }
      ;

    labels.push(new Chartmander.components.label(labelData, "axis"));

    while ( -(axis.min() - currLabel) > step) {
      currLabel = currLabel - step;
      labelData = {
        label: currLabel,
        value: currLabel
      }
      labels.splice(0, 0, new Chartmander.components.label(labelData, "axis"));
    }

    currLabel = 0;

    while ( (axis.max() - currLabel) > step) {
      currLabel = currLabel + step;
      labelData = {
        label: currLabel,
        value: currLabel
      }
      labels.push(new Chartmander.components.label(labelData, "axis"))
    }

    return labels;
  }

  function getAxeSetup (base, exponent, stop) {
    var currIndex = indexOf.call(labelValueSteps, base)
      , newIndex
      , newExponent
      , currLabelValueStep = Math.pow(10, exponent)*base
      , currLabelCount = range/currLabelValueStep
      ;

    if (stop)
      return {
        valueStep: currLabelValueStep,
        labelCount: Math.floor(currLabelCount)
      };

    // Debug
    // console.log("curr Index ", currIndex, " exponent", exponent, " currLabelValueStep ", currLabelValueStep, " labelCount ", currLabelCount, " maxLabelCount ", maxLabelCount )
    
    if (currLabelCount < maxLabelCount) {
      // Maybe there is space for more labels...
      newIndex = (currIndex - 1 <= -1) ? 2 : (currIndex - 1);
      newExponent = (newIndex == 2) ? (exponent - 1) : exponent;

      return getAxeSetup(labelValueSteps[newIndex], newExponent);
    }
    else {
      // Too far, return previous and stop
      newIndex = (currIndex + 1 >=  3) ? 0 : (currIndex + 1);
      newExponent = (newIndex == 0) ? (exponent + 1) : exponent;

      return getAxeSetup(labelValueSteps[newIndex], newExponent, true);
    }
  }

  drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , grid = chart.grid
      ;

    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = chart.fontColor();
    ctx.font = chart.font();
    ctx.globalAlpha = opacity;
    forEach(axis.labels(), function (label) {
      var labelValue = abbr ? (label.label()/1000).toString() : label.label().toString();
      label.updatePosition(_perc_);
      ctx.fillText(labelValue + " " + unit, grid.left() - margin, label.y());
    });
    // if (axis.newConfig.labels.length > 0) {
    //   ctx.save();
    //   ctx.globalAlpha = axis.newConfig.opacity;
    //   forEach(axis.newConfig.labels, function (label) {
    //     var labelValue = abbr ? (label.label()/1000).toString() : label.label().toString();
    //     label.updatePosition(_perc_);
    //     ctx.fillText(labelValue + " " + axis.unit(), grid.left - margin, label.getY());
    //   });
    //   ctx.restore();

    //   axis.fadeIn("new");
    //   axis.fadeOut("current");
    //   if (axis.newConfig.opacity == 1) {
    //     // axis.config=axis.newConfig;
    //     labels = axis.newConfig.labels;
    //     opacity = axis.newConfig.opacity;

    //     // Reset values for next update
    //     axis.newConfig.labels = [];
    //     axis.newConfig.opacity = 0;
    //   }
    // }
    // else {
    //   axis.fadeIn("current");
    // }
    ctx.restore();
  }


  ///////////////////////////////
  // Public Methods & Variables
  ///////////////////////////////

  axis.unit = function (_) {
    if(!arguments.length) return unit;
    unit = _;
    return axis;
  }

  return axis;
}
