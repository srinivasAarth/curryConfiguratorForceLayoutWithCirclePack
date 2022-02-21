import React from "react";
import * as d3 from "d3";
import data from "../components/collapseLayout.json";
const CollapsedForceLayout = () => {
  const collapseRef = React.useRef(null);
  React.useEffect(() => {
    const width = 1000,
      height = 600;

    let i = 0;

    const root = d3.hierarchy(data);
    const transform = d3.zoomIdentity;
    let node, link;

    const svg = d3
      .select(collapseRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 8, -height / 2, width, height])
      //   .attr("style", "max-width: 100vw;  height: intrinsic; color , green")
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 2, 8])
          .on("zoom", zoomed)
      )
      .append("g")
      .attr("transform", "translate(-40,0)");

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 10))
      .on("tick", ticked);

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    function collapseAll() {
      collapse(root);
      update();
    }
    // update();
    collapseAll();

    function update() {
      const nodes = flatten(root);
      const links = root.links();

      link = svg.selectAll(".link").data(links, function (d) {
        return d.target.id;
      });

      link.exit().remove();

      const linkEnter = link
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#000")
        .style("opacity", "0.2")
        .style("stroke-width", 2);

      link = linkEnter.merge(link);

      node = svg.selectAll(".node").data(nodes, function (d) {
        return d.id;
      });

      node.exit().remove();

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("stroke", "#666")
        .attr("stroke-width", 2)
        .style("fill", color)
        .style("opacity", 1)
        .on("click", clicked)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      nodeEnter
        .append("circle")
        .attr("r", function (d) {
          return Math.sqrt(d.data.size) / 10 || 4.5;
        })
        .style("text-anchor", function (d) {
          return d.children ? "end" : "start";
        })
        .text(function (d) {
          return d.data.name;
        });

      node = nodeEnter.merge(node);
      simulation.nodes(nodes);
      simulation.force("link").links(links);
    }

    function sizeContain(num) {
      num = num > 1000 ? num / 1000 : num / 100;
      if (num < 4) num = 4;
      return num;
    }

    function color(d) {
      return d._children
        ? "#51A1DC" // collapsed package
        : d.children
        ? "#51A1DC" // expanded package
        : "#F94B4C"; // leaf node
    }

    function radius(d) {
      return d._children ? 8 : d.children ? 8 : 4;
    }

    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("transform", function (d) {
        return `translate(${d.x}, ${d.y})`;
      });
    }

    function clicked(event, d) {
      if (event.defaultPrevented) return;
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget().restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function flatten(root) {
      const nodes = [];
      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        else ++i;
        nodes.push(node);
      }
      recurse(root);
      return nodes;
    }

    function zoomed(event) {
      svg.attr("transform", event.transform);
    }

    update();
  });

  return <div ref={collapseRef}></div>;
};

export default CollapsedForceLayout;
