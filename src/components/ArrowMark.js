import React from "react";
import * as d3 from "d3";
import shortData from "../components/circlePackSimulation.json";
const ArrowMark = () => {
  const arrowRef = React.useRef();
  var arrowPoints = [
    [0, 0],
    [0, 20],
    [20, 10],
  ];
  var markerWidth = 10,
    refY = 10,
    refX = 10,
    markerBoxWidth = 20,
    markerBoxHeight = 20,
    markerHeight = 10;

  React.useEffect(() => {
    const svg = d3
      .select(arrowRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, 400, 200]);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", [0, 0, markerBoxWidth, markerBoxHeight])
      .attr("refX", refX)
      .attr("refY", refY)
      .attr("markerWidth", markerBoxWidth)
      .attr("markerHeight", markerBoxHeight)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", d3.line()(arrowPoints))
      .attr("stroke", "black");

    svg
      .append("path")
      .attr("d", d3.line()([[100, 60]]))
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrow)")
      .attr("fill", "none");

    return svg.node();
  });
  return <div ref={arrowRef}>ArrowMark</div>;
};

export default ArrowMark;
