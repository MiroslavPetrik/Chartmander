
var Chartmander = function (element) {

	var chart = this

	this.canvas = document.getElementById(element);
	this.ctx = this.canvas.getContext('2d');
	this.config = {
		width: this.ctx.canvas.width,
		height: this.ctx.canvas.height,
		colors: ["#EC6650", "#86D5F1", "#FAC84B"],
		font: "12px Arial, sans-serif",
		fontColor: "#555",
		animate: true,
		hovered: false,
		animationStep: 100,
		animationCompleted: 0,
		easing: "easeInExpo",
		onAnimationCompleted: null,
		mouse: {}
	};

	this.datasets = [];
	this.crosshair = {
		x: null,
		y: null,
		visible: true,
		sticky: true,
		color: "orangered",
		lineWidth: 1
	}

	this.canvas.addEventListener("mouseenter", handleEnter, false);
	this.canvas.addEventListener("mousemove", handleHover, false);
	this.canvas.addEventListener("mouseleave", handleLeave, false);

	if (window.devicePixelRatio) {
		this.ctx.canvas.style.width = this.config.width + "px";
		this.ctx.canvas.style.height = this.config.height + "px";
		this.ctx.canvas.height = this.config.height * window.devicePixelRatio;
		this.ctx.canvas.width = this.config.width * window.devicePixelRatio;
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	this.clear = function () {
		this.ctx.clearRect(0, 0, this.config.width, this.config.height);
	};

	function handleHover (e) {
		chart.config.mouse = {
			x: e.pageX - this.offsetLeft,
			y: e.pageY - this.offsetTop
		}
		if (chart.config.animationCompleted >= 1)
			chart.draw(true)
	}

	function handleEnter () {
		chart.config.hovered = true;
	}

	function handleLeave () {
		chart.config.hovered = false;
		if (chart.config.animationCompleted >= 1)
			chart.draw(true)
	}

	this.easingFunction = function (_) {
		this.config.easing = _;
		return chart
	}

	this.pointRadius = function (_) {
		this.config.pointRadius = _;
		return chart
	}

	this.fontColor = function (_) {
		this.config.fontColor = _;
		return chart
	}

	this.font = function (_) {
		this.config.font = _;
		return chart
	}

	this.crossColor = function (_) {
		this.crosshair.color = _;
		return chart
	}

	this.colors = function (_) {
		this.config.colors = _;
		return chart
	}

	return chart;
}


Chartmander.prototype.Bar = function (data) {

	var chart = this
		, config = chart.config
		;

	// Bar Chart Defaults
	config.margin = { top: 50, right: 50, bottom: 50, left: 50 };
	config.stacked = false;
	config.maxBarWidth = 20;
	config.datasetSpacing = 5;

	// Construct
	chart.datasets = getDatasetFrom(data, "bar");
	chart.xAxis = getAxesFrom(chart.datasets)[0];
	chart.yAxis = getAxesFrom(chart.datasets)[1];
	chart.grid = new Grid();

	chart.grid.calculateProperties(config.margin, config);

	chart.draw = function () {

		var ctx = chart.ctx
			, margin = config.margin
			, grid = chart.grid.config.properties

		// temp
		config.labelSpace = grid.width / chart.xAxis.labels.length;

		chart.yAxis.recalc(grid.height)

		function drawBars (_perc_) {
			var setsCount = chart.datasets.length
				, barWidth = config.maxBarWidth

			if( (setsCount * barWidth + (setsCount-1)*config.datasetSpacing) > config.labelSpace )
				barWidth = Math.floor( (config.labelSpace - ((setsCount-1)*config.datasetSpacing)) / setsCount );

			var datasetCounter = 0
				, groupWidth = barWidth*chart.datasets.length + config.datasetSpacing*(chart.datasets.length-1)
				, groupOffset = (config.labelSpace - groupWidth)/2

			ctx.save();
			forEach(chart.datasets, function (set) {
				ctx.fillStyle = config.colors[datasetCounter];
				var counter = 0;
				set.each(function (bar) {
					var fromLeft = grid.left + groupOffset + datasetCounter*barWidth + counter*config.labelSpace + datasetCounter*config.datasetSpacing;
					ctx.fillRect(fromLeft, grid.bottom - chart.yAxis.zeroLevel, barWidth, -bar.value/chart.yAxis.valuePerPixel*_perc_ );
					counter++;
				})
				datasetCounter++;
			})
			ctx.restore();
		}
		
		var animationCompleted = chart.config.animate ? 0 : 1
			, easingFunction = chart.easing(chart.config.easing)
			, animationStep = 1/chart.config.animationStep
			;

		function loop () {
			animationCompleted += animationStep;
			chart.clear();
			chart.xAxis.drawInto(chart);
			chart.yAxis.drawInto(chart);
			chart.grid.drawInto(chart);
			drawBars(easingFunction(animationCompleted));

			if(animationCompleted < 1){
				requestAnimationFrame(loop);
			}
			else {
				console.log("Animation Finished.")
			}
		}
		
		// Global paint settings
		ctx.font = config.font;
		// First paint
		requestAnimationFrame(loop);
	}

	this.datasetSpacing = function (_) {
		this.config.datasetSpacing = _;
		return chart;
	}

	chart.draw();
	return chart;
}

Chartmander.prototype.Pie = function(data) {

	var chart = this
		, config = chart.config
		;

	// Pie Chart Defaults
	config.margin = { top: 50, right: 50, bottom: 50, left: 50 };
	config.radius = 100;
	config.innerRadius = 70;
	config.scaleAnimation = false;
	config.rotateAnimation = true;

	// construct
	chart.dataset = new Dataset(data[0], "pie");

	chart.draw = function () {

		var ctx = chart.ctx

		function drawSegments (_perc_) {
			var segmentsTotal = chart.dataset.size()
				, radiusScale = config.scaleAnimation ? _perc_ : 1
				, pieRotate = config.rotateAnimation ? _perc_ : 1
				, centerX = ( ( config.width - (config.radius*2) ) / 2 ) + config.radius
				, centerY = ( ( config.height - (config.radius*2) ) / 2 ) + config.radius
				, startAngle = -Math.PI/2
				, segmentIndex = 0;

			chart.dataset.each(function (segment) {
				var segmentAngle = segment.getAngle(segmentsTotal)*pieRotate;
				
				ctx.beginPath();
				ctx.arc(centerX, centerY, radiusScale * config.radius, startAngle, startAngle + segmentAngle, false);
				ctx.arc(centerX, centerY, radiusScale * config.innerRadius, startAngle + segmentAngle, startAngle, true);
				ctx.closePath();
				ctx.fillStyle = config.colors[segmentIndex];
				ctx.fill();

				segmentIndex++;
				startAngle += segmentAngle;
			})
		}

		var animationCompleted = config.animate ? 0 : 1
			, easingFunction = chart.easing(chart.config.easing)
			, animationStep = 1/chart.config.animationStep

		function loop (){
			animationCompleted += animationStep;
			chart.clear();
			drawSegments(easingFunction(animationCompleted));

			if(animationCompleted < 1){
				requestAnimationFrame(loop);
			}
			else {
				console.log("Animation Finished.")
			}
		}

		requestAnimationFrame(loop)
	}

	this.innerRadius = function (_) {
		this.config.innerRadius = _;
		return chart;
	}

	chart.draw();
	return this;
};

Chartmander.prototype.Line = function (data) {

	var chart = this
		, config = chart.config
		;

	// Line Chart Defaults
	config.margin = { top: 50, right: 50, bottom: 50, left: 50 };
	config.pointRadius = 4;
	config.lineWidth = 3;
	config.pointHoverRadius = 30;
	config.mergeHover = true;

	// Construct
	chart.datasets = getDatasetFrom(data, "line");
	chart.xAxis = getAxesFrom(chart.datasets)[0];
	chart.yAxis = getAxesFrom(chart.datasets)[1];
	chart.grid = new Grid();

	// Temp
	chart.grid.calculateProperties(config.margin, config);

	chart.draw = function (finished) {

		var ctx = chart.ctx
			, margin = config.margin
			, grid = chart.grid.config.properties

		chart.yAxis.recalc(grid.height)
		// Temp
		config.labelSpace = grid.width/chart.xAxis.labels.length;

		function drawLines (_perc_) {

			var datasetCounter = 0
				, setsCount = chart.datasets.length
				, barWidth = config.maxBarWidth

			if( (setsCount * barWidth + (setsCount-1)*config.datasetSpacing) > config.labelSpace )
				barWidth = Math.floor( (config.labelSpace - ((setsCount-1)*config.datasetSpacing)) / setsCount );

			ctx.lineWidth = config.lineWidth
			ctx.save();

			forEach(chart.datasets, function (set) {
				ctx.strokeStyle = config.colors[datasetCounter];
				ctx.fillStyle = config.colors[datasetCounter];

				var counter = 1
					, pointX
					, pointY
					, yBase = grid.bottom - chart.yAxis.zeroLevel
					, shiftX = config.labelSpace/2
					;

				// Draw Lines
				ctx.beginPath();
				set.each(function (point) {
					pointX = grid.left + counter*config.labelSpace - shiftX;
					pointY = yBase - (point.value/chart.yAxis.valuePerPixel)*_perc_;
					ctx.lineTo(pointX, pointY);
					counter++;
				})
				ctx.stroke();

				// Draw Circles 
				counter = 1;
				set.each(function (point) {
					ctx.beginPath()
					pointX = grid.left + counter*config.labelSpace - shiftX;
					pointY = yBase - (point.value/chart.yAxis.valuePerPixel)*_perc_;
					ctx.arc(pointX, pointY, config.pointRadius, 0, Math.PI*2, false);
					if (point.isHovered(config.mouse, {x: pointX, y: pointY}, config.pointHoverRadius, config.mergeHover) && config.hovered){
						chart.hoveredItems.push({
							set: set.title,
							setID: datasetCounter,
							y: point.value,
							x: point.label,
							position: {
								x: pointX,
								y: pointY
							}
						})
					}
					ctx.fill()
					counter++;
				})

				datasetCounter++;
			})

			ctx.restore();
		}

		config.animationCompleted = config.animate ? 0 : 1
		var easingFunction = chart.easing(chart.config.easing)
			, animationStep = 1/chart.config.animationStep
			, hoveredInThisRepaint = []
			;

		function loop () {
			config.animationCompleted += animationStep;

			// Clear hover every time
			chart.hoveredItems = []

			if(finished)
				config.animationCompleted = 1

			chart.clear();
			chart.xAxis.drawInto(chart);
			chart.yAxis.drawInto(chart);
			chart.grid.drawInto(chart);
			drawLines(easingFunction(config.animationCompleted));
			chart.grid.drawCrosshairInto(chart);
			chart.drawHovered();

			if(chart.hoveredItems.length)
				chart.tooltip = new Tooltip (chart.hoveredItems);
			else
				chart.tooltip = null

			if(chart.tooltip)
				chart.tooltip.drawInto(chart);

			if(config.animationCompleted < 1){
				requestAnimationFrame(loop);
			}
			else {
				console.log("Animation Finished.")
			}
		}
		// Global paint settings
		ctx.textBaseline = "middle";
		ctx.font = config.font;
		// First paint
		requestAnimationFrame(loop)
	}

	chart.drawHovered = function () {
		var ctx = chart.ctx;
		ctx.save();
		forEach(chart.hoveredItems, function(item) {
			ctx.fillStyle = config.colors[item.setID];
			ctx.beginPath();
			if(chart.crosshair.x == item.position.x)
				ctx.arc(item.position.x, item.position.y, config.pointRadius+5, 0, Math.PI*2, false);
			else {
				chart.hoveredItems.splice(indexOf.call(chart.hoveredItems, item), 1);
			}
			ctx.fill();
		})
		ctx.restore();
	}

	chart.draw();
	return chart;
};

// Components
var xAxis = function (labels) {

	this.labels = labels;

	this.each = function (action) {
		forEach(this.labels, action)
	}

	this.drawInto = function (chart) {
		var ctx = chart.ctx
			, config = chart.config
			, grid = chart.grid.config.properties

		var counter = 0;
		ctx.save();
		ctx.fillStyle = config.fontColor;
		ctx.font = config.font;
		this.each(function(label){
			var labelWidth = ctx.measureText(label).width
				, start = config.labelSpace/2 + (grid.left + config.labelSpace*counter) - labelWidth / 2

			ctx.fillText(label, start, grid.bottom + 25);
			counter++;
		});
		ctx.restore();
	}

}

var yAxis = function (labels) {

	var axis = this

	this.dataMin = labels[0];
	this.dataMax = labels[1];
	this.labels = [];
	this.zeroLevel = 0;
	this.valuePerPixel = 0.1;
	this.labelOffset

	this.recalc = function (height) {

		var delta = this.dataMax - this.dataMin
			, maxLabelCount = Math.floor(height / 25) // 25px is minimum space between 2 labels
			, labelValueSteps = [1, 2, 5] // Base numbers for axis label so labels can be with base 10,20,50 or 100, 200, 500 etc.

		var stepBase = delta.toExponential().split("e");

		stepExponent = parseInt(stepBase[1]);
		stepBase = closestElement(stepBase[0], labelValueSteps);

		this.valuePerPixel = delta/height
		this.zeroLevel = height - this.dataMax/this.valuePerPixel
		this.labels = getLabels( getAxeSetup(stepBase, stepExponent) )

		function getLabels (setup) {
			var labels = []
				, lefts = setup.labelCount
				, step = setup.valueStep
				, currLabel = 0
				;

			labels.push({
				value: 0,
				string: "0",
				position: axis.zeroLevel
			});

			while(Math.abs(currLabel - axis.dataMin) > step){
				currLabel = currLabel - step;
				labels.splice(0, 0, {
					value: currLabel,
					string: currLabel.toString(),
					position: axis.zeroLevel + currLabel/axis.valuePerPixel
				})
			}

			currLabel = 0;

			while( (axis.dataMax - currLabel) > step){
				currLabel = currLabel + step;
				labels.push({
					value: currLabel,
					string: currLabel.toString(),
					position: axis.zeroLevel + currLabel/axis.valuePerPixel
				})
			}

			return labels;
		}

		function getAxeSetup (base, exponent, stop) {
			var currIndex = indexOf.call(labelValueSteps, base)
				, newIndex
				, newExponent
				, currLabelValueStep = Math.pow(10, exponent)*base
				, currLabelCount = delta/currLabelValueStep
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
				newIndex = (currIndex - 1 <= -1) ? 2 : (currIndex - 1)
				newExponent = (newIndex == 2) ? (exponent - 1) : exponent

				return getAxeSetup(labelValueSteps[newIndex], newExponent);
			}
			else {
				// Too far, return previous and stop
				newIndex = (currIndex + 1 >=  3) ? 0 : (currIndex + 1)
				newExponent = (newIndex == 0) ? (exponent + 1) : exponent

				return getAxeSetup(labelValueSteps[newIndex], newExponent, true);
			}

		}
	}

	this.each = function (action) {
		forEach(this.labels, action);
	}

	this.drawInto = function (chart) {
		var ctx = chart.ctx
			, config = chart.config
			, grid = chart.grid.config.properties

		var counter = this.labels.length;
		ctx.save();
		ctx.textAlign = "right";
		ctx.fillStyle = config.fontColor;
		ctx.font = config.font;
		this.each(function(label){
			ctx.fillText(label.string, grid.left - 10, grid.bottom - label.position);
			counter--;
		});
		ctx.restore();
	}
}

var Grid = function () {

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

	this.drawInto = function (chart) {
		var ctx = chart.ctx
			, grid = this.config;

		if (grid.visible) {
			ctx.strokeStyle = grid.lineColor;
			ctx.lineWidth = grid.lineWidth;

			if (grid.horizontalLines) {
				chart.yAxis.each(function(line){
					var yOffset = grid.properties.bottom - line.position;
					ctx.beginPath();
					ctx.moveTo(grid.properties.left, yOffset);
					ctx.lineTo(grid.properties.right, yOffset);
					ctx.stroke();
				})
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

	this.isInsideX = function (point) {
		 return point.x >= this.config.properties.left && point.x <= this.config.properties.right
	}

	this.drawCrosshairInto = function (chart) {

		var crosshair = chart.crosshair

		if (crosshair.visible && chart.config.hovered) {
			chart.ctx.save()
			chart.ctx.strokeStyle = crosshair.color;
			chart.ctx.lineWidth = crosshair.lineWidth;

			if (chart.grid.isInsideX(chart.config.mouse)) {
				crosshair.x = chart.config.mouse.x;
				if (crosshair.sticky && chart.hoveredItems.length > 0) {
					var availablePoints = []
					forEach(chart.hoveredItems, function (point) {
						availablePoints.push(point.position.x)
					})
					crosshair.x = closestElement(crosshair.x, availablePoints)
				}
			}
			else
				return;

			chart.ctx.beginPath();
			chart.ctx.moveTo(crosshair.x, this.config.properties.top);
			chart.ctx.lineTo(crosshair.x, this.config.properties.bottom);
			chart.ctx.stroke();
			chart.ctx.restore();
		}
	}

	this.lineColor = function (_){
		this.config.lineColor = _;
		return this;
	}
	this.verticalLines = function (_){
		this.config.verticalLines = _;
		return this;
	}
}

var Dataset = function (set, setType) {

	this.title = set.title;
	this.elements = getElements(setType);

	this.each = function (action) {
		forEach(this.elements, action)
	}

	this.size = function () {
		var total = 0;
		this.each(function(element){
			total += element.value
		})
		return total
	}

	function getElements (type) {
		switch (type) {
			case "bar": return getBars();
			case "pie": return getSegments();
			case "line": return getPoints();
			default: return;
		}
	}

	function getBars () {
		var result = [];
		forEach(set.values, function (barData) {
			result.push(new Bar(barData));
		})
		return result;
	}

	function getSegments () {
		var result = [];
		forEach(set.values, function (segmentData) {
			result.push(new Segment(segmentData));
		})
		return result;
	}
	
	function getPoints () {
		var result = [];
		forEach(set.values, function (pointData) {
			result.push(new Point(pointData));
		})
		return result;
	}

	return this;
}

var Tooltip = function (items) {

	var tooltip = this

	this.items = items

	this.getStrings = function () {
		var strings = []
		forEach(tooltip.items, function(item) {
			strings.push(item.set + " " + item.y);
		})
		return strings;
	}

	this.getXLabel = function () {
		return tooltip.items[0].x
	}

	this.drawInto = function (chart) {
		var ctx = chart.ctx
			, mouse = chart.config.mouse
			, counter = 1
			;

		ctx.save();
		ctx.fillStyle = "#555";
		ctx.fillRect(mouse.x, mouse.y, 150, 80);
		ctx.fillStyle = "#FFF";

		ctx.fillText(tooltip.getXLabel(), mouse.x + 10, mouse.y+counter*20)
		counter++;

		forEach(tooltip.getStrings(), function(string){
			ctx.fillText(string, mouse.x + 10, mouse.y+counter*20);
			counter++;
		})
		ctx.restore();
	}

	return this
}

var Bar = function (data) {
	this.value = data.value;
	this.label = data.label;
}

var Segment = function (data) {
	this.value = data.value;
	this.label = data.label;
	this.getAngle = function (total) {
		return (this.value/total)*Math.PI*2;
	}
}

var Point = function(data) {
	this.set = data.set;
	this.label = data.label;
	this.value = data.value;

	this.isHovered = function (mouse, point, radius, mergeHover) {
		if (mergeHover)
			return Math.abs(mouse.x - point.x) < radius
		else
			return Math.abs(mouse.x - point.x) < radius && Math.abs(mouse.y - point.y) < radius
	}
}

Chartmander.prototype.easing = function (myEasing) {

	var functions = {
		linear : function (t){
			return t;
		},
		easeInQuad: function (t) {
			return t*t;
		},
		easeOutQuad: function (t) {
			return -1 *t*(t-2);
		},
		easeInOutQuad: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t;
			return -1/2 * ((--t)*(t-2) - 1);
		},
		easeInCubic: function (t) {
			return t*t*t;
		},
		easeOutCubic: function (t) {
			return 1*((t=t/1-1)*t*t + 1);
		},
		easeInOutCubic: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t;
			return 1/2*((t-=2)*t*t + 2);
		},
		easeInQuart: function (t) {
			return t*t*t*t;
		},
		easeOutQuart: function (t) {
			return -1 * ((t=t/1-1)*t*t*t - 1);
		},
		easeInOutQuart: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t*t;
			return -1/2 * ((t-=2)*t*t*t - 2);
		},
		easeInQuint: function (t) {
			return 1*(t/=1)*t*t*t*t;
		},
		easeOutQuint: function (t) {
			return 1*((t=t/1-1)*t*t*t*t + 1);
		},
		easeInOutQuint: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t*t*t;
			return 1/2*((t-=2)*t*t*t*t + 2);
		},
		easeInSine: function (t) {
			return -1 * Math.cos(t/1 * (Math.PI/2)) + 1;
		},
		easeOutSine: function (t) {
			return 1 * Math.sin(t/1 * (Math.PI/2));
		},
		easeInOutSine: function (t) {
			return -1/2 * (Math.cos(Math.PI*t/1) - 1);
		},
		easeInExpo: function (t) {
			return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1));
		},
		easeOutExpo: function (t) {
			return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1);
		},
		easeInOutExpo: function (t) {
			if (t==0) return 0;
			if (t==1) return 1;
			if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
			return 1/2 * (-Math.pow(2, -10 * --t) + 2);
			},
		easeInCirc: function (t) {
			if (t>=1) return t;
			return -1 * (Math.sqrt(1 - (t/=1)*t) - 1);
		},
		easeOutCirc: function (t) {
			return 1 * Math.sqrt(1 - (t=t/1-1)*t);
		},
		easeInOutCirc: function (t) {
			if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
			return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
		},
		easeInElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
		},
		easeOutElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
		},
		easeInOutElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p )*.5 + 1;
		},
		easeInBack: function (t) {
			var s = 1.70158;
			return 1*(t/=1)*t*((s+1)*t - s);
		},
		easeOutBack: function (t) {
			var s = 1.70158;
			return 1*((t=t/1-1)*t*((s+1)*t + s) + 1);
		},
		easeInOutBack: function (t) {
			var s = 1.70158; 
			if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
			return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
		},
		easeInBounce: function (t) {
			return 1 - animationOptions.easeOutBounce (1-t);
		},
		easeOutBounce: function (t) {
			if ((t/=1) < (1/2.75)) {
				return 1*(7.5625*t*t);
			} else if (t < (2/2.75)) {
				return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
			} else if (t < (2.5/2.75)) {
				return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
			} else {
				return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
			}
		},
		easeInOutBounce: function (t) {
			if (t < 1/2) return animationOptions.easeInBounce (t*2) * .5;
			return animationOptions.easeOutBounce (t*2-1) * .5 + 1*.5;
		}
	}

	return functions[myEasing];
};

//////////////////////////////////////////////////////////////

var requestAnimationFrame = (function(){
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

function closestElement (element, array) {
	return array.reduce(function (prev, curr) {
		return (Math.abs(curr - element) < Math.abs(prev - element) ? curr : prev);
	});
}

function forEach (items, action) {
	for (var i = 0; i < items.length; i++) {
		action(items[i])
	};
}

function getDatasetFrom (data, type) {
	var result = [];
	forEach(data, function(set) {
		result.push(new Dataset(set, type));
	});
	return result;
}

function getAxesFrom (datasets) {
	var xLabels = []
		, yLowest = 0
		, yHighest = 0
		;

	// Labels filter
	forEach(datasets, function (set) {
		set.each(function(bar){
			if(indexOf.call(xLabels, bar.label) === -1 )
				xLabels.push(bar.label);

			if(bar.value > yHighest)
				yHighest = bar.value;

			if(bar.value < yLowest)
				yLowest = bar.value
		})
	})

	return [new xAxis(xLabels), new yAxis([yLowest, yHighest])];
}

var indexOf = function(needle) {
	if (typeof Array.prototype.indexOf === 'function') {
		indexOf = Array.prototype.indexOf;
	} else {
		indexOf = function(needle) {
			var i = -1, index = -1;

			for(i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					index = i;
					break;
				}
			}

			return index;
		};
	}

	return indexOf.call(this, needle);
};
