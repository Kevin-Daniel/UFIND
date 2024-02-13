import React, {useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './App.css';

function App() {
const [data] = useState([25, 50, 35, 15, 94, 10]);
const svgRef = useRef();
var graph = ({
  nodes: Array.from({length: 13}, () => ({})),
  links: [
    {source: 0, target: 1},
    {source: 1, target: 2}
  ]
})

useEffect(() => {
  // setting up svg
  const width = 400;
  const height = 200;
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]),
  link = svg
    .selectAll(".link")
    .data(graph.links)
    .join("link")
    .classed("link", true),
  node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .join("circle")
    .attr("r", 12)
    .classed("node", true)
    .classed("fixed", d => d.fx !== undefined);

  return svg.node();

}, [data]);

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
