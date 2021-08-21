import {Node} from "./Node";
class AStar{
    constructor(start,end,grid) {
        this.grid = grid
        this.nodes = []

        for(let i =0;i<grid.length;i++){
            for(let j =0;j<grid[0].length;j++){
                if(i==start[0] && j==start[1]){
                    this.start = new Node(i,j,grid[i][j].wall,this)
                    this.nodes.push(this.start)
                }else if(i==end[0] && j==end[1]){
                    this.end = new Node(i, j, grid[i][j].wall, this)
                    this.nodes.push(this.end)
                }else {
                    this.nodes.push(new Node(i,j,grid[i][j].wall,this))
                }
            }
        }
        this.yetToVisitList = [this.start]
        this.visited = []
        this.path = []
    }
    calculateHValue(node){
        return Math.sqrt(Math.pow(Math.abs(node.row-this.end.row),2)+Math.pow(Math.abs(node.column-this.end.column),2))
    }
    startPathFinding(){
        this.yetToVisitList[0].calculateFValue(this.yetToVisitList[0])
        while(this.yetToVisitList.length>0){
            if(this.yetToVisitList[0]==this.end) break
            let children = this.yetToVisitList[0].childrenCalculation(this.yetToVisitList)
            let queue = this.yetToVisitList
            this.visited.push(queue.shift())
            let newQueue = queue.concat(children)
            let sortedNeighbours = newQueue.sort(function(a, b){return a.f - b.f})
            this.yetToVisitList = sortedNeighbours
        }
        if(this.yetToVisitList.length!=0){
            this.retrieveOptimalPath(this.yetToVisitList[0])
        }
    }
    retrieveOptimalPath(node){
        this.path.push(node)
        if(node.medium!==this.start){
            this.retrieveOptimalPath(node.medium)
        }else{
            this.path.push(this.start)
        }
    }

}
export default AStar