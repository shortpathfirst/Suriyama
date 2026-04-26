import { displayForceDirected } from './draw/DisplayForceDirected.js';
import { displaySugiyama } from './draw/DisplaySugiyama.js';
import { generateGraph } from './GraphUtils.js';
import * as d3 from "d3";
import { SugiyamaMethodology } from './SugiyamaMethodology.js';

const textArea = document.getElementById('graph-input') as HTMLTextAreaElement | null;
const form = document.getElementById("form") as HTMLFormElement | null;

export type dataObject = {
    source: string;
    target: string;
    value: number;
}

if (form && textArea) {
    form.addEventListener('submit', (e) => {
        //Todo Throw errors
        e.preventDefault();
        let text = textArea.value;
        let rows = text.split('\n');
        let dataObjects = [];
        for (let row of rows) {
            let a = row.split(',');
            if (a[0] === a[1])
                throw Error("cannot contain self cycle")
            let object = { source: a[0], target: a[1], value: NaN };
            dataObjects.push(object);
        }
        d3.select("#display").selectAll("svg").remove();
        displayData(dataObjects);
    });
}

fetchData("data/test.csv").then((data) => {
    displayData(data);
});

function displayData(data: dataObject[]) {
    // Format data to add to the form
    const formattedData = data
        .map((link) => `${link.source},${link.target}`)
        .join("\n");
    if (textArea) textArea.value = formattedData;

    var nodesSet = new Set<string>();

    // Compute the distinct nodes from the links.
    data.forEach((link) => {
        nodesSet.add(link.source);
        nodesSet.add(link.target);
    });

    let graphFromData = computeGraph(nodesSet, data);
    let { layers, graphDummy, coordMap } = SugiyamaMethodology(graphFromData);

    let svgForceDirected = displayForceDirected(Array.from(nodesSet), data);
    let svgSugiyama = displaySugiyama(layers, graphDummy, graphFromData, coordMap);

    d3.select("#display").append(() => svgForceDirected);
    d3.select("#display").append(() => svgSugiyama);
}

async function fetchData(file: string) {
    let data = await d3.dsv(",", file, (d) => {
        return {
            source: d.source,
            target: d.target,
            value: +d.value,
        }
    });
    console.log(data)
    return data;
}
function computeGraph(nodesSet: Set<string>, data: dataObject[]) {
    return generateGraph(nodesSet, data);
    // return generate_slide_graph();
}

