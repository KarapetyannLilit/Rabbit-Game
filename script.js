let board = document.getElementById('board');
let modal = document.getElementById("myModal");
let buttons = document.getElementById("buttons");
let span = document.getElementsByClassName("close")[0];
let boardSize;
let matrix = [];
let tempMatrix = [];
let rabbit;
let home;
let wolfPoses = [];

function loadGame(elem) {
    a = elem.id;
    boardSize = a;
    buttons.style.display = "none";
    create();
}

span.onclick = function () {
    modal.style.display = "none";
    window.location.reload();
}

function create() {
    for (let i = 0; i < boardSize; i++) {
        let tr = document.createElement('tr');
        tr.classList.add("mytr");
        matrix[i] = [];
        for (let j = 0; j < boardSize; j++) {
            let td = document.createElement('td');
            td.setAttribute("id", "0")

            td.classList.add("mytd");
            matrix[i][j] = '.';
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }

    let all = document.querySelectorAll(".mytd");
    let k = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[i][j] = all[k];
            k++;
        }
    }

    let x = Math.floor(Math.random() * boardSize);
    let y = Math.floor(Math.random() * boardSize);
    rabbit = matrix[x][y];
    rabbit.classList.add("rabbit");
    let rabbitPos = {
        x: x,
        y: y
    };

    let homeX = Math.floor(Math.random() * boardSize);
    let homeY = Math.floor(Math.random() * boardSize);
    if (!matrix[homeX][homeY].classList.contains('rabbit')) {
        home = matrix[homeX][homeY];
        home.classList.add("home");
        matrix[homeX][homeX].setAttribute("id", "1");
    }

    let fenceNum = boardSize - 1;
    do {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);

        if (!matrix[x][y].classList.contains('wolf') && !matrix[x][y].classList.contains('home') &&
            !matrix[x][y].classList.contains('rabbit') && !matrix[x][y].classList.contains('fence')) {
            matrix[x][y].classList.add("fence");
            matrix[x][y].setAttribute("id", "1")

            let rand = Math.round(Math.random());
            if (rand == 0) {
                matrix[x][y].classList.add("wall");
            }
            fenceNum--;
        }
    }
    while (fenceNum > 0);

    let wolfCount = boardSize - 3;
    do {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);

        if (!matrix[x][y].classList.contains('wolf') && !matrix[x][y].classList.contains('home') &&
            !matrix[x][y].classList.contains('rabbit') && !matrix[x][y].classList.contains('fence')) {
            matrix[x][y].classList.add("wolf");
            matrix[x][y].setAttribute("id", "0")

            wolfPoses.push({
                x: x,
                y: y
            });

            wolfCount--;
        }
    }
    while (wolfCount > 0);

    function win(rabbitPos) {
        matrix[rabbitPos.x][rabbitPos.y].classList.remove("rabbit");
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                matrix[i][j] = 0;
            }
        }
        modal.style.display = "block";
        text1.innerHTML = "You Won!";
    }


    function lose(rabbitPos) {
        matrix[rabbitPos.x][rabbitPos.y].classList.remove("rabbit");
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                matrix[i][j] = 0;
            }
        }
        modal.style.display = "block";
        text1.innerHTML = "Game over!";
    }

    function moveHorizontal(newRabbitPos) {
        if (!matrix[rabbitPos.x][newRabbitPos].classList.contains("wolf") &&
            !matrix[rabbitPos.x][newRabbitPos].classList.contains("fence")) {
            matrix[rabbitPos.x][rabbitPos.y].classList.remove("rabbit");
            matrix[rabbitPos.x][newRabbitPos].classList.add("rabbit");
            rabbitPos.y = newRabbitPos;
        }
    }

    function moveVertical(newRabbitPos) {
        if (!matrix[newRabbitPos][rabbitPos.y].classList.contains("wolf") &&
            !matrix[newRabbitPos][rabbitPos.y].classList.contains("fence")) {
            matrix[rabbitPos.x][rabbitPos.y].classList.remove("rabbit");
            matrix[newRabbitPos][rabbitPos.y].classList.add("rabbit");
            rabbitPos.x = newRabbitPos;
        }
    }

    function findWay(position, end) {
        let visited = [];
        tempMatrix[position[0]][position[1]] = 1;
        visited.push([position]);

        while (visited.length > 0) {
            let path = visited.shift();
            let coordinate = path[path.length - 1];
            let direcTo = [
                [coordinate[0] + 1, coordinate[1]],
                [coordinate[0], coordinate[1] + 1],
                [coordinate[0] - 1, coordinate[1]],
                [coordinate[0], coordinate[1] - 1]
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

                if (direcTo[i][0] < 0 || direcTo[i][0] >= tempMatrix.length
                    || direcTo[i][1] < 0 || direcTo[i][1] >= tempMatrix[0].length
                    || tempMatrix[direcTo[i][0]][direcTo[i][1]] != 0) {
                    continue;
                }
                tempMatrix[direcTo[i][0]][direcTo[i][1]] = 1;
                visited.push(path.concat([direcTo[i]]));
            }
        }
        return path[0];
    }

    function moveWolves(rabPos, wolfPos) {
        tempMatrix = [];
        for (let i = 0; i < boardSize; i++) {
            tempMatrix[i] = [];
            for (let j = 0; j < boardSize; j++) {
                if (matrix[i][j].classList.contains("fence") ||
                    matrix[i][j].classList.contains("home") ||
                    matrix[i][j].classList.contains("wolf")) {
                    tempMatrix[i][j] = 1;
                }
                else {
                    tempMatrix[i][j] = 0;
                }
            }
        }
        let currentPos = Object.values(wolfPos);
        let path = findWay(currentPos, rabPos);

        matrix[currentPos[0]][currentPos[1]].classList.remove("wolf");
        matrix[path[0]][path[1]].classList.add("wolf");

        wolfPos.x = path[0];
        wolfPos.y = path[1];
    }

    document.body.addEventListener('keydown', function (event) {
        let newRabbitPos;
        switch (event.key) {
            case "ArrowLeft":
                newRabbitPos = rabbitPos.y > 0 ? rabbitPos.y - 1 : nextPos = boardSize - 1;
                moveHorizontal(newRabbitPos);
                break;
            case "ArrowRight":
                newRabbitPos = rabbitPos.y < boardSize - 1 ? rabbitPos.y + 1 : nextPos = 0;
                moveHorizontal(newRabbitPos);
                break;
            case "ArrowUp":
                newRabbitPos = rabbitPos.x > 0 ? rabbitPos.x - 1 : nextPos = boardSize - 1;
                moveVertical(newRabbitPos);
                break;
            case "ArrowDown":
                newRabbitPos = rabbitPos.x < boardSize - 1 ? rabbitPos.x + 1 : nextPos = 0;
                moveVertical(newRabbitPos);
                break;
            default: break;
        }

        if (matrix[rabbitPos.x][rabbitPos.y].classList.contains("home")) {
            win(rabbitPos);
        }
        else {
            let rabPos = Object.values(rabbitPos);
            for (let k = 0; k < wolfPoses.length; k++) {
                moveWolves(rabPos, wolfPoses[k]);

                if (matrix[rabbitPos.x][rabbitPos.y].classList.contains("wolf")) {
                    lose(rabbitPos);
                }
            }
        }
    });

}