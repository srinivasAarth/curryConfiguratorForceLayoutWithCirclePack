/* eslint-disable no-useless-concat */
/* eslint-disable no-undef */
import "../App.css";
import * as d3 from "d3";
import React from "react";
// import { ForceGraph } from "@b3a26c8d64d1450e/force-directed-graph/2";
import shortData from "../components/circlePackSimulation.json";
import mySubsitutionImage from "../asserts/substitutionSvg.svg";
import shiffleImage from "../asserts/shiffleIcons.svg";
import nodeImage from "../asserts/recipe node.svg";
// import invalidation from "d3";

function AppendSvgNode() {
  var myRef = React.useRef(null);
  React.useEffect(() => {
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/force-directed-graph
    // ForceGraph();
    ForceGraph(shortData, {
      nodeId: (d) => d.id,
      nodeGroup: (d) => d.group,
      nodeTitle: (d) => `${d.id}\n${d.group}`,
      linkStrokeWidth: (l) => Math.sqrt(l.value),
      width: 1000,
      height: 600,
      // a promise to stop the simulation when the cell is re-run
    });

    function ForceGraph(
      {
        nodes, // an iterable of node objects (typically [{id}, …])
        links, // an iterable of link objects (typically [{source, target}, …])
      },
      {
        nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "green", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 1.5, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 10, // node radius, in pixels
        nodeStrength,
        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkStroke = "#999", // link stroke color
        linkStrokeOpacity = 0.6, // link stroke opacity
        linkStrokeWidth = 10, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation, // when this promise resolves, stop the simulation
      } = {}
    ) {
      // Compute values.
      console.log(nodes);
      console.log(links);
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
      const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W =
        typeof linkStrokeWidth !== "function"
          ? null
          : d3.map(links, linkStrokeWidth);

      // Replace the input nodes and links with mutable objects for the simulation.
      nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color =
        nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

      const forceNode = d3
        .forceManyBody()
        .strength(function (d, i) {
          var a = i === 0 ? -10000 : -6000;
          return a;
        })
        .distanceMin(0)
        .distanceMax(4000);
      const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkStrength);

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())

        .on("tick", ticked);

      const svg = d3
        .select(myRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100vw;  height: intrinsic; color , green");
      // .attr("style", );

      const link = svg
        .append("g")
        .attr("stroke", "black")
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", 1)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .attr("line-width", 2)
        .data(links)
        .join("line");

      const node = svg

        .append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")

        .attr("class", (d, i) =>
          i === 0 ? `imgClass${i}`.toString() : "imgClassing"
        )

        .on("mouseover", addText)
        .on("mouseleave", removeText)
        .on("mouseout", function () {
          link.style("stroke-width", 1);
        })
        .call(drag(simulation));
      // center circle
      svg
        .selectAll(".imgClass0")
        .append("circle")
        .attr("r", 40)
        .attr("fill", "white")
        .attr("stroke", "#f5b56e")
        .style("stroke-width", 1.5);
      // rectangle for nodes
      svg
        .selectAll(".imgClassing")
        .append("rect")

        .attr("height", "40px")
        .attr("width", "130px")
        .attr("fill", "white")
        .attr("x", "-60px")
        .attr("y", "-20px")
        .attr("rx", "20px")
        .style("stroke", "#8ee556")
        .style("stroke-width", 2);
      // append circles in rectangle node
      svg
        .selectAll(".imgClassing")
        .append("circle")
        .attr("r", 20)
        .attr("cx", -40)
        .attr("fill", "#e8fadc")
        .style("stroke", "#8ee556")
        .style("stroke-width", 2);
      // bold text in rectangle node
      svg
        .selectAll(".imgClassing")
        .append("text")
        .style("fill", "black")
        .style("font-weight", "bolder")
        .style("font-family", "Roboto, sans-serif")
        .attr("font-size", ".5em")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", -6)
        .attr("dx", 10)
        .text((d) => d.id);
      // light text in rectangle node
      svg
        .selectAll(".imgClassing")
        .append("text")
        .style("fill", "gray")
        .style("font-weight", "bolder")
        // .style("color", "red")
        .style("font-family", "Roboto, sans-serif")
        .style("text-align", "left")
        .attr("font-size", ".4em")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", 4)
        .attr("dx", 10)
        .text((d, i) => `${i * 10}`.toString() + " " + "gms");
      // append circle for substitution
      svg
        .selectAll(".imgClassing")
        .append("circle")
        .attr("r", 9)
        .attr("cx", 60)
        .attr("cy", -20)
        .attr("fill", "#cbcbcb")
        .style("stroke", "rgba(0, 0, 0, 0.803)")
        .style("stroke-width", 1.5);
      // append svg images to the bigger circles
      svg
        .selectAll(".imgClassing")
        .append("svg:image")
        .attr("xlink:href", mySubsitutionImage)
        .attr("x", "-50")
        .attr("y", "-10")
        .attr("width", "20")
        .attr("height", "20");
      // append substitution shiffle icons to the small icons

      svg
        .selectAll(".imgClassing")
        .append("svg:image")
        .attr("xlink:href", shiffleImage)
        .attr("x", "37.4")
        .attr("y", "-42.5")
        .attr("width", "45")
        .attr("height", "45");
      // append node svg to the center one circle
      svg
        .selectAll(".imgClass0")
        .append("svg:image")
        .attr("xlink:href", nodeImage)
        .attr("x", "-40")
        .attr("y", "-40")
        .attr("width", "80")
        .attr("height", "80");
      function addText(event, d) {
        console.log(d);
        svg
          .append("text")
          .attr("class", "labels")
          .attr("x", -200)
          .attr("y", -200)
          .attr("font-size", ".85em")
          //.text("hello");
          .text(d.id);
        console.log(d);
        link.style("stroke-width", function (l) {
          if (d === l.source || d === l.target) return 4;
          else return 1;
        });
        link.style("fill", function (l) {
          if (d === l.source || d === l.target) return "green";
          else return "red";
        });
      }

      function removeText(event, d) {
        d3.selectAll("text.labels").remove();
      }

      if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      if (G) node.attr("fill", ({ index: i }) => color(G[i]));
      if (T) node.append("title").text(({ index: i }) => T[i]);
      if (invalidation != null) invalidation.then(() => simulation.stop());

      function intern(value) {
        return value !== null && typeof value === "object"
          ? value.valueOf()
          : value;
      }

      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      }

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      return Object.assign(svg.node(), { scales: { color } });
    }
  });
  return <div ref={myRef} className="App"></div>;
}

export default AppendSvgNode;
