import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { displaySuriyama } from "./DisplaySuriyama.js";
import { displayForceDirected } from "./DisplayForceDirected.js";
import { generateGraph ,generate_slide_graph} from "../GraphUtils.js";
import {SuriyamaMethodology} from "../SuriyamaMethodology.js"

const textArea = document.getElementById('graph-input');
const form = document.getElementById("form");

form.addEventListener('submit', (e) => {
    //Todo Throw errors
    e.preventDefault();
    let text = textArea.value;
    let rows = text.split('\n');
    let dataObjects = [];
    for(let row of rows){
        let a = row.split(',');
        if(a[0]===a[1])
            throw Error("cannot contain self cycle")
        let object = {source:a[0],target:a[1],value:NaN};
        dataObjects.push(object);
    }
    d3.select("#display").selectAll("svg").remove();
    displayData(dataObjects);
});

fetchData("data/test.csv").then((data)=>{
    displayData(data);
});

function displayData(data){
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

    d3.select("#display").append(() => svgForceDirected);
    d3.select("#display").append(() => svgSuriyama);
}

async function fetchData(file){
    let data = await d3.dsv(",", file, (d) => {
        return {
            source : d.source,
            target : d.target,
            value : +d.value,
    }});
    console.log(data)
    return data;
}
function computeGraph(nodesSet,data){
    return generateGraph(nodesSet,data);
    // return generate_slide_graph();
}

