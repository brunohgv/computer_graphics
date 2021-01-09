let viewport = document.getElementById('viewport')
let ctx = viewport.getContext('2d')

const PIXEL_SIZE = 1

const width = viewport.width / PIXEL_SIZE
const height = viewport.height / PIXEL_SIZE

let canvas = new Canvas(ctx, PIXEL_SIZE)

function rasterizeTriangle(po0, po1, po2) {
    if (po0 === po1 || po1 === po2 || po2 === po0) {
        throw new Error('This is not a triangle')
    }
    let sorted = [po0, po1, po2].sort(sortByYThenX)
    
    let p0 = sorted[0]
    let p1 = sorted[1]
    let p2 = sorted[2]

    let verticesPoints = []
    verticesPoints.push(...getLinePoints(p0, p1))
    verticesPoints.push(...getLinePoints(p0, p2))
    verticesPoints.push(...getLinePoints(p1, p2))

    let uniqueVertices = Array.from(new Set(verticesPoints))
    let pointMatches = matchPointsSameLine(uniqueVertices)

    fillTriangle(pointMatches)
}

function sortByYThenX(p0, p1) {
    if (p0.y < p1.y) return -1
    if (p0.y > p1.y) return 1
    if (p0.y === p1.y) {
        if(p0.x < p1.x) return -1
        if(p0.x > p1.x) return 1
    }
}

function getLinePoints(p0, p1) {
    if (p0.y < p1.y) {
        return getLinePointsOrdered(p0, p1)
    } else {
        return getLinePointsOrdered(p1, p0)
    }
}

function getLinePointsOrdered(p0, p1) {
    let points = []
    let deltax = p1.x - p0.x
    let deltay = p1.y - p0.y
    for(let y = p0.y ; y < p1.y ; y++) {
        let x = Math.round((deltax/deltay) * (y - p0.y) + p0.x)
        points.push({x, y})
        canvas.draw(x, y)
    }
    return points
}

function matchPointsSameLine(points) {
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

function fillTriangle(matchedPoints) {
    matchedPoints.forEach(p => {
        if(p.length === 1) {
            canvas.draw(p[0], p[1])
        } else {
            let min = Math.min(p[0].x, p[1].x)
            let max = Math.max(p[0].x, p[1].x)
            for(let x = min ; x <= max ; x++) {
                canvas.draw(x, p[0].y)
            }
        }
    })
}

let p0 = {x: 10, y: 50}
let p1 = {x: 40, y: 10}
let p2 = {x: 50, y: 60}

rasterizeTriangle(p0, p1, p2)

p0 = {x: 250, y: 50}
p1 = {x: 750, y: 500}
p2 = {x: 1000, y: 250}

rasterizeTriangle(p0, p1, p2)

