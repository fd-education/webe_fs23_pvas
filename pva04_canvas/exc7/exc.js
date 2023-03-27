const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');

const gameOverText = document.getElementById('game-over');
const scoreOutput = document.getElementById('score');
const difficultyOutput = document.getElementById('difficulty');

const fieldDimensions = {
    w : 640,
    h: 480
}

const gameLoop = {
    iterations: 0,
    running: true,
    interval: 50,
    brickCollisions: 0,
    difficulty: 1
}

const xDir = {L: 'left', R: 'right'}
const yDir = {B: 'bottom', T: 'top'}

const ball = {
    x: 100,
    y: 100,
    r: 10,
    dirX: xDir.R,
    dirY: yDir.B,
}

const brick = {
    x: 10,
    y: 10,
    w: 20,
    h: 60,
    moveSpeed: 40
}

const handleControlInput = (e) => {
    const arrowUp = (e.code === 'ArrowUp' || e.code === 'KeyW');
    const arrowDown = (e.code === 'ArrowDown' || e.code === 'KeyS');

    const topBorder = ball.r;
    const bottomBorder = fieldDimensions.h - ball.r - brick.h;

    if(arrowUp && brick.y > topBorder){
        brick.y -= brick.moveSpeed;
    } else if(arrowDown && brick.y < bottomBorder){
        brick.y += brick.moveSpeed;
    }

    paint();
}

window.addEventListener('keydown', handleControlInput)

const handleGameOver = () => {
    gameLoop.running = false;
    window.removeEventListener('keydown', handleControlInput);
    gameOverText.style.display = 'block';
}

const calculateBallPositions = (x, y) => {
    switch(ball.dirX){
        case(xDir.L):
            ball.x -= x;
            break;
        case(xDir.R):
            ball.x += x;
            break;
    }

    switch(ball.dirY){
        case(yDir.B):
            ball.y += y;
            break;
        case(yDir.T):
            ball.y -= y;
            break;
    }
}

const paint = () => {
    ctx.clearRect(0, 0, fieldDimensions.w, fieldDimensions.h)
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true)
    ctx.rect(brick.x, brick.y, brick.w, brick.h)
    ctx.fill();
    // walls top, bottom right
    ctx.fillStyle = 'rgb(198,28,28)'
    ctx.fillRect(0, 0, fieldDimensions.w, 5)
    ctx.fillRect(fieldDimensions.w - 5, 0, 5, fieldDimensions.h)
    ctx.fillRect(0, fieldDimensions.h - 5, fieldDimensions.w, 5)
}

const brickCollision = () => {
    const tolerance = ball.r;
    return (ball.y > brick.y - tolerance && ball.y < (brick.y + brick.h + tolerance))
}

const handleBrickCollision = () => {
    ball.dirX = xDir.R;

    gameLoop.brickCollisions += 1;
    scoreOutput.innerText = gameLoop.brickCollisions;

    if(gameLoop.brickCollisions % 3 === 0){
        gameLoop.interval /= 1.2;
        gameLoop.difficulty += 1;
        difficultyOutput.innerText = gameLoop.difficulty;
    }
}

const moveBall = (x, y) => {
    const topBorder = ball.r;
    const bottomBorder = fieldDimensions.h - ball.r;
    const leftBorder = ball.r;
    const rightBorder = fieldDimensions.w - ball.r;
    const brickBorder = brick.x + brick.w + ball.r;

    if(ball.x + ball.r === rightBorder){
        ball.dirX = xDir.L;
    } else if(ball.y + ball.r === bottomBorder) {
        ball.dirY = yDir.T;
    } else if(ball.y - ball.r === topBorder) {
        ball.dirY = yDir.B;
    } else if(ball.x - ball.r === brickBorder && brickCollision()) {
        handleBrickCollision();
    } else if(ball.x === leftBorder){
        handleGameOver()
        return;
    }

    calculateBallPositions(x, y);
    paint();
}

const moveInLoop = () => {
    moveBall(10, 5)

    if(gameLoop.running){
        gameLoop.iterations += 1;
        setTimeout(() => moveInLoop(), gameLoop.interval)
    }
}

moveInLoop();
