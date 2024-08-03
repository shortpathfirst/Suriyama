
import { Edge } from "./Graph/Edge.js";
import { Graph } from "./Graph/Graph.js";
import { Vertex } from "./Graph/Vertex.js";
import { CoordinateAssignment } from "./Suriyama/CoordinatesAssignment.js";
import { CrossingRemovalBarycenter } from "./Suriyama/CrossingRemovalBarycenter.js";
import { GreedyCycleRemoval } from "./Suriyama/GreedyCycleRemoval.js";
import { LongestPathLayering } from "./Suriyama/LongestPathLayering.js";


export function SuriyamaMethodology(){
    let {verteces,edges} = generate_slide_graph();
    let graph = populateGraph(verteces,edges);
    let acyclicGraph = populateGraph(verteces,edges);
    
    printGraph(graph);
    console.log("Is cyclic?",graph.isCyclic());

    let gcr = new GreedyCycleRemoval(graph,acyclicGraph);
    let invertedEdges = gcr.removeCycle();

    let lpl = new LongestPathLayering(acyclicGraph);
    let {layers,graphDummy} = lpl.computeLayering();

    let cr = new CrossingRemovalBarycenter();
    cr.removeCrossings(layers,graphDummy);

    let ca = new CoordinateAssignment();
    let coordMap = ca.assignCoord(layers);

    return [layers,graphDummy,acyclicGraph,coordMap];

}
function populateGraph(v:IVertex[],edges:IEdge[]){
    let graph = new Graph();
    //Populate Graph
    v.forEach(vert =>graph.addNode(vert)); 

    edges.forEach(e=>graph.addEdge(e));
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
    return {verteces:v,edges:edges};

}
/**
 * PRINT THE GRAPH IN CONSOLE
 * @param graph 
 */
function printGraph(graph:IGraph){
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

