import { IGraph } from "../Graph/interface/IGraph.js";
import { copyGraph } from "../GraphUtils.js";


export class GreedyCycleRemoval {

    private graphCopy: IGraph;
    constructor(private graph: IGraph) {
        this.graphCopy = copyGraph(graph);
    }
    /**
     * Remove cycle by inverting some edges with greedy tecnique by Eads
     * @returns The inverted edges
     */
    removeCycle() {
        return this.invertLewardEdges();
    }

    private invertLewardEdges() {

        let vertexOrder = this.findGreedyOrder();
        let lewardEdges = [];
        for (let edge of this.graph.getEdges()) {
            let s = edge.getSource();
            let t = edge.getTarget();
            if (vertexOrder.indexOf(s) > vertexOrder.indexOf(t)) {
                lewardEdges.push(edge);
            }
        }
        // Invert Edges
        for (let edge of lewardEdges) {
            this.graph.invertEdge(edge);
        }
        return lewardEdges;
    }
    private findGreedyOrder() {
        //Initialize both Sl and Sr to be empty lists
        let Sl = [];
        let Sr = [];
        let isEmpty = () => this.graphCopy.getVertices().length === 0;
        while (!isEmpty()) {
            //(a) 
            while (this.graphCopy.getSink()) {
                let sink = this.graphCopy.getSink();
                if(!sink) break;
                this.graphCopy.removeNode(sink);
                Sr.unshift(sink);
                // console.log("Removed sink:",sink.getId())
            }
            //(b)
            while (this.graphCopy.getSource()) {
                let source = this.graphCopy.getSource();
                if(!source) break;
                this.graphCopy.removeNode(source);
                Sl.push(source);
                // console.log("Removed source:",source.getId())
            }
            //(c)
            if (this.graphCopy.getVertices().length === 0)
                break;


            let { inDegree, outDegree } = this.graphCopy.findInOutDegree()

            let maxNode = null;
            let maxDiff = -Infinity;

            for (let node of this.graphCopy.getVertices()) {

                const out = outDegree.get(node) ?? 0;
                const inn = inDegree.get(node) ?? 0;

                const diff = out - inn;

                if (diff > maxDiff) {
                    maxDiff = diff;
                    maxNode = node;
                }
            }
            if (maxNode) {
                this.graphCopy.removeNode(maxNode);
                // console.log("Removed maxDegree:",maxDegreeNode.getId())
                Sl.push(maxNode);
            }
        }
        return Sl.concat(Sr);
    }
}