
import * as d3 from "d3";
import type { IGraph } from "../Graph/interface/IGraph";
import type { IVertex } from "../Graph/interface/IVertex";


export function displaySugiyama(layers: IVertex[][], dummyGraph: IGraph, originalG: IGraph, coordMap: Map<IVertex, { x: number, y: number }>) {

    // Calculate bounding box from coordinates
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const coord of coordMap.values()) {
        minX = Math.min(minX, coord.x);
        maxX = Math.max(maxX, coord.x);
        minY = Math.min(minY, coord.y);
        maxY = Math.max(maxY, coord.y);
    }

    const margin = 50;
    const width = maxX - minX + 2 * margin;
    const height = maxY - minY + 2 * margin;

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [minX - margin, minY - margin, width, height])
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
    for (let edge of dummyGraph.getEdges()) {

        let { x: x1 = 0, y: y1 = 0 } = coordMap.get(edge.getSource()) || {};
        let { x: x2 = 0, y: y2 = 0 } = coordMap.get(edge.getTarget()) || {};

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", 2)
            .attr("fill", "none")
        if (originalG.getVertices().includes(edge.getTarget()))
            link.attr("marker-end", `url(${new URL(`#arrow-end`, location.href)})`);
    }
    //Append nodes
    for (let i = 0; i < layers.length; i++) {
        // const node = 
        svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(layers[i])
            .join("circle")
            .attr("r", (d) => { if (originalG.getVertices().includes(d)) { return 15 } else { return 0 } })
            .attr("cx", (d) => coordMap.get(d)?.x ?? 0)
            .attr("cy", (d) => coordMap.get(d)?.y ?? 0)
            .attr("fill", d => color("" + d.getWeight()))
            .attr("cursor", "pointer");

        // Add label to each node
        // const label =
        svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll(".mytext")
            .data(layers[i])
            .join("text")
            .text(function (d) {
                if (originalG.getVertices().includes(d)) { return d.getLabel() } else { return "" }
            })
            .attr('x', (d) => coordMap.get(d)?.x ?? 0)
            .attr('y', (d) => coordMap.get(d)?.y ?? 0)
            .attr('dy', 3)
            .attr('dx', 0)
            .style("text-anchor", "middle")
            .style("stroke", "black")
            .style("font-size", 20)
            .style("opacity", 0.7)
            .attr("cursor", "pointer");
    }

    return svg.node();
}
