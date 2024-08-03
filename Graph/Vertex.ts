export class Vertex implements IVertex{

    private static nextID = 0;
    private id:number;
    private weight:number;
    private label:string;

    private static updateNextID(){
        return this.nextID++;
    }

    constructor(){
        this.id = Vertex.updateNextID();
        this.label = "";
        this.weight = 0;
    }

    getId(): number {
        return this.id;
    }
    getWeight(): number {
        return this.weight;
    }
    setWeight(value: number) {
        this.weight = value;
    }
    getLabel(): string {
        return this.label;
    }
    setLabel(value: string): void {
        this.label = value;
    }
    
}