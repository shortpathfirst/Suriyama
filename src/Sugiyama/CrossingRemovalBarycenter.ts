import type { IGraph } from "../Graph/interface/IGraph";
import type { IVertex } from "../Graph/interface/IVertex";

export class CrossingRemovalBarycenter {

    removeCrossings(
        layers: IVertex[][],
        graph: IGraph,
        iterations = 4
    ) {
        for (let iter = 0; iter < iterations; iter++) {
            // 🔽 Downward sweep
            for (let i = 1; i < layers.length; i++) {
                this.orderLayer(layers[i - 1], layers[i], graph, true);
            }

            // 🔼 Upward sweep
            for (let i = layers.length - 2; i >= 0; i--) {
                this.orderLayer(layers[i + 1], layers[i], graph, false);
            }
        }
    }

    private orderLayer(
        fixedLayer: IVertex[],
        freeLayer: IVertex[],
        graph: IGraph,
        useIncoming: boolean
    ) {

        const pos = new Map<IVertex, number>();
        fixedLayer.forEach((v, i) => pos.set(v, i));

        const originalIndex = new Map<IVertex, number>();
        freeLayer.forEach((v, i) => originalIndex.set(v, i));
        // Compute Barycenter
        const bary = this.computeBarycenter(
            pos,
            freeLayer,
            graph,
            useIncoming
        );
        // Order Barycenter
        freeLayer.sort((a, b) => {
            const diff = bary.get(a)! - bary.get(b)!;
            return diff !== 0
                ? diff
                : originalIndex.get(a)! - originalIndex.get(b)!;
        });
    }

    /**
     * Calculate the barycenter = 1/deg(u) * sum(x(v))
     * @param layer Free Layer To Calculate barycenter
     * @param pos
     */
    private computeBarycenter(
        pos: Map<IVertex, number>,
        layer: IVertex[],
        graph: IGraph,
        useIncoming: boolean
    ): Map<IVertex, number> {

        const result = new Map<IVertex, number>();

        for (let v of layer) {

            const edges = useIncoming
                ? graph.getIncomingEdges(v)
                : graph.getOutgoingEdges(v);

            const degree = edges.length;

            if (degree === 0) {
                result.set(v, Number.POSITIVE_INFINITY);
                continue;
            }

            let sumPosition = 0;

            for (let e of edges) {
                const neighbor = useIncoming
                    ? e.getSource()
                    : e.getTarget();

                sumPosition += pos.get(neighbor) ?? 0;
            }

            result.set(v, sumPosition / degree);
        }

        return result;
    }
}