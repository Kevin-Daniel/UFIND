import { useD3 } from "./useD3";
import React from "react";
import * as d3 from "d3";
import data from "./miserables";

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const ForceGraph = () => {
  const width = 800; // outer width, in pixels
  const height = 450; // outer height, in pixels
  let nodes = data.nodes;
  let links = data.links;
  let links2 = data.links2;

  const ref = useD3((svg) => {
    const nodeId = (d) => d.id;
    const linkSource = ({ source }) => source; // given d in links, returns a node identifier string
    const linkTarget = ({ target }) => target; // given d in links, returns a node identifier string
    const linkValue = ({ value }) => value;
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue).map(intern);
    const nodeGroup = (d) => d.group;
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const colors = d3.schemeTableau10; // an array of color strings, for the node groups

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(data.links, (_, i) => ({
      source: LS[i],
      target: LT[i],
      value: LV[i]
    }));

    //2
    /*const linkSource2 = ({ source }) => source; // given d in links, returns a node identifier string
    const linkTarget2 = ({ target }) => target; // given d in links, returns a node identifier string
    const LS2 = d3.map(links2, linkSource2).map(intern);
    const LT2 = d3.map(links2, linkTarget2).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    links2 = d3.map(data.links2, (_, i) => ({
      source: LS2[i],
      target: LT2[i]
    }));*/

    function createLinks(linkdata) {
      const linkSource2 = ({ source }) => source; // given d in links, returns a node identifier string
      const linkTarget2 = ({ target }) => target; // given d in links, returns a node identifier string
      const LS2 = d3.map(linkdata, linkSource2).map(intern);
      const LT2 = d3.map(linkdata, linkTarget2).map(intern);
  
      // Replace the input nodes and links with mutable objects for the simulation.
      let result = d3.map(linkdata, (_, i) => ({
        source: LS2[i],
        target: LT2[i]
      }));

      return result;
    }

    console.log("links: ", links);
    console.log("links2: ", links2);
    console.log("nodes: ", nodes);

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "background-color: lightgray");

    const link = svg
      .selectAll(".link")
      .data(links)
      .join("line")
      .classed("link", true);

    const node = svg
      .selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("r", function(dat, index, n) { 
        var linkItem = links.find(function(link) {
          return link.target == dat.id;
      });
      if(linkItem){
        console.log(linkItem);
        console.log("value " + linkItem.value);
        return linkItem.value;
      }
      else {
        return 50;
      }
    })
      .classed("node", true)
      .classed("fixed", (d) => d.fx !== undefined)
      .on("click", click);

    const label = svg.selectAll(".mytext")
        .data(nodes)
        .enter()
        .append("text")
        .text(function (d) { return d.id; })
        .style("text-anchor", "middle")
        .style("fill", "#000000")
        .style("font-family", "Arial")
        .style("font-size", 12);

    svg.node();

    function switchLinks(linkdata) {
      var processed_link = createLinks(linkdata);
      link.data(processed_link);
      forceLink = d3.forceLink(linkdata).id(({ index: i }) => N[i]);
      simulation.force("link", forceLink.distance(function(d) {return 1 / d.value * 2000;}));
    }

    function linkDistance(d) {
      console.log('distance: ', d.distance)
      return d.distance;
    }
  
    var init = true;
    var previous;
    function click(event, d) {
      d.fx = width / 2;
      d.fy = height / 2;
      switchLinks(init ? data.links2 : data.links);
      if(previous != null) {
        previous.fx = null;
        previous.fy = null;
      }
      previous = d;
      init = !init;
      //clicked = d;
      //simulation.alphaTarget(0)
      
      //d.fx = clamp(width / 2, 0, width);
     // d.fy = clamp(height / 2, 0, height);
     // d.fx = width / 2;
      //d.fy = height / 2;
      simulation.alpha(1).restart();
    }

    /*     const simulation = d3
      .forceSimulation()
      .nodes(nodes)
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      //.force("link", d3.forceLink(links))
      .force("link", d3.forceLink(links))
      .on("tick", tick); */

    // Construct the scales.
    let nodeGroups = d3.sort(G);
    console.log(nodeGroups);
    const color =
      nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    var forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);

    var simulation = d3
      .forceSimulation(nodes)
      .force("link", forceLink.distance(200))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", tick);

    if (G)
      node.attr("fill", ({ index: i }) => {
        console.log("index: ", i);
        return color(G[i]);
      });

    const drag = d3
      .drag()
      .on("start", dragstart)
      .on("drag", dragged)
      .on("end", dragend);

    node.call(drag);

    function tick() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y - 10);
    }

    function intern(value) {
      return value !== null && typeof value === "object"
        ? value.valueOf()
        : value;
    }

    function dragstart() {
      d3.select(this).classed("fixed", true);
    }

    function dragend(event, d) {
      if (event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
      simulation.alpha(1).restart();
    }
  });

  return (
    <svg
      ref={ref}
      style={{
        marginRight: "0px",
        marginLeft: "0px",
        backgroundColor: "green"
      }}
    >
      <text x="5" y="20">
        Prototype
      </text>
      <text x="5" y="40">
        {`${width}x${height}`}
      </text>
    </svg>
  );
};

export default ForceGraph;
