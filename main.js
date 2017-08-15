//Requirements
//Display a Force-directed Graph that shows which countries share borders.
//Display each country's flag on its node.

$(document).ready(function() {
  //Variables
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
    urlFlag = 'https://lipis.github.io/flag-icon-css/flags/4x3/'; //us.svg
  let dataArr = [],
       margin = {top: 70, right: 70, bottom: 50, left: 50},
            w = 1600 - margin.left - margin.right,
            h = 1000 - margin.top - margin.bottom;
  let div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  //Execute
  getData();

  //Functions
  function getData() {
    d3.json(url, function(data) {//console.log(data);
      let nodes = data.nodes;
      let links = data.links;
      makeChart(nodes, links);
    })
  }

  function makeChart(nodes, links) {
    let chart = d3.select(".chartWrap").append("svg").attr('width', w).attr('height', h);
    console.log(nodes);
    //Title
    let chartTitle = chart.append("text").html("Force Directed Graph of National Contiguity").attr("x", w/2).attr("y", margin.top/2).attr("text-anchor", "middle").attr("font-size", 36).attr("class", "chartTitle");
    //Set Forces
    let force = d3.forceSimulation()
      .force("center", d3.forceCenter(w/2, h/2))
      .force("charge", d3.forceManyBody().strength(-850).distanceMax(120))
      .force("link", d3.forceLink())
      .force("vertical", d3.forceY().strength(0.05))
      .force("horizontal", d3.forceX().strength(0.0001));
    force.nodes(nodes);
    force.force("link").links(links);
    //Set Links
    let link = chart
      .selectAll(".link")
      .data(links)
      .enter()
        .append("line")
        .attr("class", "link");
        //Set Nodes
        let node = chart
          .selectAll(".image")
          .data(nodes)
          .enter()
          .append("image")
            .attr("width", 32)
            .attr("height", 24)
            .attr("xlink:href", function(d) {return urlFlag + d.code + ".svg";}) //returns correct path
            //Use .on to popup tooltip div... Not perfect but it works...
            .on("mouseover", function(d) {
              div.html(d.country).style("opacity", .8).style("left", (parseInt(d3.select(this).attr("x"), 10) + 255) + "px").style("top", d3.select(this).attr("y") + "px");
            })
            .on("mouseout", function(d) {div.style("opacity", 0).style("left", "0px").style("top", "0px");}); //Set position to 0,0 otherwise it will interfere with selecting nearby countries...
            //.call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
      //Start simulation
      force.on("tick", function() {
        link
          .attr("x1", function(d) {return d.source.x;})
          .attr("y1", function(d) {return d.source.y;})
          .attr("x2", function(d) {return d.target.x;})
          .attr("y2", function(d) {return d.target.y;});
        node
          .attr("x", function(d) {return d.x;})
          .attr("y", function(d) {return d.y;});
      });
 } //Closes makeChart
}); //Closes document.ready
