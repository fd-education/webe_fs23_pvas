const gameField = document.getElementById("gamefield");
const scoreField = document.getElementById("collected");
const playerDiv = document.getElementById("player");
const [fieldWidth, fieldHeight, boardPadding] = [64, 64, 10];
const totalItems = 15;
let foundItems = 0;
const mapPositions = {
    EMPTY: 0,
    PLAYER: 1,
    BLOCK: 2,
    ITEMSTART: 3
};

const map = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => mapPositions.EMPTY)
);

// Block edges
map[0][0] = mapPositions.BLOCK;
map[0][9] = mapPositions.BLOCK;
map[9][0] = mapPositions.BLOCK;
map[9][9] = mapPositions.BLOCK;
let lastItem = mapPositions.ITEMSTART;

// Translate abstract map position to pixel position
const getPixelPosition = ({ x, y }) => {
    return {
        xPx: `${x * fieldWidth + boardPadding}px`,
        yPx: `${y * fieldHeight + boardPadding}px`
    };
};

// Place the player avatar on a random free spot
const placePlayer = () => {
    let { x, y } = getEmptyPoint(map);
    let { xPx, yPx } = getPixelPosition({ x, y });
    map[y][x] = mapPositions.PLAYER;
    playerDiv.style.top = yPx;
    playerDiv.style.left = xPx;
};

// Fill the core gui with "empty" item icons
const paintScoreItems = ({ c, icon = "iconRupee" }) => {
    const templ = document.createElement("template");

    templ.innerHTML = `
      <svg class="svg-icon" viewBox="0 0 512 512">
          <use href="#${icon}"></use>
      </svg>
    `.trim();

    for (let i = 0; i < c; i++) {
        scoreField.appendChild(templ.content.firstChild.cloneNode(true));
    }
};

// Place c (int, amount) items on free spaces on the map
const paintItems = ({ c, icon = "iconRupee" }) => {
    const templ = document.createElement("template");
    templ.innerHTML = `
    <div class="item">
      <svg class="svg-icon" viewBox="0 0 512 512">
          <use href="#${icon}"></use>
      </svg>
    </div>
    `.trim();
    for (let i = 0; i < c; i++) {
        let el = templ.content.firstChild.cloneNode(true);
        let { x, y } = getEmptyPoint(map);
        let { xPx, yPx } = getPixelPosition({ x, y });
        lastItem++;
        map[y][x] = lastItem;
        el.id = `item-${lastItem}`;
        el.style.top = yPx;
        el.style.left = xPx;
        gameField.appendChild(el);
    }
};

// Find an empty spot on the map
const getEmptyPoint = (map) => {
    let [x, y] = [
        Math.floor(Math.random() * map[0].length),
        Math.floor(Math.random() * map.length)
    ];

    while (map[y][x] !== mapPositions.EMPTY) {
        [x, y] = [
            Math.floor(Math.random() * map[0].length),
            Math.floor(Math.random() * map.length)
        ];
    }
    return { x, y };
};

// Check if the wanted move to dir(ection) is valid and maybe even special (with item!)
const tryToMove = ({ dir }) => {
    let [xNew, yNew, item] = [-1, -1, false];
    // get the current position of the player
    let [x, y] = map.reduce(
        (coords, row, index) => {
            let i = row.findIndex((e) => e === mapPositions.PLAYER);
            if (i !== -1) return [i, index];
            return coords;
        },
        [-1, -1]
    );

    // set coords according to params
    xNew = dir === "u" || dir === "d" ? x : dir === "r" ? x + 1 : x - 1;
    yNew = dir === "l" || dir === "r" ? y : dir === "d" ? y + 1 : y - 1;

    // check if valid
    if (
        yNew < 0 ||
        xNew < 0 ||
        xNew >= map[0].length ||
        yNew >= map.length ||
        map[yNew][xNew] === mapPositions.BLOCK
    )
        return false;

    return {
        x,
        y,
        xNew,
        yNew,
        item: map[yNew][xNew] > mapPositions.ITEMSTART ? map[yNew][xNew] : 0
    };
};

// Do a move wish. May it succeed!
const cmdMove = ({ dir }) => {
    let move = tryToMove({ dir });
    if (move !== false) {
        let { xPx, yPx } = getPixelPosition({ x: move.xNew, y: move.yNew });

        if(dir === "l" || dir === "r") turnPlayer({dir});
        if(move.item) handleItem(move);

        map[move.y][move.x] = mapPositions.EMPTY;
        map[move.yNew][move.xNew] = mapPositions.PLAYER;

        playerDiv.style.top = yPx;
        playerDiv.style.left = xPx;
    }
};

// Let the player face the walking direction
const turnPlayer = ({ dir }) => {
    const FACE_RIGHT = "scaleX(1)";
    const FACE_LEFT = "scaleX(-1)"

    if(dir === "l"){
        playerDiv.style.transform = FACE_LEFT;
    } else if(dir === "r"){
        playerDiv.style.transform = FACE_RIGHT;
    }
}

const handleItem = (move) => {
    // Play the success animation
    animateSuccess()

    // Remove item in Game-State and in UI
    const item = document.getElementById(`item-${move.item}`)
    item.remove();

    // Mark the item in the scoreField as found and increment the number of found items
    scoreField.children[foundItems].classList.add('item-collected');
    foundItems += 1;

    // Cheap win handler ;)
    if(foundItems === totalItems){
        console.log("You win!")
    }
}

// Flip the character, when an item is collected
const animateSuccess = () => {
    playerDiv.animate(
        [{
            transform: "rotate(0deg)"
        }, {
            transform: "rotate(360deg)"
        }],
        {
            duration: 800
        }
    ).play();
}

/******************
 * Start the Game *
 *****************/

placePlayer();
paintItems({ c: totalItems });
paintScoreItems({ c: totalItems });
