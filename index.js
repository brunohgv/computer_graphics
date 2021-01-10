let viewport = document.getElementById('viewport')
let ctx = viewport.getContext('2d')

const PIXEL_SIZE = 1

const width = viewport.width / PIXEL_SIZE
const height = viewport.height / PIXEL_SIZE

let canvas = new Canvas(ctx, PIXEL_SIZE)
let rasterizer = new Rasterizer(canvas)

let camera = new Camera({
    C: [0, -500, 500],
    N: [0, 1, -1],
    V: [0, -1, -1],
    d: 5,
    hx: 2,
    hy: 2
})

canvas.setColor('#FFF')
canvas.erase()

let fileData = null;

function readFile(input) {
    let f = input.files[0]
    let reader = new FileReader()
    reader.readAsText(f)
    reader.onload = function () {
        fileData = reader.result
        // console.log(fileData)
    }
    reader.onerror = function () {
        console.error(reader.error)
    }
}

function processFileData() {
    canvas.erase()
    const fileRows = fileData.split('\n')
    const fileRowsWithColumns = fileRows.map(row => row.split(' '))
    // console.log(fileRowsWithColumns)
    let header = fileRowsWithColumns[0]
    let numberOfVertices = Number(header[0])
    let numberOfTriangles = Number(header[1])
    let verticesMap = new Map()
    for(let i = 1 ; i < numberOfVertices + 1 ; i++) {
        let x = Number(fileRowsWithColumns[i][0])
        let y = Number(fileRowsWithColumns[i][1])
        let z = Number(fileRowsWithColumns[i][2])
        var screenVertice = camera.calculateScreenCoordinates([x,y,z], width, height)
        console.log(screenVertice)
        verticesMap.set(i, screenVertice)
    }

    for(let i = numberOfVertices + 1 ; i < numberOfVertices + numberOfTriangles + 1 ; i++) {
        let indexP0 = Number(fileRowsWithColumns[i][0])
        let indexP1 = Number(fileRowsWithColumns[i][1])
        let indexP2 = Number(fileRowsWithColumns[i][2])

        let p0 = verticesMap.get(indexP0)
        let p1 = verticesMap.get(indexP1)
        let p2 = verticesMap.get(indexP2)
        rasterizer.rasterizeTriangle(p0, p1, p2)
        // console.log(i, p0, p1, p2)
    }
}

// let p0 = {x: 10, y: 50, z: 0}
// let p1 = {x: 40, y: 10, z: 0}
// let p2 = {x: 50, y: 60, z: 0}

// rasterizer.rasterizeTriangle(viewPoint0, viewPoint1, viewPoint2)
// rasterizer.rasterizeTriangle(p0, p1, p2)

// p0 = {x: 25, y: -5, z: 200}
// p1 = {x: 75, y: -60, z: 200}
// p2 = {x: 100, y: 25, z: 200}

// let screenPoint0 = camera.calculateScreenCoordinates([p0.x, p0.y, p0.z], width, height)
// let screenPoint1 = camera.calculateScreenCoordinates([p1.x, p1.y, p1.z], width, height)
// let screenPoint2 = camera.calculateScreenCoordinates([p2.x, p2.y, p2.z], width, height)

// console.log(screenPoint0, screenPoint1, screenPoint2)
// // rasterizer.rasterizeTriangle(p0, p1, p2)
// rasterizer.rasterizeTriangle(screenPoint0, screenPoint1, screenPoint2)

