// Set the height and width of the chart area; margins
var boxWidth = 960;
var boxHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = boxWidth - margin.left - margin.right;
var height = boxHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group that holds the chart,
// shift it by left and top margins. Use d3.select
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", boxWidth)
  .attr("height", boxHeight);

// Append SVG group called "g"
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Xaxis = Poverty
var chosenXAxis = "poverty";
// set scale of x axis
function xScale(USData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(USData, d => d[chosenXAxis]) * 0.9,
      d3.max(USData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);
  return xLinearScale;
}

// Get data from data.csv with error handling
d3.csv("data.csv").then(function(USData, err) {
  if (err) throw err;
  // parse the data
  USData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });
  // xLinearScale function above csv import
  var xLinearScale = xScale(USData, chosenXAxis);
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(USData, d => d.healthcare)])
    .range([height, 0]);
  // Functions to make axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(USData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "red")
    .attr("opacity", ".5");
  chartGroup.selectAll("#scatter")
    .data(USData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "7px")
    .attr("fill", "white")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare) + 4.94 / 2)
    .text(function(d){return d.abbr})
  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.25))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Poplulation that Lacks Healthcare (%)");
  chartGroup.append("text")
    .attr("y", height + 1.5 * margin.bottom / 2)
    .attr("x", width / 2.5)
    .classed("axis-text", true)
    .text("Population that Live in Poverty (%)")
});