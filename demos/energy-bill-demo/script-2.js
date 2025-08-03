const svg = d3.select("svg"),
    margin = {top: 40, right: 20, bottom: 60, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("Central_Hudson_Bills_Cleaned.csv").then(data => {
  const subgroups = data.columns.slice(1);
  const groups = data.map(d => d.Year);

  const x0 = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .paddingInner(0.1);

  const x1 = d3.scaleBand()
      .domain(subgroups)
      .range([0, x0.bandwidth()])
      .padding(0.05);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(subgroups, key => +d[key]))])
      .nice()
      .range([height, 0]);

  const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  chart.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x0(d.Year)},0)`)
      .selectAll("rect")
      .data(d => subgroups.map(key => ({key, value: +d[key]})))
      .join("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

  chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

  chart.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

  // Legend
  const legend = svg.append("g")
      .attr("transform", `translate(${width - 100}, 20)`)
      .selectAll("g")
      .data(subgroups)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d));

  legend.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(d => d)
      .style("font-size", "12px");
});
