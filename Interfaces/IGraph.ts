interface IGraph{
    getVertices():IVertex[];
    
    getEdges():IEdge[];

    getDegreeOf(v:IVertex):number;

    getIncidentEdgesOf(v1:IVertex):IEdge[];

    getEdgeOf(v1:IVertex,v2:IVertex):IEdge;//new

    getAdjacentsOf(v1:IVertex):IVertex[];

    areAdjacents(v1:IVertex, v2:IVertex):boolean;
 
    addNode(v1:IVertex):void;
 
    addEdge(e1:IEdge):void;
 
    removeNode(v1:IVertex):void;
 
    removeEdge(e1:IEdge):void;
 
    bfsVisit(v1:IVertex):IVertex[];
 
    dfsVisit(v1:IVertex):IVertex[];

    isCyclic():boolean;
    
    //Helper
    findInOutDegree():{inDegree:Map<IVertex,number>,outDegree:Map<IVertex,number>};
    isSource(v:IVertex):boolean;
    isSink(v:IVertex):boolean;
    getSink():IVertex;
    getSource():IVertex;
    getAllSinks():IVertex[];
    invertEdge(edge:IEdge):void;

}