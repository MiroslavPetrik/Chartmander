---
layout: post
title:  Line chart
anchor: line-chart
date:   2014-03-14
categories: chartmander linechart getting started
---

### Example
<canvas id="line-example" width="800" height="300"></canvas>

### Code
{% highlight html %}
<canvas id="line-example" width="800" height="300"></canvas>
{% endhighlight %}

{% highlight javascript %}
Chartmander.addChart(function(){
	// Select your bar model with select method
	// first parameter is ID of your canvas element and the second one is model of chart
	var chart = hartmander.select("line-example", "line");

	// style your chart
	chart.innerRadius(.8);
	
	// pass your data
	chart.render(data);
	
	// return chart back to chartmander
	return chart;
});
{% endhighlight %}
