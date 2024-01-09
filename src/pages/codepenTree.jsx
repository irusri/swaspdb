import React from "react";
import * as d3 from "d3";

const data = {
  name: "Gene Ontology",
  children: [
    {
      name: "MF-Molecular Function",
      value: 1000,
      children: [
        {
          name: "B - B1",
          value: 511,
          children: [
            {
              name: "C - C1",
              value: 510
            }
          ]
        },
        {
          name: "B - B2",
          value: 500,
          children: [
            {
              name: "C - C1",
              value: 500
            }
          ]
        }
      ]
    },
    {
      name: "BP-  Biological Process",
      value: 2000,
      children: [
        {
          name: "B - B1",
          value: 1500,
          children: [
            {
              name: "C - C1",
              value: 1500
            }
          ]
        },
        {
          name: "B - B2",
          value: 500,
          children: [
            {
              name: "C - C1",
              value: 500
            }
          ]
        }
      ]
    },
    {
        name: "CC- Cellular Component",
        value: 1200,
        children: [
          {
            name: "B - B1",
            value: 1500,
            children: [
              {
                name: "C - C1",
                value: 1500
              }
            ]
          },
          {
            name: "B - B2",
            value: 500,
            children: [
              {
                name: "C - C1",
                value: 500
              }
            ]
          }
        ]
      }
  ]
};
class Treegraph extends React.Component {
  state = {
    width: 400,
    height: 400
  };
  createTreeChart = () => {
    const width = 550;
    const height = 500;
    var paddingAllowance = 2;
    const format = d3.format(",d");
    const checkLowVal = d => {
      console.log("ChecklowVal", d);
      if (d.value < 2) {
        return true;
      }
    };
    const name = d => {
      let labelstring = "";
      const ancestors = d.ancestors().reverse();
      if (ancestors.length === 1) {
        labelstring = ancestors[0].data.name;
      } else if (ancestors.length > 1) {
        labelstring = ancestors
          .slice(1)
          .map(d => d.data.name.split("-").join(" > "))
          .join(", ");
      }
      return labelstring;
    };
    // const name = d => d.data.segment;
    function tile(node, x0, y0, x1, y1) {
      d3.treemapBinary(node, 0, 0, width, height);
      for (const child of node.children) {
        child.x0 = x0 + (child.x0 / width) * (x1 - x0);
        child.x1 = x0 + (child.x1 / width) * (x1 - x0);
        child.y0 = y0 + (child.y0 / height) * (y1 - y0);
        child.y1 = y0 + (child.y1 / height) * (y1 - y0);
      }
    }
    const treemap = data =>
      d3.treemap().tile(tile)(
        d3
          .hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
      );
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", [0.5, -30.5, width, height + 30])
      .style("font", "16px sans-serif");

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    // const svg = d3
    //   .create("svg")
    //   .select("#chart")
    //   .append("svg")
    //   .attr("viewBox", [0.5, -30.5, width, height + 30])
    //   .style("font", "10px sans-serif");

    let group = svg.append("g").call(render, treemap(data));

    function render(group, root) {
      const node = group
        .selectAll("g")
        .data(root.children.concat(root))
        .join("g");

      node
        .filter(d => (d === root ? d.parent : d.children))
        .attr("cursor", "pointer")
        .on("click", d => (d === root ? zoomout(root) : zoomin(d)));

      // node.append("title").text(d => `${name(d)}\n(${format(d.data.count)})`);
      var tool = d3
        .select("body")
        .append("div")
        .attr("class", "toolTip");

      d3.select(window.frameElement).style("height", height - 20 + "px");
      d3.select(window.frameElement).style("width", width - 20 + "px");
      node
        .append("rect")
        .attr("id", d => (d.leafUid = "leaf"))
        .attr("fill", d =>
          d === root ? "#fff" : d.children ? "#045c79" : "#045c79"
        )
        .attr("stroke", "#fff")
        .on("mousemove", function(d) {
          tool.style("left", d3.event.pageX + 10 + "px");
          tool.style("top", d3.event.pageY - 20 + "px");
          tool.style("display", "inline-block");
          tool.html(
            `${d.data.name.split("-")[1]}<br />(${format(d.data.value)})`
          );
        })
        .on("click", function(d) {
          tool.style("display", "none");
        })
        .on("mouseout", function(d) {
          tool.style("display", "none");
        });
      node
        .append("foreignObject")
        .attr("class", "foreignObject")
        .attr("width", function(d) {
          return d.dx - paddingAllowance;
        })
        .attr("height", function(d) {
          return d.dy - paddingAllowance;
        })
        .append("xhtml:body")
        .attr("class", "labelbody")
        .append("div")
        .attr("class", "label")
        .text(function(d) {
          console.log("LOG D", d);
          return d.data.name.split("-").join(" > ");
        })
        .attr("text-anchor", "middle");
      node
        .append("clipPath")
        .attr("id", d => (d.clipUid = "clip"))
        .append("use")
        .attr("xlink:href", d => d.leafUid.href);

      node
        .append("text")
        .attr("clip-path", d => d.clipUid)
        .attr("font-weight", d => (d === root ? "bold" : null))
        .attr("font-size", d => {
          if (d === root) return "0.8em";
          const width = x(d.x1) - x(d.x0),
            height = y(d.y1) - y(d.y0);
          return Math.max(
            Math.min(
              width / 5,
              height / 2,
              Math.sqrt(width * width + height * height) / 25
            ),
            9
          );
        })
        .attr("text-anchor", d => (d === root ? null : "middle"))
        .attr("transform", d =>
          d === root
            ? null
            : `translate(${(x(d.x1) - x(d.x0)) / 2}, ${(y(d.y1) - y(d.y0)) /
                2})`
        )
        .selectAll("tspan")
        .data(d => {
          const a =
            d === root
              ? name(d).split(/(?=\/)/g)
              : checkLowVal(d)
              ? d.data.name
                  .split("-")[1]
                  .split(/(\s+)/)
                  .concat(format(d.data.value))
              : d.data.name
                  .split("-")[1]
                  .split(/(\s+)/)
                  .concat(format(d.data.value));

          return a;
        })
        // .data(d => {
        //   if (d.children) {
        //     console.log("Yes");
        //   }
        // })
        .join("tspan")
        .attr("x", 3)
        .attr(
          "y",
          (d, i, nodes) =>
            `${(i === nodes.length - 1) * 0.3 + (i - nodes.length / 2) * 0.9}em`
        )
        // .attr("fill-opacity", (d, i, nodes) =>
        //   i === nodes.length - 1 ? 0.7 : null
        // )
        // .attr("font-weight", (d, i, nodes) =>
        //   i === nodes.length - 1 ? "normal" : null
        // )
        .text(d => d);
      node
        .selectAll("text")
        .classed("text-title", d => d === root)
        .classed("text-tile", d => d !== root)
        .filter(d => d === root)
        .selectAll("tspan")
        .attr("y", "1.1em")
        .attr("x", undefined);
      group.call(position, root);
    }
    function position(group, root) {
      group
        .selectAll("g")
        .attr("transform", d =>
          d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
        )
        .select("rect")
        .attr("width", d => (d === root ? width : x(d.x1) - x(d.x0)))
        .attr("height", d => (d === root ? 30 : y(d.y1) - y(d.y0)));
    }

    // When zooming in, draw the new nodes on top, and fade them in.
    function zoomin(d) {
      console.log("The zoomin func", d.data);
      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);
      const group0 = group.attr("pointer-events", "none");
      const group1 = (group = svg.append("g").call(render, d));
      svg
        .transition()
        .duration(750)
        .call(t =>
          group0
            .transition(t)
            .remove()
            .call(position, d.parent)
        )
        .call(t =>
          group1
            .transition(t)
            .attrTween("opacity", () => d3.interpolate(0, 1))
            .call(position, d)
        );
    }

    // When zooming out, draw the old nodes on top, and fade them out.
    function zoomout(d) {
      console.log("The zoomout func", d.parent.data);
      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);
      const group0 = group.attr("pointer-events", "none");
      const group1 = (group = svg.insert("g", "*").call(render, d.parent));
      svg
        .transition()
        .duration(750)
        .call(t =>
          group0
            .transition(t)
            .remove()
            .attrTween("opacity", () => d3.interpolate(1, 0))
            .call(position, d)
        )
        .call(t => group1.transition(t).call(position, d.parent));
    }

    return svg.node();
  };
  componentDidMount() {
    this.createTreeChart();
  }
  render() {
    return (
      <React.Fragment>
        <div id="chart" />
      </React.Fragment>
    );
  }
}

export default Treegraph;
