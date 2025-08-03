const nodes = [
  { id: "Me (Designer/Lead)" },
  { id: "AI Energy Advising Tool" },
  { id: "Building Energy Platform" },
  { id: "Users" },
  { id: "Urban Environment" },
  { id: "Researchers / Educators / Activists" },
  { id: "Policy Advocacy / Awareness" }
];

const links = [
  { source: "Me (Designer/Lead)", target: "AI Energy Advising Tool" },
  { source: "AI Energy Advising Tool", target: "Building Energy Platform" },
  { source: "Users", target: "AI Energy Advising Tool", label: "Download / Use Tool" },
  { source: "Users", target: "Building Energy Platform", label: "Data Upload" },
  { source: "Urban Environment", target: "Users", label: "Data Capture" },
  { source: "Building Energy Platform", target: "Researchers / Educators / Activists" },
  { source: "Researchers / Educators / Activists", target: "Policy Advocacy / Awareness" }
];

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(160))
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", 2);

const node = svg.append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("class", "node-group")
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

node.each(function(d) {
  if (d.id === "Users") {
    // Create image for Users node
    d3.select(this).append("image")
      .attr("xlink:href", "User icon.png")
      .attr("x", -40)
      .attr("y", -40)
      .attr("width", 80)
      .attr("height", 80);
  } else {
    // Create circle for other nodes
    d3.select(this).append("circle")
      .attr("r", 12)
      .attr("fill", "#2563eb");
  }
});

node.each(function(d) {
  d3.select(this).append("text")
    .attr("x", 22)
    .attr("y", 4)
    .text(d.id)
    .style("fill", "#000000")
    .style("stroke", "none")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "12px")
    .attr("fill", "#000000");
});

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x},${d.y})`);
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}
function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
