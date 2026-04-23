
import { Edge } from "../Graph/implementation/Edge.js";
import { Vertex } from "../Graph/implementation/Vertex.js";
import { IGraph } from "../Graph/interface/IGraph.js";
import { IVertex } from "../Graph/interface/IVertex.js";
import { copyGraph } from "../GraphUtils.js";


export class LongestPathLayering {

    constructor(private graph: IGraph) {
    }
    computeLayering() {
        //check if acyclic
        let layers = this.assignLayers();
        let graphDummy = this.createDummyVertices(layers);
        return { layers, graphDummy }
    }
    /**
     * 
     * @param graph Acyclic Graph
     * @returns The array of layers -> L[0] is the deepest layer
     */
    private assignLayers() {
        let graph = copyGraph(this.graph);
        // Define Layers
        let layers = [];

        while (graph.getSink()) {
            let sinks = graph.getAllSinks();

            layers.unshift(sinks);
            for (let sink of sinks) {
                graph.removeNode(sink);
            }
        }
        return layers;
    }

    /**
     * Add verteces to edges that span more than one layer
     * @param layers 
     * @returns The updated layers and the graph with the new verteces
     */
    private createDummyVertices(layers: IVertex[][]) {

        const graph = copyGraph(this.graph);

        for (let i = 0; i < layers.length; i++) {
            // Iterate shallow copy of current layer
            for (let v of [...layers[i]]) {

                const outgoingEdges = graph.getOutgoingEdges(v);

                for (let e of outgoingEdges) {

                    const target = e.getTarget();

                    let nextLayer = layers.findIndex(l => l.includes(target));

                    // If the next layer doen't include target
                    if (nextLayer > i + 1) {
                        //Remove The old Edge
                        graph.removeEdge(e);

                        let prev = v;

                        for (let k = i + 1; k < nextLayer; k++) {
                            //Add Dummy Vertex
                            const dummyV = new Vertex();
                            graph.addNode(dummyV);
                            layers[k].push(dummyV);

                            graph.addEdge(new Edge(prev, dummyV));
                            prev = dummyV;
                        }

                        graph.addEdge(new Edge(prev, target));
                    }
                }
            }
        }

        return graph;
    }
}