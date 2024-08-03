export class Vertex {
    static updateNextID() {
        return this.nextID++;
    }
    constructor() {
        this.id = Vertex.updateNextID();
        this.label = "";
        this.weight = 0;
    }
    getId() {
        return this.id;
    }
    getWeight() {
        return this.weight;
    }
    setWeight(value) {
        this.weight = value;
    }
    getLabel() {
        return this.label;
    }
    setLabel(value) {
        this.label = value;
    }
}
Vertex.nextID = 0;
//# sourceMappingURL=Vertex.js.map