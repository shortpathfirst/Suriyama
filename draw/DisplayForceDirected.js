import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

fetchData().then((data)=>{
    var nodesSet = new Set();

    // Compute the distinct nodes from the links.
    data.forEach((link)=>{
        nodesSet.add(link.source);
        nodesSet.add(link.target);
    });

    console.log("nodes",nodesSet)
    console.log("links",data)

    let svg = computeGraph(Array.from(nodesSet),data);

    d3.select("body").append(() => svg);
});

async function fetchData(){
    let data = await d3.dsv(",", "data/slideGraph.csv", (d) => {
        return {
            source : d.source,
            target : d.target,
            value : +d.value,
    }});
    //Remove Index
    // data = data.slice(0,data.length-1);
    return data;
}


function computeGraph(dataNodes,dataLinks){
    const width = 928;
    const height = 680;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = dataLinks.map(d => ({...d}));
    const nodes = dataNodes.map(d => ({name:d}));

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter())
        .force("link", d3.forceLink(links).id(d => d.name).distance(90))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("x", d3.forceX())
        .force("y", d3.forceY());


    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    
    //Create Arrow def
    svg.append("defs").selectAll("marker")
        .data(["end"])
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 22)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "black")
        .attr("d", 'M0,-5L10,0L0,5');

    // Add link with marker
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke-width", 2)
        .attr("fill","none")
        .attr("marker-end", d => `url(${new URL(`#arrow-end`, location)})`);

    // Add node
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r",15)
        .attr("fill", d => color(d.group))
        .attr("cursor","pointer");
    node.append("title")
        .text(d =>d.name);

    // Add label to each node
    const label = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll(".mytext")
        .data(nodes)
        .join("text")
        .text(function(d) {
			return d.name
		})
		.attr('x', function(d) {
			return d.x
		})
		.attr('y', function(d) {
			return d.y
		})
		.attr('dy', function(d) {
			return -15
		})
        .attr('dx', function(d) {
			return 0
		})
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .style("font-size", 20)
        .style("opacity",0.7)
        .attr("cursor","pointer");

     // Add a drag behavior.
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    label.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

     // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });


        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

     // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }


    return svg.node();

}

