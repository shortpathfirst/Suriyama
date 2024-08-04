import { Edge } from "../Graph/Edge.js";
import { Vertex } from "../Graph/Vertex.js";
import { copyGraph } from "../GraphUtils.js";

export class LongestPathLayering{
    
    constructor(private graph:IGraph){
    }
    computeLayering(){
        //check if acyclic
        let layers = this.assignLayers();
        let graphDummy =  this.createDummyVerteces(layers);
        return {layers,graphDummy}
    }
    /**
     * 
     * @param graph Acyclic Graph
     * @returns The array of layers -> L[0] is the deepest layer
     */
    private assignLayers(){
        let graph = copyGraph(this.graph);
        // Define Layers
        let layers = [];

        while(graph.getSink()){
            let sinks = graph.getAllSinks();

            layers.unshift(sinks);
            for(let sink of sinks){
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
    private createDummyVerteces(layers:IVertex[][]){
        let graph = copyGraph(this.graph);

        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = layers[i];
            const nextLayer = layers[i + 1];

            for(let vertex of currentLayer){
                const outgoingEdges = graph.getIncidentEdgesOf(vertex);
                for(let edge of outgoingEdges){
                    let target = edge.getTarget();
                    if(!nextLayer.includes(target)){
                        //Remove The old Edge
                        graph.removeEdge(edge);
                        //Add Dummy Vertex
                        let dummyV = new Vertex();
                        graph.addNode(dummyV);
                        graph.addEdge(new Edge(vertex,dummyV));
                        graph.addEdge(new Edge(dummyV,target));
                        //Add it to the layer
                        nextLayer.push(dummyV);
                    }
                }
            }
        }
        return graph;
    }

}