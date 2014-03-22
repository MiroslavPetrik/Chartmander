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
{% highlight javascript %}
Chartmander.addChart(function(){
	// Select your model with ID
	var chart = hartmander.select("line-chart", "line");

	// style your chart
	chart.innerRadius(.8);
	
	// pass your data
	chart.render(data);
	
	// return chart back to chartmander
	return chart;
});
{% endhighlight %}

[gh-repo]: https://github.com/11th/Chartmander/blob/gh-pages/js/Chartmander.js
