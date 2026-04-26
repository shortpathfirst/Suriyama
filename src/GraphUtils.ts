
import { Edge } from "./Graph/implementation/Edge.js";
import { Graph } from "./Graph/implementation/Graph.js";
import { Vertex } from "./Graph/implementation/Vertex.js";
import type { IEdge } from "./Graph/interface/IEdge.js";
import type { IGraph } from "./Graph/interface/IGraph.js";
import type { IVertex } from "./Graph/interface/IVertex.js";


export function copyGraph(_graph:IGraph){
    //Make copy
    let copy = new Graph();
    for(let v of _graph.getVertices()){
        copy.addNode(v);
    }
    for(let e of _graph.getEdges()){
        copy.addEdge(e);
    }
    return copy;
}

export function generateGraph(nodesSet:Set<string>,data:any){
    let graph = new Graph();
    let labelMap = new Map<string,IVertex>();
    let arrayNodes = Array.from(nodesSet);

    for(let i=0; i<arrayNodes.length; i++){
        let vertex = new Vertex();
        vertex.setLabel(arrayNodes[i]);
        graph.addNode(vertex);
        labelMap.set(arrayNodes[i],vertex)
    }

    for(let link of data){
        let s = labelMap.get(link.source);
        let t = labelMap.get(link.target);
        if(s == undefined || t == undefined)
            throw Error("Source or target undefined");
        let edge = new Edge(s,t);
        graph.addEdge(edge);
    }

    return graph;
}

export function generate_slide_graph(){
    
    let v:IVertex[] = [];

    let edges:IEdge[] = [];


    for(let i=0; i<=11; i++){
        v.push(new Vertex());
    }
    edges.push(new Edge (v[1],v[9]));
    edges.push(new Edge (v[1],v[3]));
    edges.push(new Edge (v[1],v[2]));
    edges.push(new Edge (v[2],v[5]));
    edges.push(new Edge (v[2],v[4]));
    edges.push(new Edge (v[3],v[4]));
    edges.push(new Edge (v[3],v[10]));
    edges.push(new Edge (v[6],v[5]));
    edges.push(new Edge (v[7],v[6]));
    edges.push(new Edge (v[8],v[9]));
    edges.push(new Edge (v[8],v[1]));
    edges.push(new Edge (v[10],v[9]));
    edges.push(new Edge (v[10],v[11]));
    edges.push(new Edge (v[11],v[3]));
    v.shift();

    // return {verteces:v,edges:edges};

    let graph = new Graph();
    //Populate Graph
    v.forEach(vert =>graph.addNode(vert)); 

    edges.forEach(e=>graph.addEdge(e));
    return graph;

}
/**
 * PRINT THE GRAPH IN CONSOLE
 * @param graph 
 */
export function printGraph(graph:IGraph){
    for(let v of graph.getVertices()){
        let incidents = graph.getIncidentEdgesOf(v);
        let string = "Node: "+v.getId()+" -----> "
        for(let e of incidents){
            let source = e.getSource().getId();
            let target =e.getTarget().getId();
            string+="["+source+","+target+"] ";
        }
        console.log(string);
    }
}