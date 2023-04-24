const canv = document.getElementById('canv')
const btnSpwn = document.getElementById('spawn')
const ctx = canv.getContext('2d');
const tick = 1000 / 20 // fps
const itemSize = 40
const fieldDimensions = {
    w : 640,
    h: 480
}
let canvItems = []
let gameOn = true

class Circle
{
    constructor({x, y, d, color}){
        this.x = x
        this.y = y
        this.r = d / 2
        this.color = color
    }

    containsPoint = (sx, sy) => {
        return (sx - this.x) * (sx - this.x) + (sy - this.y) * (sy - this.y) < (this.r * this.r)
    }

    paint = (c) => {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
        c.fillStyle = this.color
        c.fill()
    }
}

const getRandomCords = () => {
    return {
        x : Math.floor(Math.random() * (fieldDimensions.w - 2 * itemSize) + itemSize),
        y : Math.floor(Math.random() * (fieldDimensions.h - 2 * itemSize) + itemSize)
    }
}

const paint = () => {
    ctx.clearRect(0, 0, fieldDimensions.w, fieldDimensions.h)
    canvItems.forEach((i) => i.paint(ctx))
    console.log('paint')
}

const gameLoop = () => {
    // Maybe movement and some cleaning here?
    paint()
    if(gameOn){
        setTimeout(
            () => gameLoop(),
            tick
        )
    }
}
gameLoop()


btnSpwn.addEventListener('click', (e) => {
    console.log('add circle')
    const crds = getRandomCords()
    canvItems.push(
        new Circle({
            ...crds,
            d: itemSize ,
            color: 'rbg(0,0,0)'
        })
    )
})

canv.addEventListener('click', (e) => {
    console.log('clicked! Did I catch a ball?')
})
