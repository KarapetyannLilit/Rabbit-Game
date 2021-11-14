let board = new Array(), boardUi = new Array(), boardFind = new Array();
let boardSize, wolfCount, fenceCount;
let win = false, move = true;
const characters = {
    wolf: {
        name: "wolf",
        id: 1,
        count: wolfCount,
        position: []
    },
    home: {
        name: "home",
        id: 3,
        count: 1,
        position: []
    },
    rabbit: {
        name: "rabbit",
        id: 5,
        count: 1,
        position: []
    },
    fence: {
        name: "fence",
        id: 2,
        count: fenceCount,
        position: []
    },
    stone: {
        name: "stone",
        id: 2,
        count: fenceCount,
        position: []
    }
}

function startGame(elem) {
    createEmptyBoard(elem)
    positionPlayers()
}

function createEmptyBoard(elem) {
    boardSize = elem.id;
    wolfCount = fenceCount = boardSize / 2;
    document.getElementById("buttons").style.display = "none";
    for (let i = 0; i < boardSize; i++) {
        board[i] = new Array();
        boardUi[i] = document.createElement('tr');
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = 0;
            boardUi[i][j] = document.createElement('td');
            boardUi[i].appendChild(boardUi[i][j]);
        }
        document.getElementById('board').appendChild(boardUi[i]);
    }
}

function positionPlayers() {
    positionCharacter(board, characters.rabbit, 1)
    positionCharacter(board, characters.home, 1)
    positionCharacter(board, characters.wolf, wolfCount)
    positionCharacter(board, characters.fence, fenceCount)
    positionCharacter(board, characters.stone, fenceCount)
}

function positionCharacter(board, character, count) {
    for (let i = 0; i < count; i++) {
        positionSingleCharacter(board, character);
    }
}

function positionSingleCharacter(board, character) {
    const [x, y] = getRandomFreeCoords(board);
    board[x][y] = character.id;
    boardUi[x][y].classList.add(character.name);
    character.position.push({ x: x, y: y });
}

function getRandomFreeCoords(board) {
    const [x, y] = [getRandomCoords(boardSize), getRandomCoords(boardSize)];
    if (board[x][y] === 0) {
        return [x, y];
    }
    return getRandomFreeCoords(board);
}

function getRandomCoords(boardSize) {
    let rand = Math.floor(Math.random() * (boardSize - 1));
    return rand;
}

function reactOnKeyboard(direction) {
    changeRabbitPosiotion(direction)
    if (move) {
        for (let i = 0; i < wolfCount; i++) {
            let wolfCoord = Object.values(characters.wolf.position[i]);
            let rabbitCoord = Object.values(characters.rabbit.position[0]);
            attackRabbit(wolfCoord, rabbitCoord, i);
        }
    }
}

document.onkeydown = reactOnKeyboard;
function changeRabbitPosiotion(direction) {
    [{ x, y }] = characters.rabbit.position;
    let newRabbitX = x, newRabbitY = y;
    switch (direction.code) {
        case "ArrowLeft":
            newRabbitY = y > 0 ? y - 1 : nextPos = boardSize - 1;
            moveRabbit(x, newRabbitY);
            break;
        case "ArrowRight":
            newRabbitY = y < boardSize - 1 ? y + 1 : nextPos = 0;
            moveRabbit(x, newRabbitY);
            break;
        case "ArrowUp":
            newRabbitX = x > 0 ? x - 1 : nextPos = boardSize - 1;
            moveRabbit(newRabbitX, y);
            break;
        case "ArrowDown":
            newRabbitX = x < boardSize - 1 ? x + 1 : nextPos = 0;
            moveRabbit(newRabbitX, y);
            break;
        default: move = false;
            break;
    }
}

function moveRabbit(newRabbitX, newRabbitY) {
    move = true;
    if (board[newRabbitX][newRabbitY] === 0 || board[newRabbitX][newRabbitY] === characters.home.id) {
        board[x][y] = 0;
        boardUi[x][y].classList.remove(characters.rabbit.name);
        if (boardUi[newRabbitX][newRabbitY].classList.contains(characters.home.name)) {
            win = true;
            gameOver(x, y, win);
            move = false;
            return;
        }
        boardUi[newRabbitX][newRabbitY].classList.add(characters.rabbit.name);
        x = newRabbitX; y = newRabbitY;
        characters.rabbit.position = [{ x, y }];
    }
}

function attackRabbit(wolfCoord, rabbitCoord, i) {
    let nextCoord = selectMinimumDistanceMove(wolfCoord, rabbitCoord, i);
    moveWolf(wolfCoord, nextCoord, i);
}

function selectMinimumDistanceMove(position, end, j) {
    for (let i = 0; i < boardSize; i++) {
        boardFind[i] = [];
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] != 0) {
                boardFind[i][j] = 1;
            } else {
                boardFind[i][j] = 0;
            }
        }
    }
    let visited = [];
    boardFind[position[0]][position[1]] = 1;
    visited.push([position]);
    let path;
    while (visited.length > 0) {
        path = visited.shift();
        let coord = path[path.length - 1];
        let direcTo = [
            [coord[0] + 1, coord[1]], [coord[0], coord[1] + 1],
            [coord[0] - 1, coord[1]], [coord[0], coord[1] - 1]
        ];
        for (let i = 0; i < direcTo.length; i++) {
            if (direcTo[i][0] == end[0] && direcTo[i][1] == end[1]) {
                path.concat([end]);
                if (path.length > 1) {
                    return path[1];
                } else {
                    return end;
                }
            }
            if (direcTo[i][0] < 0 || direcTo[i][0] >= boardFind.length
                || direcTo[i][1] < 0 || direcTo[i][1] >= boardFind[0].length
                || boardFind[direcTo[i][0]][direcTo[i][1]] != 0) {
                continue;
            }
            boardFind[direcTo[i][0]][direcTo[i][1]] = 1;
            visited.push(path.concat([direcTo[i]]));
        }
    }
    return path[0];
}

function moveWolf(wolfCoord, nextCoord, i) {
    board[wolfCoord[0]][wolfCoord[1]] = 0;
    boardUi[wolfCoord[0]][wolfCoord[1]].classList.remove(characters.wolf.name);
    [characters.wolf.position[i].x, characters.wolf.position[i].y] = nextCoord;
    board[characters.wolf.position[i].x][characters.wolf.position[i].y] = 1;
    boardUi[characters.wolf.position[i].x][characters.wolf.position[i].y].classList.add(characters.wolf.name);
    if (boardUi[x][y].classList.contains(characters.wolf.name)) {
        win = false;
        gameOver(x, y, win);
        move = false;
    }
}

function gameOver(x, y, win) {
    boardUi[x][y].classList.remove(characters.rabbit.name);
    document.onkeydown = null;
    document.getElementById("myModal").style.display = "block";
    if (win) {
        text1.innerHTML = "You Won!";
    } else {
        text1.innerHTML = "You Lose!";
    }
}

document.getElementsByClassName("close")[0].onclick = function () {
    window.location.reload();
}