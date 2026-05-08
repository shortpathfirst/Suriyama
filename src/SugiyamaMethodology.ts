import type { IGraph } from "./Graph/interface/IGraph.js";
import { printGraph } from "./GraphUtils.js";
import { CoordinateAssignment } from "./Sugiyama/CoordinatesAssignment.js";
import { CrossingRemovalBarycenter } from "./Sugiyama/CrossingRemovalBarycenter.js";
import { GreedyCycleRemoval } from "./Sugiyama/GreedyCycleRemoval.js";
import { LongestPathLayering } from "./Sugiyama/LongestPathLayering.js";


export function SugiyamaMethodology(inputGraph: IGraph) {

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

    return {layers, graphDummy, coordMap};

}


