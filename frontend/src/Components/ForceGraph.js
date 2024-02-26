import { useD3 } from "../useD3";
import React, { useEffect, useState, useMemo } from "react";
import { useProgramContext } from "../hooks/useProgramContext"
import * as d3 from "d3";
import temp from "../data.json";
import Info from "./Info";
import "../output.css";
var data = temp;
function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const fetchData = async () => {
  const response = await fetch('/api/data')
  const json = await response.json()
  if(response.ok) {
    console.log(json.data);
    data = json.data;
  }
  else {
    console.log("Error fetching data")
  }
}

const ForceGraph = () => {
  const {program, dispatch} = useProgramContext()

  useMemo(()=>{
    fetchData() //Doesn't want until render is completed 
  } , [])

  useEffect(() => {
      fetchProgram("Computer Science (CSE)");
  }, [])

  const fetchProgram = async (name) => {
    const response = await fetch(`/api/programs/${name}`)
    const json = await response.json()
    if (response.ok) {
        if(label) {
          label.remove();
        }
        dispatch({type: 'SET_PROGRAM', payload: json["0"]})
        if(program) {
          console.log("fetch success");
        }
    }
}




  const width = 1600; // outer width, in pixels
  const height = 800; // outer height, in pixels
  let nodes = data.nodes;

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

  function wrap(text, width, links) {
    text.each(function (d) {
      var font = 0;
      var linkItem = links.find(function (link) {
        return link.target == d.id || link.target.id == d.id;
      });
      if (linkItem) {
        width = linkItem.value * radiusMultiplier;
        font = linkItem.value * 6;
      }
      else {
        font = 36;
        width = centerNodeSize;
      }
      
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("y", y).attr("dy", dy + "em");
        var prev = 0;
        var lines = 0;
        tspan.text("hello")
        const h = tspan.node().getBBox().height;
        var first = true;
        var firstElem;
        var max = 0;
        while (word = words.pop()) {
          lines++;
          tspan.text(word)
          var current = tspan.node().getComputedTextLength();
          if(current > max) {
            max = current;
          }
          if(first) {
            firstElem = tspan;
            tspan.attr("dx", -current / 2);
            first = false;
          } else {
            tspan.attr("dx", -prev / 2 - current / 2);
          }
          
          tspan = text.append("tspan").attr("dy", h)
          prev = current;
        }
        firstElem.attr("dx", -max / 2);
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

  const ref = useD3((svg) => {
    var links = createLinks(data["Computer Science (CSE)"]);
    if(program) {
        links = createLinks(data[program.name])
    }
    
    console.log("From the top")
    const nodeId = (d) => d.id;
    N = d3.map(nodes, nodeId).map(intern);
    const nodeGroup = (d) => d.group;
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const colors = d3.schemeTableau10; // an array of color strings, for the node groups

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    //default
    console.log(nodes);
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
      .attr("id", function(d) { return "node_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""); })
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
      .on("click", click)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
    
    label = svg.selectAll(".mytext")
      .data(nodes)
      .enter()
      .append("text")
      .attr("id", function(d) { return "text_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""); })
      .text(function (d) { return d.id; })
      .style("text-anchor", "left") //middle
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
      .call(wrap, 25, links);

    svg.node();
    
    function mouseover(event, d) {
      var elem = d3.select("#text_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""))
      if(Number(elem.style("font-size").replace("px", "")) < 12){
        svg.append("text")
        .text(elem.text())
        .attr("id", "large_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""))
        .attr("x", elem.attr("x"))
        .attr("y", elem.attr("y"))
        .style("text-anchor", "middle") //middle
        .style("fill", "#000000")
        .style("font-family", "Arial")
        .style("font-size", 36)
      }
    }

    function mouseout(event, d) {
      var elem = d3.select("#large_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""))
      if(elem) {
        elem.remove();
      }
    }


    for (var i in nodes) {
        if(program && nodes[i].id == program.name){
          nodes[i].fx = width / 2;
          nodes[i].fy = height / 2;
        }
    }

    function click(event, d) {
      //label.remove();
      console.log("Fetching: " + d.id)
      fetchProgram(d.id)
    }

    console.log("This executes");
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
        //console.log("index: ", i);
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

  return (
    <div className="flex bg-[#D3D3D3] absolute top-[10vh] bottom-[10vh] m-5 rounded-2xl">
      <div className="w-1/4 p-5">
        <Info fetchProgram={fetchProgram} />
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
