import { type IVertex } from "../Graph/interface/IVertex";

export class CoordinateAssignment {
    private _ySpacing = 100;
    private _xSpacing = 100;

    assignCoord(layers: IVertex[][]) {

        let map = new Map<IVertex, { x: number, y: number }>();

        let maxLayer = Math.max(...layers.map(l => l.length));

        for (let i = 0; i < layers.length; i++) {
            const dx = (maxLayer * this._xSpacing) / layers[i].length;

            let x = dx / 2;
            let y = i * this._ySpacing;

            for (let v of layers[i]) {
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