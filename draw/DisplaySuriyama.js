import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function displaySuriyama(layers,dummyGraph,originalG,coordMap){

    const width = 900;
    const height = 680;
        // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, -100, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

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

    //Append Edges
    for(let edge of dummyGraph.getEdges()){
        let x1 = coordMap.get(edge.getSource()).x;
        let x2 = coordMap.get(edge.getTarget()).x;
        let y1 = coordMap.get(edge.getSource()).y;
        let y2 = coordMap.get(edge.getTarget()).y;
        const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .append("line")
        .attr("x1",x1)
        .attr("y1",y1)
        .attr("x2",x2)
        .attr("y2",y2)
        .attr("stroke-width", 2)
        .attr("fill","none")
        if(originalG.getVertices().includes(edge.getTarget()))
        link.attr("marker-end", d => `url(${new URL(`#arrow-end`, location)})`);
    }
    //Append nodes
    for(let i=0; i< layers.length; i++){
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(layers[i])
            .join("circle")
            .attr("r",(d)=>{if(originalG.getVertices().includes(d)){return 15} else{return 0}})
            .attr("cx",(d)=>{return coordMap.get(d).x})
            .attr("cy",(d)=>{return coordMap.get(d).y})
            .attr("fill", d => color(d.group))
            .attr("cursor","pointer");

             // Add label to each node
        const label = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll(".mytext")
            .data(layers[i])
            .join("text")
            .text(function(d) {
                if(originalG.getVertices().includes(d)){return d.getLabel()} else{return ""}
            })
            .attr('x', function(d) {
                return coordMap.get(d).x;
            })
            .attr('y', function(d) {
                return coordMap.get(d).y;
            })
            .attr('dy', function(d) {
                return 3;
            })
            .attr('dx', function(d) {
                return 0;
            })
            .style("text-anchor", "middle")
            .style("stroke", "black")
            .style("font-size", 20)
            .style("opacity",0.7)
            .attr("cursor","pointer");
    }
    
    return svg.node();
}
