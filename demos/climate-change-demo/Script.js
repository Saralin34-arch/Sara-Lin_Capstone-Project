const cellSize = 12;
const width = 800;
const height = cellSize * 7;
const margin = { top: 60, right: 40, bottom: 40, left: 60 };

// Month names for labels
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const color = d3.scaleSequential()
  .domain([20, 100]) // temperature range in °F (updated for full year)
  .interpolator(d3.interpolateRgbBasis(["#1E3A8A", "#3B82F6", "#F4E4BC", "#F4A460", "#8B4513"]));

d3.csv("nyc_temperature_complete_2015_2025.csv")
  .then(data => {
    console.log("Data loaded:", data.length, "records");
    
    data.forEach(d => {
      d.date = new Date(d.date);
      d.value = +d.value;
      d.year = d.date.getFullYear();
    });

    // Filter to only include years 2015-2025 (11 years like the reference)
    const filteredData = data.filter(d => d.year >= 2015 && d.year <= 2025);
    const years = Array.from(new Set(filteredData.map(d => d.year))).sort();
    
    console.log("Years found:", years);
    console.log("Filtered data:", filteredData.length, "records");

    // Calculate temperature changes compared to baseline year (2015)
    const temperatureChanges = {};
    
    years.forEach((year, index) => {
      if (index === 0) return; // Skip first year (2015) as it's the baseline
      
      const currentYearData = filteredData.filter(d => d.year === year);
      const baselineYearData = filteredData.filter(d => d.year === 2015); // Always compare to 2015
      
      currentYearData.forEach(currentDay => {
        const dayOfYear = d3.timeFormat("%m-%d")(currentDay.date);
        const baselineDay = baselineYearData.find(d => 
          d3.timeFormat("%m-%d")(d.date) === dayOfYear
        );
        
        if (baselineDay) {
          const change = currentDay.value - baselineDay.value;
          temperatureChanges[`${year}-${dayOfYear}`] = change;
        }
      });
    });

    const chart = d3.select("#chart");
    console.log("Chart container found:", chart.node());

    // Create a single SVG container for all years - single row layout
    const mainSvg = chart.append("svg")
      .attr("width", (height + 120) * years.length + 200) // Width for 11 heatmaps in one row
      .attr("height", width + margin.top + margin.bottom + 2500) // Much more height for all elements
      .append("g")
      .attr("transform", `translate(265, ${margin.top + 190})`);

    // Add title to diagram container - positioned at middle top above heatmaps
    const totalWidth = (height + 120) * years.length + 200;
    mainSvg.append("text")
      .attr("x", totalWidth / 2)
      .attr("y", -150)
      .attr("class", "diagram-title")
      .attr("text-anchor", "middle")
      .style("font-family", "sans-serif")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("NYC Temperature Calendar Heatmap");

    years.forEach((year, index) => {
      const yearData = filteredData.filter(d => d.year === year);
      console.log(`Processing year ${year} with ${yearData.length} data points at index ${index}`);
      
      // Skip if no data for this year
      if (yearData.length === 0) {
        console.log(`Skipping year ${year} - no data`);
        return;
      }
      
      console.log(`Creating heatmap for year ${year} at index ${index}`);

      const yearGroup = mainSvg.append("g")
        .attr("transform", `translate(${index * (height + 120) + 40}, 0) rotate(90)`);

      // Add year label - positioned at top like the reference image
      // Add year label - positioned at the bottom of each heatmap (like ObservableHQ reference)
      yearGroup.append("text")
        .attr("x", height / 2)
        .attr("y", width + 30)
        .attr("class", "year-label")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(year.toString());

      // Add day labels (S, M, T, etc.) - positioned horizontally above heatmap grid (like ObservableHQ)
      const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
      yearGroup.selectAll(".day-label")
        .data(dayLabels)
        .join("text")
          .attr("class", "day-label")
          .attr("x", (d, i) => i * cellSize + cellSize / 2)
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("fill", "#666")
          .text(d => d);

      // Add month labels - positioned on the left side of each individual heatmap (like ObservableHQ)
      const months = d3.timeMonths(d3.timeYear(new Date(year, 0, 1)), d3.timeYear.offset(new Date(year, 0, 1), 1));
      yearGroup.selectAll(".month-label")
        .data(months)
        .join("text")
          .attr("class", "month-label")
          .attr("x", -20)
          .attr("y", (d, i) => i * (width / 12) + (width / 24))
          .attr("text-anchor", "end")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("fill", "#666")
          .text(d => monthNames[d.getMonth()]);

      // Add temperature cells
      yearGroup.selectAll("rect")
        .data(yearData)
        .join("rect")
          .attr("width", cellSize - 1)
          .attr("height", cellSize - 1)
          .attr("x", d => d3.timeWeek.count(d3.timeYear(d.date), d.date) * cellSize)
          .attr("y", d => d.date.getDay() * cellSize)
          .attr("fill", d => color(d.value))
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .style("opacity", d => {
            if (d.year === 2015) return 1; // Baseline year has full opacity
            
            const dayOfYear = d3.timeFormat("%m-%d")(d.date);
            const changeKey = `${d.year}-${dayOfYear}`;
            const change = temperatureChanges[changeKey];
            
            if (change === undefined) return 0.7; // Default opacity for unmatched days
            
            // Calculate opacity based on temperature change (REVERSED)
            // Higher temperature change = higher opacity (less transparent)
            const maxChange = 20; // Maximum expected temperature change
            const normalizedChange = Math.max(-maxChange, Math.min(maxChange, change)) / maxChange;
            
            // Base opacity range: 0.3 to 1.0
            return 0.3 + (Math.abs(normalizedChange) * 0.7);
          })
          .append("title")
            .text(d => {
              const dayOfYear = d3.timeFormat("%m-%d")(d.date);
              const changeKey = `${d.year}-${dayOfYear}`;
              const change = temperatureChanges[changeKey];
              
              let changeText = "";
              if (change !== undefined) {
                const changeSign = change > 0 ? "+" : "";
                changeText = ` (${changeSign}${change.toFixed(1)}°F vs 2015)`;
              }
              
              return `${d3.timeFormat("%Y-%m-%d")(d.date)}: ${d.value}°F${changeText}`;
            });
    });

    // Add elegant, compact legend
    const legend = chart.append("div")
      .style("margin-top", "200px")
      .style("text-align", "center")
      .style("padding", "25px")
      .style("background", "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)")
      .style("border-radius", "12px")
      .style("box-shadow", "0 4px 20px rgba(0,0,0,0.08)")
      .style("border", "1px solid #e2e8f0")
      .style("max-width", "400px")
      .style("margin-left", "auto")
      .style("margin-right", "auto");

    // Clean title
    legend.append("div")
      .style("font-weight", "600")
      .style("font-size", "16px")
      .style("margin-bottom", "15px")
      .style("color", "#1f2937")
      .text("Temperature Scale (°F)");

    // Compact gradient bar
    const gradientBar = legend.append("div")
      .style("width", "250px")
      .style("height", "20px")
      .style("margin", "10px auto")
      .style("background", "linear-gradient(to right, #1E3A8A, #3B82F6, #60A5FA, #F4E4BC, #F4A460, #FB923C, #8B4513)")
      .style("border-radius", "10px")
      .style("border", "1px solid #d1d5db");

    // Simple color labels
    const colorLabels = legend.append("div")
      .style("display", "flex")
      .style("justify-content", "space-between")
      .style("width", "250px")
      .style("margin", "8px auto")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("color", "#6b7280");

    colorLabels.append("span").text("Cold");
    colorLabels.append("span").text("Hot");

    // Subtle divider
    legend.append("div")
      .style("width", "40px")
      .style("height", "1px")
      .style("background", "#e5e7eb")
      .style("margin", "15px auto");

    // Compact climate change section
    legend.append("div")
      .style("font-weight", "600")
      .style("margin-bottom", "10px")
      .style("color", "#1f2937")
      .style("font-size", "14px")
      .text("Climate Change Visualization");

    // Concise bullet points
    legend.append("div")
      .style("margin-bottom", "8px")
      .style("color", "#4b5563")
      .style("font-size", "12px")
      .style("line-height", "1.4")
      .text("• Higher opacity = Larger temperature change vs 2015");

    legend.append("div")
      .style("margin-bottom", "8px")
      .style("color", "#4b5563")
      .style("font-size", "12px")
      .style("line-height", "1.4")
      .text("• Lower opacity = Smaller temperature change vs 2015");

    // Simple footer note
    legend.append("div")
      .style("margin-top", "12px")
      .style("padding", "8px")
      .style("background", "#f3f4f6")
      .style("border-radius", "6px")
      .style("font-style", "italic")
      .style("color", "#6b7280")
      .style("font-size", "11px")
      .style("border-left", "3px solid #3b82f6")
      .text("2015: Baseline year | Hover for details");
  })
  .catch(error => {
    console.error("Error:", error);
  });
