import * as d3 from "d3";

import styles from "./ForceGraph.module.css";

export function runForceGraph(
  container,
  linksData,
  nodesData,
  tlinks,
  tnodes,
  lengthing,
  setSubstituteState
) {
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;
  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function (event, d) {
        svg.attr("transform", event.transform);
      })
    );
  var link = svg.append("g").attr("class", "links"),
    node = svg.append("g").attr("class", "nodes"),
    linkEnter,
    nodeEnter;
  const upDate = (defaultlinks, defaultNodes) => {
    const links = defaultlinks.map((d) => Object.assign({}, d));

    const nodes = defaultNodes.map((d) => Object.assign({}, d));

    const setUpdateNodeData = (e) => {
      console.log(e);
      setSubstituteState(e.substituteData);
      let refLink = linksData;
      let refNode = nodesData;
      let jk = [];
      let linksPlaceholder = [];

      for (let i = 0; i < tlinks.length; i++) {
        if (e.id === 1) return;
        if (e.id === tlinks[i].source) {
          // refNode = nodesData;
          // console.log(refLink);

          if (!refLink.includes(tlinks[i])) {
            linksPlaceholder.push(tlinks[i]);

            jk.push(tnodes[tlinks[i].target - 1]);
          } else {
            const linkIndex = refLink.indexOf(tlinks[i]);
            refLink.splice(linkIndex, 1);
            const nodeIndex = refNode.indexOf(tnodes[tlinks[i].target - 1]);

            // console.log(nodeIndex);
            refNode.splice(nodeIndex, 1);
          }
        } else {
          if (e.id !== tlinks[i].source) {
          }
        }
      }
      // console.log(linksPlaceholder);
      if (refLink.length === lengthing) {
        refLink.push(...linksPlaceholder);
      } else {
        refLink = [];
        const filterLinks = linksData.filter((el) => el.source === 1);
        refLink.push(...filterLinks, ...linksPlaceholder);
        console.log(filterLinks);

        // refLink.push(...filterLinks, tlinks[i]);
      }

      // console.log(jk);
      // console.log(nodesData);
      if (nodesData === 6) {
        refNode.push(...jk);
      } else {
        refNode = [];
        const refupdateNodes = tnodes.filter((el) => el.id <= 6);
        console.log(refupdateNodes);
        refNode.push(...refupdateNodes, ...jk);
      }

      console.log(refLink);
      console.log(refNode);
      upDate(refLink, refNode);
    };

    const color = () => {
      return "#9D79A0";
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // link = svg
    //   .append('g')
    //   .attr('stroke', '#999')
    //   .attr('stroke-opacity', 0.6)
    //   .selectAll('line')
    //   .data(links)
    //   .join('line')
    //   .attr('stroke-width', (d) => Math.sqrt(d.value));

    // node = svg
    //   .append('g')
    //   .attr('stroke', '#fff')
    //   .attr('stroke-width', 2)
    //   .selectAll('circle')
    //   .data(nodes)
    //   .join('circle')
    //   .attr('r', 12)
    //   .attr('fill', color)
    //   .on('click', (e, d) => {
    //     setUpdateNodeData(d);
    //   });

    link = svg
      .select(".links")
      .selectAll(".link")
      .data(links, function (d) {
        return d;
      });

    link.exit().remove();

    linkEnter = link
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "black")
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
      .on("click", (e, d) => {
        setUpdateNodeData(d);
      });

    nodeEnter
      .append("circle")
      .attr("r", 10)
      // .attr('cx', -40)
      .attr("fill-opacity", ".25")
      .attr("fill", "#e8fadc")
      .style("stroke", "#8ee556");

    node = nodeEnter.merge(node);

    simulation.on("tick", () => {
      //update link positions
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // update node positions
      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
    return {
      destroy: () => {
        simulation.stop();
      },
      nodes: () => {
        return svg.node();
      },
    };
  };

  upDate(linksData, nodesData);

  return upDate;
}
