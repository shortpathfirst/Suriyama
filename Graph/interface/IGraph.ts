import { IEdge } from "./IEdge";
import { IVertex } from "./IVertex";

export interface IGraph {
    getVertices(): IVertex[];
    getEdges(): IEdge[];
    getOutDegree(v: IVertex): number
    getIncidentEdgesOf(v1: IVertex): IEdge[];
    getEdgeOf(v1: IVertex, v2: IVertex): IEdge;
    getAdjacentsOf(v1: IVertex): IVertex[];
    areAdjacents(v1: IVertex, v2: IVertex): boolean;
    addNode(v1: IVertex): void;
    addEdge(e1: IEdge): void;
    removeNode(v1: IVertex): void;
    removeEdge(e1: IEdge): void;
    //Traversal
    bfsVisit(v1: IVertex): IVertex[];
    dfsVisit(v1: IVertex): IVertex[];
    // Cycles utils
    isCyclic(): boolean;
    findInOutDegree(): { inDegree: Map<IVertex, number>, outDegree: Map<IVertex, number> };
    isSource(v: IVertex): boolean;
    isSink(v: IVertex): boolean;
    getSink(): IVertex | null;
    getSource(): IVertex | null;
    getAllSinks(): IVertex[];
    invertEdge(edge: IEdge): void;
    getIncomingEdges(v: IVertex): IEdge[];
    getOutgoingEdges(v: IVertex): IEdge[];
}