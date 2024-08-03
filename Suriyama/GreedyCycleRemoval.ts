export class GreedyCycleRemoval{

    constructor(private graph:IGraph,private graphCopy:IGraph){}
    /**
     * Remove cycle by inverting some edges with greedy tecnique by Eads
     * @returns The inverted edges
     */
    removeCycle(){
        return this.invertLewardEdges();
    }

    private invertLewardEdges(){
        
        let vertexOrder = this.findGreedyOrder();
        let lewardEdges = [];
        for(let edge of this.graphCopy.getEdges()){
            let s = edge.getSource();
            let t = edge.getTarget();
            if(vertexOrder.indexOf(s) > vertexOrder.indexOf(t)){
                lewardEdges.push(edge);
            }
        }
        // Invert Edges
        for(let edge of lewardEdges){
            edge.invertSourceTarget();
        }
        return lewardEdges;
    }
    private findGreedyOrder(){
        //Initialize both Sl and Sr to be empty lists
        let Sl = [];
        let Sr = [];
        let isEmpty = () => this.graph.getVertices().length === 0;
        while(!isEmpty()){
            //(a) 
            while(this.graph.getSink()){
                let sink = this.graph.getSink();
                this.graph.removeNode(sink);
                Sr.unshift(sink);
                // console.log("Removed sink:",sink.getId())
            }
            //(b)
            while(this.graph.getSource()){
                let source = this.graph.getSource();
                this.graph.removeNode(source);
                Sl.push(source);
                // console.log("Removed source:",source.getId())
            }
            //(c)
            if( this.graph.getVertices().length === 0)
                break;
            

            let maxDegreeDiff = -1;
            let maxDegreeNode;
            let {inDegree,outDegree} = this.graph.findInOutDegree()
            for(let node of this.graph.getVertices()){
                let difference = 0;
                if(outDegree.get(node) && inDegree.get(node))
                    difference = outDegree.get(node)! - inDegree.get(node)!;
                if(difference > maxDegreeDiff){
                    maxDegreeNode = node;
                }
            }
            if(maxDegreeNode){
                this.graph.removeNode(maxDegreeNode);
                // console.log("Removed maxDegree:",maxDegreeNode.getId())
                Sl.push(maxDegreeNode);
            }
        }
        return Sl.concat(Sr);
    }
}