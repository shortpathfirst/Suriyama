export class CoordinateAssignment {
    private _ySpacing = 100;
    private _xSpacing = 100;

    assignCoord(layers: IVertex[][]) {
        // Find the max
        let maxLayer = 0;
        for (let layer of layers) {
            if (layer.length > maxLayer)
                maxLayer = layer.length;
        }
        // let maxLayer = Math.max(...layers.map(l => l.length));

        let map = new Map<IVertex, { x: number, y: number }>();

        for (let i = 0; i < layers.length; i++) {

            const layer = layers[i];
            const dx = (maxLayer * this._xSpacing) / layer.length;

            let x = dx / 2;
            let y = i * this._ySpacing;

            for (let v of layer) {
                map.set(v, { x, y });
                x += dx;
            }
        }

        return map;
    }
    set ySpacing(value: number) {
        this._ySpacing = value;
    }
    set xSpacing(value: number) {
        this._xSpacing = value;
    }
}