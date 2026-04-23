import { printGraph } from "./GraphUtils.js";
import { CoordinateAssignment } from "./Suriyama/CoordinatesAssignment.js";
import { CrossingRemovalBarycenter } from "./Suriyama/CrossingRemovalBarycenter.js";
import { GreedyCycleRemoval } from "./Suriyama/GreedyCycleRemoval.js";
import { LongestPathLayering } from "./Suriyama/LongestPathLayering.js";



export function SuriyamaMethodology(inputGraph: IGraph) {

    printGraph(inputGraph);
    console.log("Is cyclic?", inputGraph.isCyclic());

    let gcr = new GreedyCycleRemoval(inputGraph);
    let invertedEdges = gcr.removeCycle();

    console.log("Inverted Edges:", invertedEdges);
    console.log("Is now cyclic?", inputGraph.isCyclic());

    let lpl = new LongestPathLayering(inputGraph);
    let { layers, graphDummy } = lpl.computeLayering();

    let cr = new CrossingRemovalBarycenter();
    cr.removeCrossings(layers, graphDummy);

    let ca = new CoordinateAssignment();
    let coordMap = ca.assignCoord(layers);

    return [layers, graphDummy, inputGraph, coordMap];

}


