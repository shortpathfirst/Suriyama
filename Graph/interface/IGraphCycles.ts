import { IEdge } from "./IEdge";
import { IVertex } from "./IVertex";


export interface IGraphCycles {
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