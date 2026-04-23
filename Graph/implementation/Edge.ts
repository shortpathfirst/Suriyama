import { IEdge } from "../interface/IEdge";
import { IVertex } from "../interface/IVertex";


export class Edge implements IEdge{
    
    private static nextID = 0;
    private id:number;
    private source:IVertex;
    private target:IVertex;
    private weight:number;

    private static updateNextID(){
        return this.nextID++;
    }

    constructor(source:IVertex,target:IVertex ){
        this.id = Edge.updateNextID();
        this.source = source;
        this.target = target;
        this.weight = 0;
    }
    getOpposite(v1: IVertex):IVertex | null {
        if (this.source == v1) {
            return this.target;
         } else {
            return this.target == v1 ? this.source : null;
         }
    }
    
    getId(): number {
        return this.id;
    }
    getSource(): IVertex {
        return this.source;
    }
    getTarget(): IVertex {
        return this.target;
    }
    getWeight(): number {
        return this.weight;
    }
    setWeight(value: number): void {
        this.weight = value;
    }
    invertSourceTarget(){
        let target = this.target;
        this.target = this.source;
        this.source = target;
    }
}