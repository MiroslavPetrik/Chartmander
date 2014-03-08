var yAxis = function (labels) {

  var axis = this;

  this.dataMin = labels[0];
  this.dataMax = labels[1];
  this.config = {
    unit: "",
    abbr: false,
    margin: 10,

    labels: [],
    zeroLevel: 0,
    VPP: 0, // Value Per Pixel
    opacity: 0
  };
  this.newConfig = {
    labels: [],
    zeroLevel: 0,
    VPP: 0,
    opacity: 0
  };


  this.recalc = function (chart) {

    var range = this.dataMax - (this.dataMin > 0 ? 0 : this.dataMin)
      , height = chart.getGridProperties().height
      , maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
      , labelValueSteps = [1, 2, 5]
      , stepBase = range.toExponential().split("e")
      , stepExponent = parseInt(stepBase[1])
      ;

    stepBase = closestElement(stepBase[0], labelValueSteps);
    var labels = getLabels(getAxeSetup(stepBase, stepExponent));

    // First time 
    if (axis.config.labels.length == 0) {
      axis.config.VPP = range/height;
      axis.config.zeroLevel = height - this.dataMax/axis.config.VPP;
      axis.config.labels = labels;

      // Set Positions for labels
      for (var i=0, len=axis.config.labels.length; i<len; i++) {
        var label = axis.config.labels[i]
          , prev
          ;
        if (label.value < 0)
          prev = axis.config.labels[i+1];
        else if (label.value > 0)
          prev = axis.config.labels[i-1];
        else if (label.value == 0) {
          label.startAt(chart.getBase()).moveTo(false, chart.getBase());
          continue;
        }
        label.startAt(chart.getBase() - prev.value/axis.config.VPP).moveTo(false, chart.getBase() - label.value/axis.config.VPP);
      }
    }
    // On update
    else {
      axis.newConfig.VPP = range/height;
      axis.newConfig.zeroLevel = height - this.dataMax/axis.newConfig.VPP;
      axis.newConfig.labels = labels;

      forEach(axis.config.labels, function (label) {
        // Move to updated position
        label.savePosition().moveTo(false, chart.getGridProperties()["bottom"] - axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP)
      });

      forEach(axis.newConfig.labels, function (label) {
        // Render to old position and move to new
        label.startAt(chart.getGridProperties()["bottom"] - axis.config.zeroLevel - label.value/axis.config.VPP).moveTo(false,chart.getGridProperties()["bottom"]- axis.newConfig.zeroLevel - label.value/axis.newConfig.VPP);
      });

      axis.config.VPP = axis.newConfig.VPP;
      axis.config.zeroLevel = axis.newConfig.zeroLevel;
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

      labels.push(new Element(labelData, "yAxis").Label());

      while ( -(axis.dataMin - currLabel) > step) {
        currLabel = currLabel - step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.splice(0, 0, new Element(labelData, "yAxis").Label());
      }

      currLabel = 0;

      while ( (axis.dataMax - currLabel) > step) {
        currLabel = currLabel + step;
        labelData = {
          label: currLabel,
          value: currLabel
        }
        labels.push(new Element(labelData, "yAxis").Label())
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
  }

  this.VPP = function () {
      return this.config.VPP;
  }

  this.fadeIn = function (axis) {
    if (axis=="new") {
      this.newConfig.opacity += .05;
      if(this.newConfig.opacity>1)
        this.newConfig.opacity = 1;
    }
    else if (axis=="current") {
      this.config.opacity += .05;
      if(this.config.opacity>1)
        this.config.opacity = 1;
    }
  }

  this.fadeOut = function (axis) {
    if (axis=="new") {
      this.newConfig.opacity -= .05;
      if(this.newConfig.opacity<0)
        this.newConfig.opacity = 0;
    }
    else if (axis=="current") {
      this.config.opacity -= .05;
      if(this.config.opacity<0)
        this.config.opacity = 0;
    }
  }

  this.drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , cfg = chart.config
      , grid = chart.grid.config.properties
      ;

    if (cfg.yAxisVisible) {
      ctx.save();
      ctx.textAlign = "right";
      ctx.fillStyle = cfg.fontColor;
      ctx.font = cfg.font;
      ctx.save();
      ctx.globalAlpha = axis.config.opacity;
      forEach(this.config.labels, function (label) {
        var labelValue = axis.config.abbr ? (label.label/1000).toString() : label.label.toString();
        label.updatePosition(_perc_);
        ctx.fillText(labelValue + " " + axis.unit(), grid.left - axis.config.margin, label.getY());
      });
      ctx.restore();
      if (axis.newConfig.labels.length > 0) {
        ctx.save();
        ctx.globalAlpha = axis.newConfig.opacity;
        forEach(this.newConfig.labels, function (label) {
          var labelValue = axis.config.abbr ? (label.label/1000).toString() : label.label.toString();
          label.updatePosition(_perc_);
          ctx.fillText(labelValue + " " + axis.unit(), grid.left - axis.config.margin, label.getY());
        });
        ctx.restore();

        axis.fadeIn("new");
        axis.fadeOut("current");
        if (axis.newConfig.opacity == 1) {
          // axis.config=axis.newConfig;
          axis.config.labels = axis.newConfig.labels;
          axis.config.opacity = axis.newConfig.opacity;

          // Reset values for next update
          axis.newConfig.labels = [];
          axis.newConfig.opacity = 0;
        }
      }
      else {
        axis.fadeIn("current");
      }
      ctx.restore();
    }
  }

  this.unit = function (_) {
    if(!arguments.length) return this.config.unit;
    this.config.unit = _;
    return this;
  }

  return this;
}
