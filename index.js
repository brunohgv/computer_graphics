let viewport = document.getElementById('viewport')
let ctx = viewport.getContext('2d')

const PIXEL_SIZE = 1

const width = viewport.width / PIXEL_SIZE
const height = viewport.height / PIXEL_SIZE

let canvas = new Canvas(ctx, PIXEL_SIZE)
let rasterizer = new Rasterizer(canvas)

let camera = new Camera({
    C: [1, 1, 2],
    N: [-1, -1, -1],
    V: [0, 0, 1],
    d: 1,
    hx: 1,
    hy: 1
})


// let p0 = {x: 10, y: 50, z: 0}
// let p1 = {x: 40, y: 10, z: 0}
// let p2 = {x: 50, y: 60, z: 0}

// rasterizer.rasterizeTriangle(viewPoint0, viewPoint1, viewPoint2)
// rasterizer.rasterizeTriangle(p0, p1, p2)

p0 = {x: 25, y: -5, z: 200}
p1 = {x: 75, y: -60, z: 200}
p2 = {x: 100, y: 25, z: 200}

let viewPoint0 = camera.calculatePointViewCoordinates([p0.x, p0.y, p0.z])
let viewPoint1 = camera.calculatePointViewCoordinates([p1.x, p1.y, p1.z])
let viewPoint2 = camera.calculatePointViewCoordinates([p2.x, p2.y, p2.z])

console.log(viewPoint0, viewPoint1, viewPoint2)
// rasterizer.rasterizeTriangle(p0, p1, p2)
rasterizer.rasterizeTriangle(viewPoint0, viewPoint1, viewPoint2)

