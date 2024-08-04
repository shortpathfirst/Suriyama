import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { displaySuriyama } from "./DisplaySuriyama.js";
import { displayForceDirected } from "./DisplayForceDirected.js";
import { generateGraph ,generate_slide_graph} from "../GraphUtils.js";
import {SuriyamaMethodology} from "../SuriyamaMethodology.js"

fetchData().then((data)=>{
    var nodesSet = new Set();

    // Compute the distinct nodes from the links.
    data.forEach((link)=>{
        nodesSet.add(link.source);
        nodesSet.add(link.target);
    });

    console.log("nodes",nodesSet)
    console.log("links",data)
    
    let graphFromData = computeGraph(nodesSet,data);
    let [layers,dummyGraph,originalG,coordMap]= SuriyamaMethodology(graphFromData);

    let svgForceDirected = displayForceDirected(Array.from(nodesSet),data);
    let svgSuriyama =  displaySuriyama(layers,dummyGraph,originalG,coordMap);

    d3.select("body").append(() => svgForceDirected);
    d3.select("body").append(() => svgSuriyama);
});

async function fetchData(){
    let data = await d3.dsv(",", "data/test.csv", (d) => {
        return {
            source : d.source,
            target : d.target,
            value : +d.value,
    }});

    return data;
}
function computeGraph(nodesSet,data){
    return generateGraph(nodesSet,data);
    // return generate_slide_graph();
}

