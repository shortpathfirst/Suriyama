export class CrossingRemoval {
    constructor() {
    }
    removeCrossings(layer, graph) {
        let fixedLayer = layer[layer.length - 1];
        // this.computeBarycenter(fixedLayer,layer[layer.length-2],graph);
        for (let i = layer.length - 2; i >= 0; i--) {
            if (layer[i].length > 1) {
                let barycenters = this.computeBarycenter(fixedLayer, layer[i], graph);
                let sortedBarycenters = new Map([...barycenters.entries()].sort());
                layer[i] = Array.from(sortedBarycenters.keys());
                console.log(layer[i]);
            }
            fixedLayer = layer[i];
        }
    }
    /**
     *
     * @param L1 Fixed layer
     * @param L2 Layer to calculate barycenter
     */
    computeBarycenter(L1, L2, graph) {
        let l2Barycenters = new Map();
        // console.log("Layer 1",L1,"Layer 2",L2)
        for (let i = 0; i < L2.length; i++) {
            const edges = graph.getIncidentEdgesOf(L2[i]);
            const degree = edges.length;
            let sumPositions = 0;
            for (let edge of edges) {
                const target = edge.getTarget();
                sumPositions += L1.indexOf(target);
            }
            let barycenter = sumPositions / degree;
            l2Barycenters.set(L2[i], barycenter);
            // console.log("Barycenter:",barycenter,"of",L2[i].getId())
        }
        console.log(l2Barycenters);
        return l2Barycenters;
    }
}
//# sourceMappingURL=CrossingRemoval.js.map