class Canvas {
    constructor(context, pixelSize) {
        this.ctx = context
        this.pixelSize = pixelSize
    }

    draw(x,y) {
        this.ctx.fillRect(x*this.pixelSize, y*this.pixelSize, this.pixelSize, this.pixelSize);
    }

    erase() {
        var activeStyle = this.ctx.fillStyle
        this.ctx.fillStyle = '#000'
        for(let i = 0 ; i < width ; i++) {
            for(let j = 0 ; j < height ; j++) {
                this.draw(i,j)
            }   
        }
        this.ctx.fillStyle = activeStyle
    }

    setColor(color) {
        this.ctx.fillStyle = color;
    }
}