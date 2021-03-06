import React from "react";
import * as d3 from "d3";
import data from "./circlePackSimulation.json";
// import { event } from "d3-selection";

const ForceSimulationWithCirclePack = () => {
  const circlePackRef = React.useRef();
  React.useEffect(() => {
    const k = 10;
    const height = 600;
    const width = 600;
    let clicked = false;
    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));
    const nodeRadiusScale = d3.scaleSqrt().domain([0, 50]).range([10, 50]);
    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return (d) => scale(d.group);
    };
    //   const color =
    //     nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(function (d, i) {
            var a = i == 0 ? -0 : -2000;
            return a;
          })
          .distanceMin(200)
          .distanceMax(1000)
      )
      .force(
        "collide",
        d3.forceCollide(function (d) {
          return nodeRadiusScale(d.value);
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3
      .select(circlePackRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      // .attr("stroke-width", (d) => Math.sqrt(d.value));
      .attr("stroke-width", (d) => console.log(d));

    link
      .append("text")
      .style("fill", "black")
      .attr("font-size", ".3em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      // .attr("dy", (d) => nodeRadiusScale(d.value) + 10)
      .text((d) => d.source.y);

    function drag(simulation) {
      function dragstarted(d) {
        if (!d.active) simulation.alphaTarget(0.3).restart();
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
    const nodeG = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation))
      .on("click", (d) => (zoom(d), d.stopPropagation()));

    nodeG
      .append("circle")
      .attr("r", (d) => nodeRadiusScale(d.value))
      .attr("fill", (d, i) => `#${i}${d.x.toString().slice(15)}`)
      .on("mouseover", addText)
      .on("mouseout", function () {
        link.style("stroke-width", 1);
      });

    nodeG
      .append("text")
      .style("fill", "black")
      .attr("font-size", ".3em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("dy", (d) => nodeRadiusScale(d.value) + 10)
      .text((d) => d.id);
    function addText(event, d) {
      console.log(d);
      svg
        .append("text")
        .attr("class", "labels")
        .attr("x", -200)
        .attr("y", -200)
        .attr("font-size", ".85em")
        //.text("hello");
        .text(d.id + d.group);
      console.log(d);
      link.style("stroke-width", function (l) {
        if (d === l.source || d === l.target) return 4;
        else return 1;
      });
      link.style("stoke", function (l) {
        if (d === l.source || d === l.target) return "green";
        else return "red";
      });
    }

    nodeG.append("g").each(function (d) {
      drawHexagons(
        d3.select(this),
        [{ key: d.id, values: d.value, pairs: d.pairs }],
        {
          width: nodeRadiusScale(d.value),
          height: nodeRadiusScale(d.value),
          nodeColor: "white",
          borderColor: "white",
          nodeTextColor: "black",
        }
      );
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeG.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    // invalidation.then(() => simulation.stop());

    function zoom(focus) {
      const transition = svg
        .transition()
        .duration(750)
        .attr("transform", function () {
          clicked = !clicked;
          if (clicked) {
            return `translate(${-(focus.x - width / 2) * k},${
              -(focus.y - height / 2) * k
            })scale(${k})`;
          } else {
            return `translate(${0},${0})})scale(1)`;
          }
        });
    }

    function getData(parentIDs, width, height) {
      var rawData = [];
      rawData.push({ id: "root" });
      parentIDs.forEach((d) => {
        rawData.push({ id: d.key, parentId: "root", size: d.values });
        d3.range(0, d.values).forEach((el) => {
          rawData.push({
            id: el,
            parentId: d.key,
            size: 1,
          });
        });
      });

      const vData = d3.stratify()(rawData);
      const vLayout = d3.pack().size([width, height]).padding(0);
      const vRoot = d3.hierarchy(vData).sum(function (d) {
        return d.data.size;
      });
      const vNodes = vLayout(vRoot);
      const data = vNodes.descendants().slice(1);

      return data;
    }

    function drawHexagons(nodeElement, parentIds, options) {
      const nodeColor = options.nodeColor;
      const borderColor = options.borderColor;
      const nodeTextColor = options.nodeTextColor;
      const width = options.width;
      const height = options.height;
      const data = getData(parentIds, width * 2, height * 2);
      //   console.log(data, parentIds[0].pairs);

      //   const nodeData = nodeElement.selectAll("g").data(data);

      const node = nodeElement.insert("g");

      const nodeData = node.selectAll("g").data(data);
      //   console.log(data);
      const nodesEnter = nodeData
        .enter()
        .append("g")
        .attr("id", (d, i) => "node-group-" + i)
        .attr("transform", (d) => `translate(${d.x - width},${d.y - height})`);

      nodesEnter
        .filter((d) => d.height === 0)
        .append("circle")
        .attr("class", "node pie")
        .attr("r", (d) => 2)
        .attr("stroke", borderColor)
        .attr("stroke-width", 1)
        .attr("fill", "white");
    }

    return svg.node();
  });
  return <div ref={circlePackRef}></div>;
};

export default ForceSimulationWithCirclePack;
