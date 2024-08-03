export class CoordinateAssignment {
    constructor() {
        this._ySpacing = 100;
        this._xSpacing = 100;
    }
    assignCoord(layers) {
        let maxLayer = 0;
        for (let layer of layers) {
            if (layer.length > maxLayer)
                maxLayer = layer.length;
        }
        let map = new Map();
        for (let i = 0; i < layers.length; i++) {
            let dx = maxLayer * this._xSpacing / layers[i].length;
            let x = dx / 2;
            let y = i * this._ySpacing;
            for (let j = 0; j < layers[i].length; j++) {
                map.set(layers[i][j], { x: x, y: y });
                x += dx;
            }
            // let x = 0;
            // let y = i * this.ySpacing;
            // for(let vertex of layers[i]){
            //     x+=this.xSpacing;
            //     map.set(vertex,{x:x,y:y});
            // }
        }
        return map;
    }
    set ySpacing(value) {
        this.ySpacing = value;
    }
    set xSpacing(value) {
        this.xSpacing = value;
    }
}
//# sourceMappingURL=CoordinatesAssignment.js.map