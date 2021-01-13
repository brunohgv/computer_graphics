let viewport = document.getElementById('viewport')
let ctx = viewport.getContext('2d')

const PIXEL_SIZE = 1

const width = viewport.width / PIXEL_SIZE
const height = viewport.height / PIXEL_SIZE

let canvas = new Canvas(ctx, PIXEL_SIZE)
let rasterizer = new Rasterizer(canvas)

function populateCameraWithDefaultValues() {
    document.getElementById('camera-cx').value = 0
    document.getElementById('camera-cy').value = -500
    document.getElementById('camera-cz').value = 500
    document.getElementById('camera-nx').value = 0
    document.getElementById('camera-ny').value = 1
    document.getElementById('camera-nz').value = -1
    document.getElementById('camera-vx').value = 0
    document.getElementById('camera-vy').value = -1
    document.getElementById('camera-vz').value = -1
    document.getElementById('camera-d').value = 5
    document.getElementById('camera-hx').value = 2
    document.getElementById('camera-hy').value = 2
}

function buildCameraFromUserParams() {
    let cx = parseInt(document.getElementById('camera-cx').value)
    let cy = parseInt(document.getElementById('camera-cy').value)
    let cz = parseInt(document.getElementById('camera-cz').value)
    let nx = parseInt(document.getElementById('camera-nx').value)
    let ny = parseInt(document.getElementById('camera-ny').value)
    let nz = parseInt(document.getElementById('camera-nz').value)
    let vx = parseInt(document.getElementById('camera-vx').value)
    let vy = parseInt(document.getElementById('camera-vy').value)
    let vz = parseInt(document.getElementById('camera-vz').value)
    let d =  parseInt(document.getElementById('camera-d').value)
    let hx = parseInt(document.getElementById('camera-hx').value)
    let hy = parseInt(document.getElementById('camera-hy').value)

    return new Camera({
        C: [cx, cy, cz],
        N: [nx, ny, nz],
        V: [vx, vy, vz],
        d: d,
        hx: hx,
        hy: hy
    })
}

canvas.setColor('#FFF')
canvas.erase()

let fileData = null;

function readFile(input) {
    let f = input.files[0]
    let reader = new FileReader()
    reader.readAsText(f)
    reader.onload = function () {
        fileData = reader.result
    }
    reader.onerror = function () {
        console.error(reader.error)
    }
}

function processFileData() {
    const camera = buildCameraFromUserParams()
    canvas.erase()
    const fileRows = fileData.split('\n')
    const fileRowsWithColumns = fileRows.map(row => row.split(' '))
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
    }
}
