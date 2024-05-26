import { useD3 } from "../useD3";
import React, { useEffect, useState, useMemo } from "react";
import { useProgramContext } from "../hooks/useProgramContext"
import * as d3 from "d3";
import defaultData from "../data.json";
import InteractionPanel from "./InteractionPanel";
import "../output.css";
import { useAuthContext } from '../hooks/useAuthContext';

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const ForceGraph = () => {
  const { user } = useAuthContext();
  const { program, dispatch } = useProgramContext()
  const [data, setData] = useState(defaultData);

  const fetchData = async () => {
    const response = await fetch('/api/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json()
    if (response.ok) {
      setData(json.data);
      dispatch({ type: 'SET_PROGRAM', payload: program })
    }
    else {
      console.log("Error fetching data");
    }
  }

  const fetchProgram = async (name) => {
    const response = await fetch(`/api/programs/${name}`)
    const json = await response.json()
    if (response.ok) {
      if (label) {
        label.remove();
      }
      dispatch({ type: 'SET_PROGRAM', payload: json["0"] })
    } else if (user && name == user.name) { //user having name of major?
      var core;
      var critical_tracking;
      const response2 = await fetch('/api/userCourses/fetch', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json2 = await response2.json();

      if (!response2.ok) {
        core = ['Error fetching courses'];
        critical_tracking = ['Error fetching courses'];
      } else {
        core = json2[0].core;
        critical_tracking = json2[0].critical_tracking;
      }

      dispatch({ type: 'SET_PROGRAM', payload: { name: user.name, critical_tracking, core } })
    }
  }

  useMemo(() => {
    if (user) {
      fetchData();
      fetchProgram(user.name);
    } else {
      //data = defaultData;
      setData(defaultData);
    }
  }, [user])

  useEffect(() => {
    fetchProgram("Computer Science (CSE)");
  }, [])

  const width = window.innerWidth * 3 / 4;
  const height = window.innerHeight * 4 / 5 - 20;
  let nodes = data.nodes;

  const centerNodeSize = 100;

  var node;
  var label;
  var link;
  var forceLink;
  var simulation;
  var N;
  var previous;

  const fonts = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
  function getFont(weight) {
    return fonts[weight - 1];
  }
  //const distances = [371, 361, 349, 334, 317, 297, 285, 260, 230, 180];
  //const distances = [361, 351, 339, 324, 307, 287, 275, 250, 220, 180];
  const distances = [361, 351, 339, 324, 307, 287, 275, 250, 220, 180];
  function distance(weight) {
    return distances[weight - 1];
  }

  const radiis = [20, 25, 30, 35, 40, 45, 50, 55, 60, 70];
  function radius(weight) {
    return radiis[weight - 1];
  }

  const colors = ["#4e79a7", "#C35430", "#E7CC3D", "#78532F", "#B5AD89", "#758747", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];
  const collegeNames = ["You", "Herbert Wertheim College of Engineering", "College of Liberal Arts and Sciences", "College of the Arts", "Heavener School of Business", "College of Health and Human Performance"];

  function wrap(text, width, links) {
    text.each(function (d) {
      var font = 0;
      var linkItem = links.find(function (link) {
        return link.target == d.id || link.target.id == d.id;
      });
      if (linkItem) {
        width = radius(linkItem.value);

        let multiplier = 5;
        if (d.id.split(" ").length > 4) {
          multiplier--;
        }
        font = getFont(linkItem.value);
      }
      else {
        font = 36;
        width = centerNodeSize;
      }
      width = width * 2 - 5;
    
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0,
        tspan = text.text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em")
          .attr("id", "temp");

      if (words.length > 4) {
        font = font * 2 / 3;
      } else if (words.length >= 3) {
        font = font * 7 / 8;
      }
      for(let i = 0; i < words.length; i++){
        if(words[i].length > 8){
          console.log("downsize");
          font = font * 6 / 7;
          break;
        }
      }
      text.style("font-size", font);
      var h = 0;
      while (word = words.pop()) {
        line.push(word);
        var w = tspan.node().getBBox().width;
        h = h == 0 ? tspan.node().getBBox().height : h;
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", lineHeight + dy + "em")
            .attr("dx", -w)
            .text(word);
          lineNumber++;
        }
      }

      text.attr("transform", `translate(0, ${-tspan.node().getBBox().height})`)//
      var first = text.select("#temp")
      text.selectAll("tspan").attr("dy", "1em");
      if (first.text() == "") {
        first.remove();
      }
      first.attr("id", null);
    });
  }

  function createLinks(data, name) {
    if (data == null) {
      return null;
    }

    var linkdata = data[name];
    if (!linkdata) {
      fetchProgram("Computer Science (CSE)");
      linkdata = data["Computer Science (CSE)"]
    }

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
    /*for (const property in data) {
      if (property == name) {
      }
      console.log(`${property}: ${data[property]}`);
    }
    return null;*/
  }

  function intern(value) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function generateLegend(svg) {
    let y = 25;
    for(let i = 0; i < 6; i++){
      if(i == 0 && !user) {
          continue;
      }
      svg.append("circle").attr("cx", 25).attr("cy", y).attr("r", 6).style("fill", colors[i])
      svg.append("text").attr("x", 45).attr("y", y).text(collegeNames[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
      y += 30;
    }
  }

  const ref = useD3((svg) => {
    var links;
    if (program) {
      links = createLinks(data, program.name);
    } else {
      links = createLinks(data, "Computer Science (CSE)");
    }

    const nodeId = (d) => d.id;
    N = d3.map(nodes, nodeId).map(intern);
    const nodeGroup = (d) => d.group;
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);



    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    //default
    svg.selectAll("*").remove();
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
      .attr("id", function (d) { return "node_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""); })
      .attr("r", function (dat, index, n) {
        var linkItem = links.find(function (link) {
          return link.target == dat.id || link.target.id == dat.id;
        });
        if (linkItem) {
          return radius(linkItem.value);
        }
        else {
          return centerNodeSize;
        }
      })
      .style("stroke", "black")
      .classed("node", true)
      .classed("fixed", (d) => d.fx !== undefined)
      .on("click", click)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)

    label = svg.selectAll(".mytext")
      .data(nodes)
      .enter()
      .append("text")
      .attr("id", function (d) { return "text_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""); })
      .text(function (d) { return d.id; })
      .style("text-anchor", "middle") //middle
      .attr("alignment-baseline", "central")
      .style("border", "5px solid red")
      .style("fill", "#000000")
      .style("font-family", "Arial")
      .style("font-size", function (d) {
        var linkItem = links.find(function (link) {
          return link.target == d.id || link.target.id == d.id;
        });
        if (linkItem) {
          let multiplier = 5;
          if (d.id.split(" ").length > 4) {
            multiplier--;
          }
          return linkItem.value * multiplier;
        }
        else {
          return 36;
        }
      })

      .call(wrap, 25, links)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click);

    svg.node();

    generateLegend(svg);

    var active;
    function mouseover(event, d) {
      if (active != null) {
        return;
      }
      active = d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", "");
      var elem = d3.select("#text_" + active)

      if (Number(elem.style("font-size").replace("px", "")) < 12) {
        svg.append("text")
          .text(d.id)
          .attr("id", "large_" + d.id.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", ""))
          .attr("x", elem.attr("x"))
          .attr("y", elem.attr("y") - 25)
          .attr("dominant-baseline", "text-after-edge")
          .style("text-anchor", "middle") //middle
          .style("fill", "#000000")
          .style("font-family", "Arial")
          .style("font-size", 36)
          .on("mouseout", mouseout)
      }
    }

    function mouseout(event, d) {
      if (active != null) {
        var elem = d3.select("#large_" + active);
        if (elem) {
          elem.remove();
        }
        active = null;
      }
    }

    for (var i in nodes) {
      if (program && nodes[i].id == program.name) {
        nodes[i].fx = width / 2;
        nodes[i].fy = height / 2;
      }
    }

    function click(event, d) {
      //label.remove();
      fetchProgram(d.id)
    }

    // Construct the scales.
    let nodeGroups = d3.sort(G);

    const color =
      nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, user ? colors : colors.slice(1));

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);

    simulation = d3
      .forceSimulation(nodes)
      .force("link", forceLink.distance(function (d) {
        return distance(d.value);
      }))
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
      node.attr("fx", (d) => d.fx + 10);
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
    <div className="flex bg-[#D3D3D3] absolute top-[10vh] bottom-[10vh] m-5 rounded-2xl w-[90%] overflow-hidden">
      <div className="w-[30%] p-5">
        {<InteractionPanel fetchProgram={fetchProgram} fetchData={fetchData} />}
      </div>
      <svg
        className="rounded-2xl"
        ref={ref}
        style={{
          marginRight: "0px",
          marginLeft: "0px",
          backgroundColor: "green"
        }}
      >
      </svg>
    </div>
  );
};

export default ForceGraph;
