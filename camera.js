

class Camera {
    constructor({C, N, V, d, hx, hy}) {
        this.C = C
        this.N = N
        this.V = V
        this.d = d
        this.hx = hx
        this.hy = hy
    }

    ortogonalize(V, N) {
        let p1 = V.map((value, index) => {
            return value * N[index]
        }).reduce((a, b) => a + b)
    
        let p2 = N.map(value => Math.pow(value, 2)).reduce((a, b) =>  a + b)
    
        let p3 = p1/p2
    
        let p4 = N.map(value => value*p3)
    
        return V.map((value, index) => value - p4[index])
    }
    
    vetorialProduct(A, B) {
        let i = (A[1] * B[2]) - (A[2] * B[1])
        let j = (A[2] * B[0]) - (A[0] * B[2])
        let k = (A[0] * B[1]) - (A[1] * B[0])
        return [i,j,k]
    }
    
    normalize(Value) {
        let i = Math.pow(Value[0], 2)
        let j = Math.pow(Value[1], 2)
        let k = Math.pow(Value[2], 2)
        return Math.sqrt(i + j + k)
    }
    
    calculateBaseChangeMatrix(V, N) {
        let VLine = this.ortogonalize(V, N)
        let U = this.vetorialProduct(VLine, N)
        let normVLine = this.normalize(VLine)
        let normN = this.normalize(N)
        let normU = this.normalize(U)
        let normalizedVline = this.multiplyVector(VLine, normVLine)
        let normalizedN = this.multiplyVector(N, normN)
        let normalizedU = this.multiplyVector(U, normU)
    
        return [normalizedU, normalizedVline, normalizedN]
    }
    
    multiplyVector(vector, value) {
        return vector.map(v => v*value)
    }
    
    multiplyViewMatrix(projMatrix, transposedCoordinates) {
        let viewCoordinates = []
        projMatrix.forEach(row => {
            let result = 0
            row.forEach((column, columnIndex) => {
                result += column * transposedCoordinates[columnIndex]
            })
            viewCoordinates.push(result)
        });
        return viewCoordinates
    }
   
    calculateViewCoordinates(globalCoordinates) {
        let transposed = globalCoordinates.map((value, index) => value - this.C[index])
        // console.log('tansposed: ', transposed)
        let projectionMatrix = this.calculateBaseChangeMatrix(this.V, this.N)
        // console.log('projectionMatrix: ', projectionMatrix)
        let viewCoordinates = this.multiplyViewMatrix(projectionMatrix, transposed)
        // console.log('view cooordinates: ', viewCoordinates)
        return viewCoordinates
    }

    calculatePointViewCoordinates(globalCoordinates) {
        let viewCoords = this.calculateViewCoordinates(globalCoordinates)
        let roundedPixels = viewCoords.map(value => Math.round(value))
        let coordinates = {
            x: roundedPixels[0],
            y: roundedPixels[1],
            z: roundedPixels[2]
        }
        return coordinates
    }

    calculateScreenCoordinates(globalCoordinates, w, h) {
        let viewCoordinates = this.calculateViewCoordinates(globalCoordinates)
        // console.log("view coords: ", viewCoordinates)
        let projectionX = this.d * viewCoordinates[0] / viewCoordinates[2]
        let projectionY = this.d * viewCoordinates[1] / viewCoordinates[2]
        // console.log("Projx:", projectionX)
        // console.log("Projy:", projectionY)
        let normalizedX = projectionX / this.hx
        let normalizedY = projectionY / this.hy
        // console.log(normalizedX, normalizedY)

        let screenX = Math.round(((normalizedX + 1) / 2) * w)
        let screenY = Math.round(h - (((normalizedY + 1) / 2) * h))

        return {
            x: screenX,
            y: screenY
        }

    }
}


// let camera = new Camera({
//     C: [1, 1, 2],
//     N: [-1, -1, -1],
//     V: [0, 0, 1],
//     d: 1,
//     hx: 1,
//     hy: 1
// })

// camera.calculateViewCoordinates([1, -3, -5])