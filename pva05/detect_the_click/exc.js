const canv = document.getElementById('canv')
const txtInf = document.getElementById('info')
const ctx = canv.getContext('2d');
const itemSize = 20
const fieldDimensions = {
    w : 640,
    h: 480
}
const canvItems = []

const colors = {
    turquise: 'rgb(142,222,192)',
    green: 'rgb(21,90,15)',
    red: 'rgb(168,22,33)',
    blue: 'rgb(12,42,151)',
    yellow: 'rgb(232,239,27)',
    orange: 'rgb(184,76,18)',
    black: 'rgb(0,0,0)',
    grey: 'rgb(141,141,141)',
}

/**
 * Create a random coordinate within the canvas
 * Take the itemSize (global, for simplicity) as padding from both x and y boundaries
 * @returns {{x: number, y: number}}
 */
const getRandomCords = () => {
    return {
        x : Math.floor(Math.random() * (fieldDimensions.w - 2 * itemSize) + itemSize),
        y : Math.floor(Math.random() * (fieldDimensions.h - 2 * itemSize) + itemSize)
    }
}

/**
 * Return a function which takes a canvas context as parameter
 * and draws a circle with the
 *  - center "x"/"y" and the
 *  - diameter "d" in
 *  - the color "color"
 *  on the given canvas
 */
const getCircleFunc = ({x, y, d, color}) => {
    return (c) => {
        c.beginPath()
        c.arc(x, y, d/2, 0, Math.PI * 2, true)
        c.fillStyle = color
        c.fill()
    }
}


/**
 * Return a function which takes a canvas context as parameter
 * and draws a square with the
 *  - center "x"/"y" and the
 *  - site size "s" in
 *  - the color "color"
 *  on the given canvas
 */
const getRectFunc = ({x, y, s, color}) => {
    return (c) => {
        c.beginPath()
        c.rect(x - s /2, y - s/2, s, s)
        c.fillStyle = color
        c.fill()
    }
}

// Let's fill our item container with some painting functions
canvItems.push(
    getRectFunc({ ...getRandomCords(), s: itemSize, color: colors.black}),
    getRectFunc({ ...getRandomCords(), s: itemSize, color: colors.blue }),
    getRectFunc({ ...getRandomCords(), s: itemSize, color: colors.yellow }),
    getRectFunc({ ...getRandomCords(), s: itemSize, color: colors.turquise}),
    getCircleFunc({ ...getRandomCords(), d: itemSize, color: colors.green}),
    getCircleFunc({ ...getRandomCords(), d: itemSize, color: colors.orange }),
    getCircleFunc({ ...getRandomCords(), d: itemSize, color: colors.grey }),
    getCircleFunc({ ...getRandomCords(), d: itemSize, color: colors.red }),
);

// Clear canvas and paint all items from the itemContainer on it (Immediately invoked anonymous function)
(() => {
    ctx.clearRect(0, 0, fieldDimensions.w, fieldDimensions.h)
    canvItems.forEach((i) => i(ctx))
    console.log('go!')
})()

/**
 * Replace content of the info box with "text"
 */
const writeInfoText = (text) => {
    txtInf.innerHTML = `You pressed ${text}`
}

const hitsElement = (click, element) => {
    if(click.offsetX <= element.d){}
}

canv.addEventListener('click', (e) => {
    /**
     * TODO: adjust the user information
     * Find out, which element was clicked end change the text
     * to the corresponding information, eg:
     * the red circle
     * or
     * the blue square
     */
    

    writeInfoText(`Something on ${e.offsetX} / ${e.offsetY}`)
})
