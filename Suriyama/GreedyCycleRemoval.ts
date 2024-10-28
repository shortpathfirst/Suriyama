import { copyGraph } from "../GraphUtils.js";

export class GreedyCycleRemoval{

    private graphCopy:IGraph;
    constructor(private graph:IGraph){
        this.graphCopy = copyGraph(graph);
    }
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
        for(let edge of this.graph.getEdges()){
            let s = edge.getSource();
            let t = edge.getTarget();
            if(vertexOrder.indexOf(s) > vertexOrder.indexOf(t)){
                lewardEdges.push(edge);
            }
        }
        // Invert Edges
        for(let edge of lewardEdges){
            this.graph.invertEdge(edge);
        }
        return lewardEdges;
    }
    private findGreedyOrder(){
        //Initialize both Sl and Sr to be empty lists
        let Sl = [];
        let Sr = [];
        let isEmpty = () => this.graphCopy.getVertices().length === 0;
        while(!isEmpty()){
            //(a) 
            while(this.graphCopy.getSink()){
                let sink = this.graphCopy.getSink();
                this.graphCopy.removeNode(sink);
                Sr.unshift(sink);
                // console.log("Removed sink:",sink.getId())
            }
            //(b)
            while(this.graphCopy.getSource()){
                let source = this.graphCopy.getSource();
                this.graphCopy.removeNode(source);
                Sl.push(source);
                // console.log("Removed source:",source.getId())
            }
            //(c)
            if( this.graphCopy.getVertices().length === 0)
                break;
            

            let maxDegreeDiff = -1;
            let maxDegreeNode;
            let {inDegree,outDegree} = this.graphCopy.findInOutDegree()
            for(let node of this.graphCopy.getVertices()){
                let difference = 0;
                if(outDegree.get(node) && inDegree.get(node))
                    difference = outDegree.get(node)! - inDegree.get(node)!;
                if(difference > maxDegreeDiff){
                    maxDegreeNode = node;
                }
            }
            if(maxDegreeNode){
                this.graphCopy.removeNode(maxDegreeNode);
                // console.log("Removed maxDegree:",maxDegreeNode.getId())
                Sl.push(maxDegreeNode);
            }
        }
        return Sl.concat(Sr);
    }
}