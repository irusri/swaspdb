import * as d3 from "d3";

var defaults = {
    margin: {top: 24, right: 0, bottom: 0, left: 0},
    rootname: "TOP",
    format: ",d",
    title: "",

    height: 600
};

function main(o, data) {
  var root,
      opts ={},
      formatNumber = d3.format(opts.format),
      rname = opts.rootname,
      margin = opts.margin,
      theight = 36 + 16;


  var width = opts.width - margin.left - margin.right,
      height = opts.height - margin.top - margin.bottom - theight,
      transitioning;
  
 	// var color = d3.scale.category20c(function(d){console.log(d);return d});
	//var colorDomain = [0.0000000001,0.000000001,.00000001,.0000001,.000001,.00001,.0001,.001,0.01,0.1,1]
	var colorDomain =[1,0.1,0.01,.001,.0001,.00001,.000001,.0000001,.00000001,0.000000001,0.0000000001];
	var colorRange = ["#ffffff","#ffbb00","#ffaa11","#ff9900","#ff7700","#ff5500","#ff3300","#cc2222","#aa0000"];//cc2222
	
var color = d3.scaleLinear()
		.domain(colorDomain)
		.range(colorRange
/*function(d){ console.log(d.pvalue);return d.colorRange}*/
			);	
	
	
  var x = d3.scaleLinear()
      .domain([0, width])
      .range([0, width]);
  
  var y = d3.scaleLinear()
      .domain([0, height])
      .range([0, height]);
  
  var treemap = d3.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return a.value - b.value; })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);
  
  var svg = d3.select("#gene_ontology_treemap").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");
  
  var grandparent = svg.append("g")
      .attr("class", "grandparent");
	
	
  
  grandparent.append("rect") // Chanaka
      .attr("y", -margin.top)
  .attr("fill", "white")
      .attr("width", width)
      .attr("height", margin.top);
  
  grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

	
/*	  var grandparent2 = svg.append("g")
	 grandparent2.append("rect")
	  .attr("y", margin.top)
	   .attr("fill", "black")
      .attr("width", 100)
      .attr("height", margin.top);*/
	
	
  if (opts.title) {
  //  $("#gene_ontology_treemap").prepend("<p class='title'>" + opts.title + "</p>");
  }
  if (data instanceof Array) {
    root = { key: rname, values: data };
  } else {
    root = data;
  }
	
	
//function reinitTool(s) {
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);
		 
//}

  if (window.parent !== window) {
    var myheight = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.parent.postMessage({height: myheight}, '*');
  }

  function initialize(root) {
    root.x = 0;
	  root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    return (d._children = d.values)
        ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
//	.style("color", "black") 
        .text(name(d));

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", transition);

    var children = g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter().append("g");

    children.append("rect")
        .attr("class", "child")
	 .attr("style", "outline: thin solid white;")
	.style("stroke", "white")
        .call(rect)
      .append("title")
        .text(function(d) { return d.key + " (" + formatNumber(d.value) + ")"; });
    children.append("text")
        .attr("class", "ctext")
        .text(function(d) { return d.key; })
        .call(text2);

   /* g.append("rect")
        .attr("class", "parent")
        .call(rect); Chanaka Mannapperuma */

    var t = g.append("text")
	
        .attr("class", "ptext")
	.style("font-weight", function(d){ if(d.parent.key=="Gene Ontology"){return "bold"}else{return "normal"}  }) 
	.style("fill", function(d){ if(d.parent.key=="Gene Ontology"){return "black"}else{return "black"}  }) 
        .attr("dy", ".75em")

    t.append("tspan")
        .text(function(d) { return d.key; });
    t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { 
		
		var npat=d.npat;
			if(npat==undefined){ 
				var npat=d.values[0].npat ;
					if(npat==undefined){
						var npat=d.values[0].values[0].npat
					} 
			} 
		
		var nt=d.nt;
			if(nt==undefined){ 
				var nt=d.values[0].nt ;
					if(nt==undefined){
						nt=d.values[0].values[0].nt;
					} 
			} 
		if(typeof(npat)!="undefined"){
		return nt+"/"+npat; 
		}
	
	});
    t.call(text);

    g.selectAll("rect")
        .style("fill", function(d) {
			var t=d.pvalue;
			if(t==undefined){ 
				var t=d.values[0].pvalue ;
					if(t==undefined){
						t=d.values[0].values[0].pvalue
					} 
			} 
			//console.log(t);
			return color(t)  
		});

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
      t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
      t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
      t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.selectAll("tspan")
        .attr("x", function(d) { return x(d.x) + 6; })
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; })
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
  }

  function text2(text) {
    text.attr("x", function(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
        .attr("y", function(d) { return y(d.y + d.dy) - 6; })
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
  }

	var parent_value=0;
  function name(d) {
	  var npat=d.value;
			if(npat==undefined){ 
				var npat=d.values[0].value ;
					if(npat==undefined){
						var npat=d.values[0].values[0].value
					} 
			} 
	  
	 if(!d.parent){
		  parent_value=parseFloat(d.value);
	  }
	 
	// var expensesAvgAmount = d3.nest().key(function(d) { return d.key; }).rollup(function(v) { return d3.sum(v, function(d) { console.log(d); return d.value; }); }).entries(d);
	  
    return d.parent
        ? name(d.parent) + " / " + d.key + " (" + parseInt((npat)/parent_value*100)+ "%)"
        : d.key ;
  }
}

