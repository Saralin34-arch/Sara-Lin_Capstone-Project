// Simple test to verify D3 and data loading
console.log("Test script loaded");

// Test if D3 is available
if (typeof d3 !== 'undefined') {
  console.log("D3 is loaded successfully");
} else {
  console.error("D3 is not loaded!");
}

// Test data loading
d3.csv("nyc_temperature_complete_2015_2025.csv")
  .then(data => {
    console.log("Data loaded:", data.length, "records");
    console.log("First record:", data[0]);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });

// Test chart container
const chart = d3.select("#chart");
console.log("Chart container:", chart.node());

// Add a simple test element
chart.append("div")
  .style("background-color", "red")
  .style("width", "200px")
  .style("height", "100px")
  .style("margin", "20px")
  .text("D3 Test - If you see this, D3 is working"); 