export class Edge {
    static updateNextID() {
        return this.nextID++;
    }
    constructor(source, target) {
        this.id = Edge.updateNextID();
        this.source = source;
        this.target = target;
        this.weight = 0;
    }
    getOpposite(v1) {
        if (this.source == v1) {
            return this.target;
        }
        else {
            return this.target == v1 ? this.source : null;
        }
    }
    getId() {
        return this.id;
    }
    getSource() {
        return this.source;
    }
    getTarget() {
        return this.target;
    }
    getWeight() {
        return this.weight;
    }
    setWeight(value) {
        this.weight = value;
    }
    invertSourceTarget() {
        let target = this.target;
        this.target = this.source;
        this.source = target;
    }
}
Edge.nextID = 0;
//# sourceMappingURL=Edge.js.map