class Canvas {
    constructor(context, pixelSize) {
        this.ctx = context
        this.pixelSize = pixelSize
    }

    draw(x,y) {
        this.ctx.fillRect(x*this.pixelSize, y*this.pixelSize, this.pixelSize, this.pixelSize);
    }

    setColor(color) {
        this.ctx.fillStyle = color;
    }
}