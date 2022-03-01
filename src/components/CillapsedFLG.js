/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import React from "react";
import { data } from "../components/CollapsedFGLData";
import * as d3 from "d3";
import mySubsitutionImage from "../asserts/substitutionSvg.svg";
import shiffleImage from "../asserts/shiffleIcons.svg";
import nodeImage from "../asserts/recipe node.svg";
import "../App.css";
import react from "react";
const CillapsedFLG = () => {
  // console.log(data);
  const collapsedFLGRef = React.useRef(null);
  const dataRef = React.useRef({ bool: false });
  const [getData, setGetData] = React.useState([]);
  // const [changeData, setChangeData] = React.useState(data);
  // console.log(changeData);

  React.useEffect(() => {
    var width = 1200,
      height = 700,
      root,
      links,
      nodes,
      substitutionsArray = {};

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
    // var link = svg.selectAll(".link"),
    //   node = svg.selectAll(".node");
    var link = svg.append("g").attr("class", "links"),
      node = svg.append("g").attr("class", "nodes");
    root = d3.hierarchy(data);
    function collapse(d) {
      // console.log(d);
      if (d.children) {
        d._children = d.children;

        d._children.forEach(collapse);

        d.children = null;
      }
    }
    function collapseAll(dd) {
      dd.children.forEach(collapse);
      // console.log(dd);
      update(dd);
    }
    update(root);
    collapseAll(root);
    var nodeEnter, linkEnter;

    function update(graphData) {
      nodes = flatten(graphData);
      links = graphData.links();
      console.log(nodes);
      link = svg
        .select(".links")
        .selectAll(".link")
        .data(links, function (d) {
          return d;
        });

      link.exit().remove();

      var linksColor = d3.scaleOrdinal(d3.schemeTableau10);

      linkEnter = link
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", (d, i) => {
          return d.source.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes1"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes3"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes4"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes5"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes6"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes7"
            ? linksColor(i)
            : d.source.data.linkType === "subNodes8"
            ? linksColor(i)
            : "black";
        })
        .style("opacity", "0.2")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5"); //dashed array for line

      link = linkEnter.merge(link);

      node = svg
        .select(".nodes")
        .selectAll(".node")
        .data(nodes, function (d) {
          return d.id;
        });

      node.exit().remove();

      nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("stroke", "#666")
        .attr("stroke-width", 2)
        // .style("fill", color)
        .style("opacity", 1)
        .on("click", click)
        .raise()
        .on("mouseover", addText)
        .call(drag(simulation))
        .on("mouseout", function () {
          link.style("opacity", "1");
        });
      function addText(event, d) {
        // console.log(d);

        link.style("opacity", function (l) {
          if (d === l.source || d === l.target) return "1";
          else return "1";
        });
      }
      // console.log(links.length);
      const centerNode = nodeEnter.filter((d, i) => i === links.length);

      centerNode
        .append("svg:image")
        .attr("xlink:href", nodeImage)
        .attr("x", "-40")
        .attr("y", "-40")
        .attr("width", "70")
        .attr("height", "70");

      const childNodes = nodeEnter.filter((d, i) => i !== links.length);
      childNodes
        .append("rect")
        .attr("height", "35px")
        .attr("width", "100px")
        .attr("fill", "white")
        .attr("x", "-57px")
        .attr("y", "-17.5px")
        .attr("rx", "18px")
        .style("stroke", (d, i) => {
          return d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes1"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes3"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes4"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes5"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes6"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes7"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes8"
            ? linksColor(i)
            : "#8ee556";
        })
        .style("stroke-width", 1);

      childNodes
        .append("circle")
        .attr("r", 17)
        .attr("cx", -40)
        // .attr("fill", "#e8fadc")
        .attr("fill", (d, i) => {
          return d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes1"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes3"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes4"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes5"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes6"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes7"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes8"
            ? linksColor(i)
            : "#8ee556";
        })
        .attr("fill-opacity", ".25")
        .style("stroke", "#8ee556")
        .style("stroke", (d, i) => {
          // console.log(d.parent.data.linkType);
          return d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes1"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes2"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes3"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes4"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes5"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes6"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes7"
            ? linksColor(i)
            : d.parent.data.linkType === "subNodes8"
            ? linksColor(i)
            : "#8ee556";
        })
        .style("stroke-width", 1);

      childNodes
        .append("text")
        .style("fill", "black")
        .style("font-weight", "100")
        .attr("class", "fontFormat")

        .attr("font-size", ".8em")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", -6)
        .attr("dx", 10)
        .text((d, i) => d.data.name);

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
        .attr("x", "-47")
        .attr("y", "-7")
        .attr("width", "15")
        .attr("height", "15");
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

    function click(event, t) {
      console.log(t);
      if (t.children) {
        if (t.index === nodes.length - 1) return collapseAll(root);
        else {
          t._children = t.children;
          t.children = null;
          collapseAll(root);
        }
      } else {
        t.children = t._children;
        t._children = null;
        if (t.data.substituteData) {
          substitutionsArray = t.data.substituteData;
          const hello = substitutionsArray.map((el, i) => (
            <button key={el.sub} onClick={() => substitutionFunction(el, t)}>
              {el.sub}
            </button>
          ));
          setGetData(hello);
        }

        closeSiblings(t);
      }
      update(root);
    }
    function closeSiblings(d) {
      d.index === nodes.length && collapseAll(root);
      if (!d.parent) return; // root case
      d.parent.children.forEach(function (d1) {
        if (d1 === d || !d1.children) return;

        d1._children = d1.children;
        d1.children = null;
        update(root);
      });
    }
    const substitutionFunction = (e, t) => {
      const i = data.children.indexOf(t.data);
      data.children[i].name = e.sub;

      const tree = d3.hierarchy(data);
      simulation.alphaTarget(1).restart();
      // closeSiblings();
      collapseAll(tree);
      t.parent.children.forEach(function (d1) {
        if (d1 === t || !d1.children) return collapse(d1);
      });
    };

    function flatten(refData) {
      var nodes = [],
        i = 0;
      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }
      recurse(refData);
      return nodes;
    }
  }, []);
  // console.log(getData);
  return (
    <>
      <div ref={collapsedFLGRef}></div>
      <div ref={dataRef}>{getData}</div>
    </>
  );
};

export default CillapsedFLG;
