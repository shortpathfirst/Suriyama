interface IEdge{
    getId():number;

    getSource():IVertex;
 
    getTarget():IVertex;
 
    // isDirected():boolean;
 
    getOpposite(v1:IVertex):IVertex;
 
    getWeight():number;
 
    setWeight(value:number):void;

    invertSourceTarget():void;
}