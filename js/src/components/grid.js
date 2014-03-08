

var Grid = function () {

  var grid = this;
  // Grid defaults
  this.config = {
    visible : true,
    horizontalLines : true,
    verticalLines : true,
    lineColor : "#DBDFE5",
    lineWidth : 1,
    evenOddContrast : true,
    oddColor : "#EAEAEA"
  }

  this.calculateProperties = function (margin, config) {
    this.config.properties = {
      top: margin.top,
      right: config.width - margin.right,
      bottom: config.height - margin.bottom,
      left: margin.left,
      width: (config.width - margin.right) - margin.left,
      height: (config.height - margin.bottom) - margin.top
    }
  }

  this.drawInto = function (chart, _perc_) {
    var ctx = chart.ctx
      , grid = this.config
      ;

    if (grid.visible) {
      ctx.strokeStyle = grid.lineColor;
      ctx.lineWidth = grid.lineWidth;

      if (grid.horizontalLines) {
        ctx.save();
        ctx.globalAlpha = chart.yAxis.config.opacity;
        forEach(chart.yAxis.config.labels, function (line) {
          ctx.beginPath();
          if (line.label == 0) {
            ctx.save();
            ctx.strokeStyle = "#999"; // TODO Axis Width and Color
          }
          ctx.moveTo(grid.properties.left, line.getY());
          ctx.lineTo(grid.properties.right, line.getY());
          ctx.stroke();
          if (line.label==0) ctx.restore();
        })
        ctx.restore();
      }
      if (chart.yAxis.newConfig.labels.length > 0) {
        ctx.save();
        ctx.globalAlpha = chart.yAxis.newConfig.opacity;
        forEach(chart.yAxis.newConfig.labels, function (line) {
          ctx.beginPath();
          if (line.label == 0) {
            ctx.save();
            ctx.strokeStyle = "#999"; // TODO Axis Width and Color
          }
          ctx.moveTo(grid.properties.left, line.getY());
          ctx.lineTo(grid.properties.right, line.getY());
          ctx.stroke();
          if (line.label==0) ctx.restore();
        })
        ctx.restore();
      }

      if (grid.verticalLines) {
        for (var i = 0; i < chart.xAxis.labels.length+1; i++) {
          var xOffset = grid.properties.left + i*(grid.properties.width / chart.xAxis.labels.length);

          ctx.beginPath();
          ctx.moveTo(xOffset, grid.properties.top);
          ctx.lineTo(xOffset, grid.properties.bottom);
          ctx.stroke();
        };
      }
    }
  }

  this.hasInRangeX = function (point) {
     return point.x >= this.config.properties.left && point.x <= this.config.properties.right;
  }

  this.drawCrosshairInto = function (chart) {

    var crosshair = chart.crosshair;

    if (crosshair.visible && chart.config.hovered) {
      chart.ctx.save();
      chart.ctx.strokeStyle = crosshair.color;
      chart.ctx.lineWidth = crosshair.lineWidth;

      if (chart.grid.hasInRangeX(chart.config.mouse)) {
        crosshair.x = chart.getMouse("x");
        if (crosshair.sticky && chart.itemsInHoverRange.length > 0) {
          var availablePoints = [];

          forEach(chart.hoveredItems, function (point) {
            availablePoints.push(point.position.x);
          })
          crosshair.x = closestElement(crosshair.x, availablePoints);
        }
      }
      else
        return;

      chart.ctx.beginPath();
      chart.ctx.moveTo(crosshair.x, grid.config.properties.top);
      chart.ctx.lineTo(crosshair.x, grid.config.properties.bottom);
      chart.ctx.stroke();
      chart.ctx.restore();
    }
  }

  this.lineColor = function (_) {
    this.config.lineColor = _;
    return this;
  }

  this.horizontalLines = function (_) {
    this.config.horizontalLines = _;
    return this;
  }

  this.verticalLines = function (_) {
    this.config.verticalLines = _;
    return this;
  }
}
