export class CrossingRemovalBarycenter {
    constructor() {
    }
    removeCrossings(layer, graph) {
        // layer[layer.length-1] =  [ layer[layer.length-1][2] , layer[layer.length-1][3], layer[layer.length-1][1] ,layer[layer.length-1][0] ] ;
        let fixedLayer = layer[layer.length - 1];
        for (let i = layer.length - 2; i >= 0; i--) {
            if (layer[i].length > 1) {
                //Barycenter
                let barycenters = this.computeBarycenter(fixedLayer, layer[i], graph);
                //Sort barycenter
                let sortedBarycenters = new Map([...barycenters.entries()].sort());
                //Apply to the layer
                layer[i] = Array.from(sortedBarycenters.keys());
            }
            fixedLayer = layer[i];
        }
    }
    /**
     * Calculate the barycenter = 1/deg(u) * sum(x(v))
     * @param L1 Fixed layer
     * @param L2 Layer to calculate barycenter
     */
    computeBarycenter(L1, L2, graph) {
        let l2Barycenters = new Map();
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
        }
        return l2Barycenters;
    }
}
//# sourceMappingURL=CrossingRemovalBarycenter.js.map