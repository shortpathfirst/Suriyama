import type { IGraph } from "../Graph/interface/IGraph";
import type { IVertex } from "../Graph/interface/IVertex";


type Coord = { x: number; y: number };

export class Packing {
    /**
     * Simple "packing" step for orthogonalization:
     * repack vertices on a horizontal grid while respecting layer order.
     *
     * Heuristic: iteratively move each vertex toward the average x of its neighbors,
     * then enforce a minimum spacing between consecutive vertices in the same layer.
     */
    pack(
        layers: IVertex[][],
        graph: IGraph,
        coordMap: Map<IVertex, Coord>
    ): Map<IVertex, Coord> {
        // Infer spacing from the current coordinate assignment.
        const xs = Array.from(coordMap.values()).map(c => c.x);
        const uniqueRounded = Array.from(new Set(xs.map(x => Math.round(x)))).sort((a, b) => a - b);

        let minPositiveDiff = Infinity;
        for (let i = 1; i < uniqueRounded.length; i++) {
            const diff = uniqueRounded[i] - uniqueRounded[i - 1];
            if (diff > 0 && diff < minPositiveDiff) minPositiveDiff = diff;
        }

        const GRID = 10;
        const fallbackMinSpacing = 60;
        const inferred = Number.isFinite(minPositiveDiff) ? minPositiveDiff : fallbackMinSpacing;
        const minXSpacing = Math.max(fallbackMinSpacing, Math.round(inferred / GRID) * GRID);

        const ITERATIONS = 12;
        const xMap = new Map<IVertex, number>();
        for (const [v, c] of coordMap.entries()) xMap.set(v, c.x);

        const snap = (v: number) => Math.round(v / GRID) * GRID;

        for (let iter = 0; iter < ITERATIONS; iter++) {
            const prevXMap = new Map<IVertex, number>(xMap);

            for (const layer of layers) {
                if (layer.length <= 1) continue;

                const initialXs = layer.map(v => prevXMap.get(v)!);

                const suggestedXs: number[] = [];
                for (const v of layer) {
                    const neighborsX: number[] = [];

                    for (const e of graph.getIncomingEdges(v)) {
                        const src = e.getSource();
                        const x = prevXMap.get(src);
                        if (x !== undefined) neighborsX.push(x);
                    }
                    for (const e of graph.getOutgoingEdges(v)) {
                        const tgt = e.getTarget();
                        const x = prevXMap.get(tgt);
                        if (x !== undefined) neighborsX.push(x);
                    }

                    if (neighborsX.length === 0) {
                        suggestedXs.push(prevXMap.get(v)!);
                    } else {
                        const sum = neighborsX.reduce((acc, val) => acc + val, 0);
                        suggestedXs.push(sum / neighborsX.length);
                    }
                }

                // Enforce ordering and spacing: x[j] >= x[j-1] + minXSpacing.
                let newXs: number[] = new Array(layer.length);
                newXs[0] = suggestedXs[0];
                for (let j = 1; j < layer.length; j++) {
                    newXs[j] = Math.max(suggestedXs[j], newXs[j - 1] + minXSpacing);
                }

                // Keep layer centered (reduce global drift across iterations).
                const initialMean = initialXs.reduce((acc, val) => acc + val, 0) / initialXs.length;
                const newMean = newXs.reduce((acc, val) => acc + val, 0) / newXs.length;
                const delta = initialMean - newMean;
                newXs = newXs.map(x => x + delta);

                // Snap to grid and re-enforce spacing after snapping.
                newXs[0] = snap(newXs[0]);
                for (let j = 1; j < layer.length; j++) {
                    const snapped = snap(newXs[j]);
                    newXs[j] = Math.max(snapped, newXs[j - 1] + minXSpacing);
                }

                for (let j = 0; j < layer.length; j++) {
                    xMap.set(layer[j], newXs[j]);
                }
            }
        }

        const packed = new Map<IVertex, Coord>();
        for (const [v, c] of coordMap.entries()) {
            packed.set(v, { x: xMap.get(v)!, y: c.y });
        }
        return packed;
    }
}

