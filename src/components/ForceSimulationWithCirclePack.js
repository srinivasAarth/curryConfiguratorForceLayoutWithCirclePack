import React from "react";
import * as d3 from "d3";
import data from "./circlePackSimulation.json";
// import { event } from "d3-selection";
import "../App.css";

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
    var colorArray = [
      "#651fff",
      "#69b3a2",

      "#f28c1c",
      "#e56969",
      "#5ac58a",
      "#651fff",
      "#c51263",
    ];
    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return (d) => scale(d.group);
    };
    //   const color =
    //     nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    const text = (links) => {
      // console.log(links);
    };
    text(links);

    const simulation = d3
      .forceSimulation(nodes)
      // .force("x", d3.forceX(width / 2).strength(0.4))
      // .force("y", d3.forceY(height / 2).strength(0.6))

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

    const linkss = svg
      .append("g")
      .selectAll("g")
      .data(links)
      .join("g")
      .attr("class", "link")

      .attr("class", "link-line")

      .attr("stroke-opacity", 1)
      .append("line")
      .attr("stroke", "black")
      .style("opacity", ".1")
      .attr("stroke-width", (d) => Math.sqrt(d.value));
    const linkText = svg
      .selectAll(".link-line")
      .append("text")
      .attr("class", "link-label")
      .attr("fill", "Black")
      .attr("dy", 5)
      // .attr("startOffset", "20%")
      .attr("text-anchor", "middle")
      .attr("font-size", ".3em")
      .attr("alignment-baseline", "middle")
      .attr("dy", (d) => nodeRadiusScale(d.value) - 24)

      // .style("filter", "red")
      .text(function (d, i) {
        return `Link-${i}`;
      });
    // .selectAll("line")
    // .data(links)

    // link.append("line").attr("stroke-width", (d) => console.log(d));

    // =============================text to links============================

    // linkss.append("line").attr("stroke", "#999").attr("stroke-opacity", 0.6);
    //

    // link
    //   .append("text")
    //   .style("fill", "black")
    //   .attr("font-size", ".3em")
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    // .attr("dy", (d) => nodeRadiusScale(d.value) + 10)
    // .text((d) => d.source.y);

    // linkss.append("line");
    //   .attr("stroke", "#999")
    //   .attr("stroke-opacity", 0.6)
    //   .attr("stroke-width", 10);

    // ====================================edge paths================================

    // edgelabels
    //   .append("textPath")
    //   .attr("xlink:href", function (d, i) {
    //     return "#edgepath" + i;
    //   })
    //   .style("text-anchor", "middle")
    //   .style("pointer-events", "none")
    //   .attr("startOffset", "50%")
    //   .text(function (d) {
    //     return "donnn";
    //   });

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
      // .attr("fill", (d, i) => `#${i}${d.x.toString().slice(15)}`)
      .attr("fill", (d, i) => {
        return colorArray[i];
      })
      .on("mouseover", addText)
      .on("mouseout", function () {
        linkss.style("stroke-width", 1);
      });

    nodeG
      .append("text")
      .style("fill", "black")
      .attr("font-size", ".3em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("dy", (d) => nodeRadiusScale(d.value) + 5)
      .text((d) => d.id);
    function addText(event, d) {
      // console.log(d);
      svg
        .append("text")
        .attr("class", "labels")
        .attr("x", -200)
        .attr("y", -200)
        .attr("font-size", ".85em")
        //.text("hello");
        .text(d.id + d.group);
      // console.log(d);
      linkss.style("stroke-width", function (l) {
        if (d === l.source || d === l.target) return 1;
        else return 1;
      });
      linkss.style("opacity", function (l) {
        if (d === l.source || d === l.target) return "1";
        else return ".1";
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
      linkss
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeG.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      // linkText
      //   .attr("x", function (d) {
      //     return (d.source.x + d.target.x) / 2;
      //   })
      //   .attr("y", function (d) {
      //     return (d.source.y + d.target.y) / 2;
      //   });
      linkText.attr("transform", function (d) {
        //calcul de l'angle du label
        var angle =
          (Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) *
            180) /
          Math.PI;
        return (
          "translate(" +
          [(d.source.x + d.target.x) / 2, (d.source.y + d.target.y) / 2] +
          ")rotate(" +
          angle +
          ")"
        );
      });
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
