import { useD3 } from "../useD3";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import data from "../data.json";
import Info from "./Info";
import "../output.css";

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const ForceGraph = () => {
  //const [program, setProgram] = useState("Computer Science")

  const width = 1600; // outer width, in pixels
  const height = 800; // outer height, in pixels
  let nodes = data.nodes;
  let links = data.links;

  const centerNodeSize = 100;
  const radiusMultiplier = 15;
  const distanceMultiplier = 50;

  var node;
  var label;
  var link;
  var forceLink;
  var simulation;
  var N;
  var previous;

  // https://gist.github.com/mbostock/7555321
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dx = parseFloat(text.attr("dx")),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", dx).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", dx).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  function wrap2(text, width) {
    text.each(function () {
      console.log("XXX: " + d3.select(this.parentNode.parentNode.parentNode).attr("x"))
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        var prev = 0;
        if (tspan.node().getComputedTextLength() > width) {
          var next = tspan.node().getComputedTextLength();
          console.log("next: " + next)
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("dx", -next / 2).attr("y", y).attr("dy", ++lineNumber * lineHeight + "em").text(word);
          prev = next;
        }
      }
    });
  }

  function createLinks(linkdata) {
    var linkSource = ({ source }) => source; // given d in links, returns a node identifier string
    var linkTarget = ({ target }) => target; // given d in links, returns a node identifier string
    var linkValue = ({ value }) => value;
    var LS = d3.map(linkdata, linkSource).map(intern);
    var LT = d3.map(linkdata, linkTarget).map(intern);
    var LV = d3.map(linkdata, linkValue).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    let result = d3.map(linkdata, (_, i) => ({
      source: LS[i],
      target: LT[i],
      value: LV[i]
    }));

    return result;
  }

  function intern(value) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function switchLinks(linkdata) {
    links = createLinks(linkdata);
    node.attr("r", function (dat, index, n) {
      var linkItem = links.find(function (link) {
        return link.target == dat.id || link.target.id == dat.id;
      });
      if (linkItem) {
        return linkItem.value * radiusMultiplier;
      } else {
        return centerNodeSize;
      }
    })
    label.style("font-size", function (d) {
      var linkItem = links.find(function (link) {
        return link.target == d.id || link.target.id == d.id;
      });
      if (linkItem) {
        return linkItem.value * 6;
      }
      else {
        return 36;
      }
    })
    link.data(links);
    forceLink = d3.forceLink(linkdata).id(({ index: i }) => N[i]);
    simulation.force("link", forceLink.distance(function (d) { return (10 - d.value) * distanceMultiplier; }));
  }

  

  const ref = useD3((svg) => {
    const nodeId = (d) => d.id;
    N = d3.map(nodes, nodeId).map(intern);
    const nodeGroup = (d) => d.group;
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const colors = d3.schemeTableau10; // an array of color strings, for the node groups

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    links = createLinks(data["Computer Science"]); //default

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "background-color: lightgray");

    link = svg
      .selectAll(".link")
      .data(links)
      //.join("line")
      .classed("link", true);

    node = svg
      .selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("r", function (dat, index, n) {
        var linkItem = links.find(function (link) {
          return link.target == dat.id || link.target.id == dat.id;
        });
        if (linkItem) {
          return linkItem.value * radiusMultiplier;
        }
        else {
          return centerNodeSize;
        }
      })
      .classed("node", true)
      .classed("fixed", (d) => d.fx !== undefined)
      .on("click", click);

    label = svg.selectAll(".mytext")
      .data(nodes)
      .enter()
      .append("text")
      .text(function (d) { return d.id; })
      .style("text-anchor", "middle")
      .style("fill", "#000000")
      .style("font-family", "Arial")
      .style("font-size", function (d) {
        var linkItem = links.find(function (link) {
          return link.target == d.id || link.target.id == d.id;
        });
        if (linkItem) {
          return linkItem.value * 6;
        }
        else {
          return 36;
        }
      })
    //.call(wrap2, 100);

    svg.node();


    function click(event, d) {
      d.fx = width / 2;
      d.fy = height / 2;
      switchLinks(data[d.id])
      if (previous != null) {
        previous.fx = null;
        previous.fy = null;
      }
      previous = d;
      simulation.alpha(1).restart();
    }

    // Construct the scales.
    let nodeGroups = d3.sort(G);
    console.log(nodeGroups);
    const color =
      nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);

    simulation = d3
      .forceSimulation(nodes)
      .force("link", forceLink.distance(function (d) { return (10 - d.value) * distanceMultiplier; }))
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
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
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

  const test = (programName) => {
    var nodeItem = nodes.find(function (littleN) {
      return littleN.id == programName;
    })

    nodeItem.fx = width / 2;
    nodeItem.fy = height / 2;

    switchLinks(data[programName]);
    if (previous != null) {
      previous.fx = null;
      previous.fy = null;
    }
    previous = nodeItem;
    simulation.alpha(1).restart();
  }

  return (
    <div className="flex bg-[#D3D3D3] absolute top-[10vh] bottom-[10vh] m-5 rounded-2xl">
      <div className="w-1/4 p-5">
        <Info doIt={test} />
      </div>
      <svg
        ref={ref}
        style={{
          marginRight: "0px",
          marginLeft: "0px",
          backgroundColor: "green"
        }}
      >
        <text x="5" y="40">
          {`${width}x${height}`}
        </text>
      </svg>
    </div>
  );
};

export default ForceGraph;
