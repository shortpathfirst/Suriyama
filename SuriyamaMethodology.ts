import { copyGraph, printGraph } from "./GraphUtils.js";
import { CoordinateAssignment } from "./Suriyama/CoordinatesAssignment.js";
import { CrossingRemovalBarycenter } from "./Suriyama/CrossingRemovalBarycenter.js";
import { GreedyCycleRemoval } from "./Suriyama/GreedyCycleRemoval.js";
import { LongestPathLayering } from "./Suriyama/LongestPathLayering.js";


export function SuriyamaMethodology(inputGraph:IGraph){

    let graph = copyGraph(inputGraph);

    printGraph(inputGraph);
    console.log("Is cyclic?",graph.isCyclic());

    let gcr = new GreedyCycleRemoval(inputGraph,graph);
    let invertedEdges = gcr.removeCycle();

    let lpl = new LongestPathLayering(graph);
    let {layers,graphDummy} = lpl.computeLayering();

    let cr = new CrossingRemovalBarycenter();
    cr.removeCrossings(layers,graphDummy);

    let ca = new CoordinateAssignment();
    let coordMap = ca.assignCoord(layers);

    return [layers,graphDummy,graph,coordMap];

}


