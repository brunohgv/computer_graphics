class Rasterizer {

    constructor(canvas) {
        this.canvas = canvas
    }

    rasterizeTriangle(po0, po1, po2) {
        if (po0 === po1 || po1 === po2 || po2 === po0) {
            // console.log(po0, po1, po2)
            throw new Error('This is not a triangle')
        }
        let sorted = [po0, po1, po2].sort(this.sortByYThenX)
        
        let p0 = sorted[0]
        let p1 = sorted[1]
        let p2 = sorted[2]
    
        let verticesPoints = []
        verticesPoints.push(...this.getLinePoints(p0, p1))
        verticesPoints.push(...this.getLinePoints(p0, p2))
        verticesPoints.push(...this.getLinePoints(p1, p2))
    
        let uniqueVertices = Array.from(new Set(verticesPoints))
        let pointMatches = this.matchPointsSameLine(uniqueVertices)
    
        this.fillTriangle(pointMatches)
    }
    
    sortByYThenX(p0, p1) {
        if (p0.y < p1.y) return -1
        if (p0.y > p1.y) return 1
        if (p0.y === p1.y) {
            if(p0.x < p1.x) return -1
            if(p0.x > p1.x) return 1
        }
    }
    
    getLinePoints(p0, p1) {
        // console.log(p0, p1)
        if (p0.y < p1.y) {
            return this.getLinePointsOrdered(p0, p1)
        } else {
            return this.getLinePointsOrdered(p1, p0)
        }
    }
    
    getLinePointsOrdered(p0, p1) {
        let points = []
        let deltax = p1.x - p0.x
        let deltay = p1.y - p0.y
        for(let y = p0.y ; y < p1.y ; y++) {
            let x = Math.round((deltax/deltay) * (y - p0.y) + p0.x)
            points.push({x, y})
            this.canvas.draw(x, y)
        }
        return points
    }
    
    matchPointsSameLine(points) {
        let minY = Math.min(...points.map(p => p.y))
        let maxY = Math.max(...points.map(p => p.y))
    
        let matches = []
        for(let y = minY; y < maxY ; y++) {
            let xPoints = []
            xPoints.push(...points.filter(p => p.y === y))
            matches.push(xPoints)
        }
        return matches
    }
    
    fillTriangle(matchedPoints) {
        matchedPoints.forEach(p => {
            if(p.length === 1) {
                this.canvas.draw(p[0], p[1])
            } else {
                let min = Math.min(p[0].x, p[1].x)
                let max = Math.max(p[0].x, p[1].x)
                for(let x = min ; x <= max ; x++) {
                    this.canvas.draw(x, p[0].y)
                }
            }
        })
    }
}
    
