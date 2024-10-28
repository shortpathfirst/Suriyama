    //DIRECTED GRAPH
    
export class Graph implements IGraph{

    private vertices = new Set<IVertex>();
    private edges = new Set<IEdge>();
    private incidentEdges = new Map<IVertex,IEdge[]>(); // Adjacenty list

    getVertices(): IVertex[] {
        return Array.from(this.vertices.values());
    }
    getEdges(): IEdge[] {
        return Array.from(this.edges.values());
    }
    getDegreeOf(v: IVertex): number {
        let edgeList = this.incidentEdges.get(v);
        return edgeList?edgeList.length:0;
    }
    getIncidentEdgesOf(v1: IVertex): IEdge[] {
        return this.incidentEdges.get(v1)!;
    }

    getEdgeOf(v1:IVertex,v2:IVertex):IEdge{
        let edges = this.getIncidentEdgesOf(v1);
        for(let edg of edges){
            if(edg.getSource().getId() == v2.getId() || edg.getTarget().getId() == v2.getId()){
                return edg;
            }
        }
        return undefined!;
    }
    getAdjacentsOf(v1: IVertex): IVertex[] {
        let list:IVertex[] = [];
        let edges = this.getIncidentEdgesOf(v1);
        if(edges)
        for(let edg of edges){
            list.push(edg.getOpposite(v1));
        }
        return list;
    }
    areAdjacents(v1: IVertex, v2: IVertex): boolean {
        return this.getAdjacentsOf(v1).includes(v2);
    }
    addNode(v1: IVertex): void {
        if(!this.vertices.has(v1)){
            this.vertices.add(v1);
            this.incidentEdges.set(v1,[]);
        }
    }
    addEdge(e1: IEdge): void {
        let s = e1.getSource();
        let t = e1.getTarget();
        this.edges.add(e1);
        this.incidentEdges.get(s)!.push(e1);
        // this.incidentEdges.get(t)!.push(e1);
    }
    removeNode(v1: IVertex): void {
        this.vertices.delete(v1);
        let edgs = this.getIncidentEdgesOf(v1);
        // Outgoing edges
        for(let edg of edgs){
            this.removeEdge(edg);
        }
        // Ingoing Edges
        for(let edge of this.edges){
            if(edge.getTarget().getId() == v1.getId()){
                this.removeEdge(edge);
            }
        }
    }
    removeEdge(e1: IEdge): void {
        this.edges.delete(e1);
        let newE1 = this.incidentEdges.get(e1.getSource())?.filter((e)=>{return e.getId()!=e1.getId()})!;
        this.incidentEdges.set(e1.getSource(),newE1);
    }
    bfsVisit(v1: IVertex): IVertex[] {
        const visited = new Set(); 
        const queue  = [v1];
        const list = new Set<IVertex>();

        while(queue.length > 0) {
    
            const v = queue.shift()!;
            const destinations = this.getAdjacentsOf(v);
            list.add(v);
            for(const vertex of destinations){
    
                if(!visited.has(vertex)){
                    visited.add(vertex);
                    queue.push(vertex);
                }
            }
        }
        return Array.from(list.values());
    }
    dfsVisit(v1: IVertex): IVertex[] {
        let visitedList:IVertex[] = [];
        this.DFS(visitedList,v1);
        return visitedList;
    }
    private DFS(list:IVertex[],v:IVertex){
        list.push(v);
        const destinations = this.getAdjacentsOf(v);
        for(const vertex of destinations){
    
            if(!list.includes(vertex)){
                this.DFS(list,vertex);
            }
        }
    }
    /**
     * Implementation with DFS TRAVERSAL
     * or
     * Kahn’s algorithm using topological sorting,
     * 
     * We use DFS here but both O(V+E)
     * @returns True if there's a Cycle, False otherwise
     */
    isCyclic(): boolean {

        let visitedList =  new Map<IVertex,boolean>();
        let restack =  new Map<IVertex,boolean>();

        this.vertices.forEach(vertex=>{
            visitedList.set(vertex,false);
            restack.set(vertex,false);
        });

        let isCyclic = false;
        this.vertices.forEach(vertex=>{
  
            if(this.isCyclicDFS(vertex,visitedList,restack,undefined!)){
                isCyclic = true;
            }
            
        });
       
        return isCyclic;
    }

    private isCyclicDFS(v:IVertex,restack:Map<IVertex, boolean>,visited:Map<IVertex, boolean>,parent:IVertex):boolean{
        visited.set(v,true);
        restack.set(v,true);

        const destinations = this.getAdjacentsOf(v);

        for(const vertex of destinations){
            
            if(visited.get(vertex)==false){
                if(this.isCyclicDFS(vertex, restack,visited, v) == true){
                    return true;
                }
            }
            else if(restack.get(vertex)){ //If vertex is visited it's cycle
                return true;
            }
        }
        restack.set(v,false);
       return false;
    }
    /**
     * 
     * @returns 0:inDegree, 1:outDegree
     */
    findInOutDegree():{inDegree:Map<IVertex,number>,outDegree:Map<IVertex,number>}{
        //Time Complexity: O(V + E)
        let inDegree = new Map<IVertex,number>();
        let outDegree = new Map<IVertex,number>();
        
        //Initialize 
        this.vertices.forEach((v)=>{
            inDegree.set(v,0);
            outDegree.set(v,0);

        })
        this.vertices.forEach(
            (v)=>{
                outDegree.set(v,this.getDegreeOf(v))

                for(let adj of this.getAdjacentsOf(v)){
                    let degree = inDegree.get(adj)!;
                    inDegree.set(adj,degree+1);
                }
            });

        
        return {inDegree:inDegree,outDegree:outDegree};
    }
    isSource(v:IVertex){
        return this.findInOutDegree().inDegree.get(v) === 0;
    }
    isSink(v:IVertex){
        return this.getDegreeOf(v) === 0;
    }
    getSink(){
        let mapOutDeg = this.findInOutDegree().outDegree.entries();
        for(let [key,value] of mapOutDeg){
            if(value === 0){
                return key;
            }
        }
        return undefined!;
    }
    getSource(){
        let mapInDeg = this.findInOutDegree().inDegree.entries();
        for(let [key,value] of mapInDeg){
            if(value === 0){
                return key;
            }
        }
        return undefined!;
    }
    getAllSinks(){
        let sinks = [];

        let mapOutDeg = this.findInOutDegree().outDegree.entries();

        for(let [key,value] of mapOutDeg){
            if(value === 0){
               sinks.push(key);
            }
        }
        return sinks;
    }
    invertEdge(edge:IEdge){
        this.removeEdge(edge);
        edge.invertSourceTarget();
        this.addEdge(edge);
    }

}
