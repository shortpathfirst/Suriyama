import { IVertex } from "./IVertex";

export interface IEdge{
    getId():number;
    getSource():IVertex;
    getTarget():IVertex;
    getOpposite(v1:IVertex):IVertex | null;
    getWeight():number;
    setWeight(value:number):void;
    invertSourceTarget():void;
}