 export class Node {
    constructor(row, col, isWall, aStar) {
        this.row = row
        this.column = col
        this.wall = isWall
        this.g = 1
        this.f = Infinity
        this.h = Infinity
        this.difficultySums = ''
        this.medium = ''
        this.aStar = aStar
        this.children = []
    }

    calculateFValue(node) {
        this.h = this.aStar.calculateHValue(this)
        let diffs = this.g + Number(node.difficultySums)
        if (this.difficultySums === '' || this.difficultySums > diffs) {
            this.difficultySums = diffs
            this.medium = node
        }
        return this.f = this.h + Number(this.difficultySums)

    }

    childrenCalculation(yetToVisitList) {
        let children = []
        let excludedNode, newNode
        //UP
        if (this.row < this.aStar.grid.length - 1) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row + 1 && node.column === this.column))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row + 1 && node.column === this.column))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //RIGHT
        if (this.column < this.aStar.grid[0].length - 1) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row && node.column === this.column + 1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row && node.column === this.column + 1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //UP-RIGHT
        if (this.column < this.aStar.grid[0].length - 1&&this.row<this.aStar.grid.length - 1) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row+1 && node.column === this.column + 1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row+1 && node.column === this.column + 1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //UP-LEFT
        if (this.column >0 &&this.row>0) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row-1 && node.column === this.column - 1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row-1 && node.column === this.column - 1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //DOWN_RIGHT
        if (this.column < this.aStar.grid[0].length - 1&&this.row>0) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row-1 && node.column === this.column + 1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row-1 && node.column === this.column + 1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //DOWN-LEFT
        if (this.column >0 &&this.row<this.aStar.grid.length - 1) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row+1 && node.column === this.column -1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row+1 && node.column === this.column -1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //DOWN
        if (this.row > 0) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row - 1 && node.column === this.column))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row - 1 && node.column === this.column))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        //LEFT
        if (this.column > 0) {
            excludedNode = yetToVisitList.find(node => (node.row === this.row && node.column === this.column - 1))
            if (!excludedNode) {
                newNode = this.aStar.nodes.find(node => (node.row === this.row && node.column === this.column - 1))
                if (newNode.wall === false && !this.aStar.visited.includes(newNode) && !this.aStar.yetToVisitList.includes(newNode)) {
                    newNode.calculateFValue(this)
                    children.push(newNode)
                }
            } else {
                excludedNode.calculateFValue(this)
            }
        }
        return children
    }
}
