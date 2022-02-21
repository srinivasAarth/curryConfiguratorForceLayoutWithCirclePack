import React from "react";
import { data } from "../components/CollapsedFGLData";
import * as d3 from "d3";
import mySubsitutionImage from "../asserts/substitutionSvg.svg";
import shiffleImage from "../asserts/shiffleIcons.svg";
import nodeImage from "../asserts/recipe node.svg";
const CillapsedFLG = () => {
  console.log(data);
  const collapsedFLGRef = React.useRef(null);

  React.useEffect(() => {
    var width = 1200,
      height = 700,
      root;

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance(100)
      )
      //   .force("collide", d3.forceCollide())

      .force(
        "charge",
        d3.forceManyBody().distanceMin(20).distanceMax(4000).strength(-2000)
      )
      .force("center", d3.forceCenter())

      .on("tick", tick);

    var svg = d3
      .select(collapsedFLGRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

      .attr("stroke", "black")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("fill", "gray");
    var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");
    root = d3.hierarchy(data);
    function collapse(d) {
      if (d.children) {
        d._children = d.children;

        d._children.forEach(collapse);

        d.children = null;
      }
    }
    function collapseAll(dd) {
      //   collapse(root);
      root.children.forEach(collapse);

      update();
    }
    update();
    collapseAll();
    var nodeEnter, linkEnter;
    function update() {
      const nodes = flatten(root);
      const links = root.links();

      link = svg.selectAll(".link").data(links, function (d) {
        return d.target.id;
      });

      link.exit().remove();

      linkEnter = link
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "black")
        .style("opacity", "0.2")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "5,5"); //dashed array for line

      link = linkEnter.merge(link);

      node = svg.selectAll(".node").data(nodes, function (d) {
        return d.id;
      });

      node.exit().remove();

      nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("stroke", "#666")
        .attr("stroke-width", 2)
        .style("fill", color)
        .style("opacity", 1)
        .on("click", click)
        .raise()
        .on("mouseover", addText)
        .call(drag(simulation))
        .on("mouseout", function () {
          link.style("opacity", ".2");
        });
      function addText(event, d) {
        // console.log(d);

        link.style("opacity", function (l) {
          if (d === l.source || d === l.target) return ".7";
          else return ".2";
        });
      }

      const centerNode = nodeEnter.filter((d, i) => i === 48);

      centerNode
        .append("svg:image")
        .attr("xlink:href", nodeImage)
        .attr("x", "-40")
        .attr("y", "-40")
        .attr("width", "70")
        .attr("height", "70");

      const childNodes = nodeEnter.filter((d, i) => i !== 48);
      childNodes
        .append("rect")

        .attr("height", "35px")
        .attr("width", "100px")
        .attr("fill", "white")
        .attr("x", "-57px")
        .attr("y", "-17.5px")
        .attr("rx", "18px")
        .style("stroke", "#8ee556")
        .style("stroke-width", 2);
      childNodes
        .append("circle")
        .attr("r", 17)
        .attr("cx", -40)
        .attr("fill", "#e8fadc")
        .style("stroke", "#8ee556")
        .style("stroke-width", 2);

      childNodes
        .append("text")
        .style("fill", "black")
        .style("font-weight", "lighter")
        .style("font-family", "Roboto, sans-serif")
        .attr("font-size", ".8em")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", -6)
        .attr("dx", 10)
        .text((d, i) => d.id);

      childNodes
        .append("text")
        .style("fill", "gray")
        .style("font-weight", "lighter")
        // .style("color", "red")
        .style("font-family", "Roboto, sans-serif")
        .style("text-align", "left")
        .attr("font-size", ".4em")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", 4)
        .attr("dx", 10)
        .text((d, i) => `${i * 10}`.toString() + " " + "gms");

      childNodes
        .append("svg:image")
        .attr("xlink:href", mySubsitutionImage)
        .attr("x", "-50")
        .attr("y", "-10")
        .attr("width", "20")
        .attr("height", "20");
      childNodes
        .append("svg:image")
        .attr("xlink:href", shiffleImage)
        .attr("x", "10.4")
        .attr("y", "-37.5")
        .attr("width", "40")
        .attr("height", "40")
        .style("cursor", "pointer");

      node = nodeEnter.merge(node);
      simulation.nodes(nodes);
      simulation.force("link").links(links);
    }

    function drag(simulation) {
      function dragstarted(d) {
        if (!d.active) simulation.alphaTarget(1).restart();
        d.subject.fx = d.subject.x;
        d.subject.fy = d.subject.y;
      }

      function dragged(d) {
        d.subject.fx = d.x;
        d.subject.fy = d.y;
      }

      function dragended(d) {
        if (!d.active) simulation.alphaTarget(0);
        d.subject.fx = null;
        d.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    function tick() {
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
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    function color(d) {
      return d._children
        ? "#3182bd" // collapsed package
        : d.children
        ? "#c6dbef" // expanded package
        : "#fd8d3c"; // leaf node
    }

    // Toggle children on click.
    function click(event, t) {
      if (event.defaultPrevented) return; // ignore drag
      var hello = node._groups[0].map((ele) => ele);
      console.log(hello);
      // hello.filter((el) =>
      //   el.__data__ === t
      //     ? (el.__data__.children = t._children)
      //     : console.log("hello")
      // );
      // if (t.children !== null) {
      //   linkEnter.style("stroke", "red").style("opacity", "1");
      // } else {
      //   linkEnter.style("stroke", "#000");
      // }

      //   ==============================================================
      if (t.children) {
        // t._children = t.children;
        // t.children = null;
        collapseAll();
      } else {
        hello.forEach((el, i) => {
          console.log(el.__data__.children);
          if (el.__data__ === t) {
            el.__data__.children = t._children;
          } else {
            collapseAll();
          }
        });

        t.children = t._children;
        t._children = null;
      }
      // console.log(node.children);

      update();
    }
    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [],
        i = 0;
      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }
      recurse(root);
      return nodes;
    }
  });
  return <div ref={collapsedFLGRef}></div>;
};

export default CillapsedFLG;
