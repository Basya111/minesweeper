'use stricr'

const MINE = '💣';
const MARK = '🚩';
const WIN = '🥳';
const LOSE = '😖';
const HAPPY = '😃'

var gStartTime = null;
var gIntervalId = null;
var gBoard;
var gLevelOpt = ['Easy', 'Hard', 'Extreme']
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}

function init() {
    renderLevel()
    gBoard = createBoard(gLevel.SIZE);
    console.log(gBoard);
    for (var i = 0; i < gLevel.MINES; i++) {
        addMine()
    }

    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
    // console.log(gBoard);
    // if (gGame.isOn) {
    //     console.log('hey');
    //     startTimer();
    // }

}

function resetGame() {
    init()
    stopTimer()
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = HAPPY;

}

// creates the board
function createBoard(rows) {
    var board = []
    for (var i = 0; i < rows; i++) {
        board[i] = []
        for (var j = 0; j < rows; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;

        }

    }
    // board[1][1].isMine = true
    // board[3][2].isMine = true

    return board
}
// render the board -> modal
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr\n>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = getClassName({ i: i, j: j })
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this);return false;">`

            strHTML += `</td>`

        }
        strHTML += '</tr>'
        // console.log(strHTML);
    }
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}
// click cell - reveal the content 
function cellClicked(elCell, i, j) {
    gGame.isOn = true
    startTimer();
    if (elCell.innerHTML === MARK) return
    var currCell = gBoard[i][j]
    currCell.isShown = true;
    gGame.shownCount++

    if (currCell.isMine) {
        elCell.innerText = MINE;
        elCell.classList.add('bomb')
        // stopTimer()
        gameOver(elCell);
    }
    else if (currCell.minesAroundCount > 0) elCell.innerHTML = currCell.minesAroundCount;
    else {
        expandShown(gBoard, i, j)
    }
    // if (checkGameOver()) {
    //     console.log('Victory!');
    // }
    elCell.classList.add('shown')
}


// counts how many mines are around the each cell
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var numOfNegs = countNeighbors(i, j, board)
            currCell.minesAroundCount = numOfNegs
        }
    }
}


// counts how many mines are around current cell
function countNeighbors(cellI, cellJ, board) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            board[i][j].isShown = true;
            var pos = { i: i, j: j }
            renderCell(pos)
        }
    }
}

// add mine in a random position
function addMine() {
    var i = getRandomInt(0, gLevel.SIZE)
    var j = getRandomInt(0, gLevel.SIZE)
    var pos = { i: i, j: j }
    gBoard[pos.i][pos.j].isMine = true;
    gBoard[pos.i][pos.j].isShown = false;
}

function renderLevel() {
    var strHTML = '';
    for (var i = 0; i < gLevelOpt.length; i++) {
        strHTML += `<button class="level-button" onclick="clickLevel(${i})">${gLevelOpt[i]}</button>`
    }
    var elLevel = document.querySelector('.level');
    elLevel.innerHTML = strHTML;

}

function clickLevel(idx) {
    for (var i = 0; i < gLevelOpt.length; i++) {
        switch (gLevelOpt[idx]) {
            case 'Easy':
                gLevel.SIZE = 4;
                gLevel.MINES = 2;
                break
            case 'Hard':
                gLevel.SIZE = 8;
                gLevel.MINES = 12;
                console.log('hey');
                break
            case 'Extreme':
                gLevel.SIZE = 12;
                gLevel.MINES = 30;
                break
        }
    }
    init()
}

// check for win
function checkGameOver() {
    var shownCell = gGame.shownCount
    var markedCell = gGame.markedCount
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = WIN;
    if (shownCell + markedCell === gLevel.SIZE ** 2) return true
}

// right click event - marks and count marks
function cellMarked(elCell) {
    if (elCell.innerHTML === MARK) {
        elCell.innerHTML = ''
        gGame.markedCount--;}
    else {
        elCell.innerHTML = MARK;
        gGame.markedCount++;
    }
}

function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var pos = { i: i, j: j }
                var elCell = document.querySelector('.' + getClassName(pos));
                elCell.innerText = MINE;
                gBoard[i][j].isShown = true;
            }
        }
    }
    stopTimer()
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = LOSE;
    console.log('Game Over');
    return gBoard

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// updates the cell in the Model and DOM
function renderCell(position) {
    var currCell = gBoard[position.i][position.j]
    // Select the elCell and set the value
    var elCell = document.querySelector('.' + getClassName(position));
    elCell.classList.add('shown')
    if (currCell.minesAroundCount > 0) {
        elCell.innerHTML = currCell.minesAroundCount;
    }
    else {
        elCell.innerHTML = ''
    }
}

//--------------- timer-----------------
function startTimer() {
    if (!gStartTime) gStartTime = Date.now()
    gIntervalId = setInterval(updateTime, 100)
}

function stopTimer() {
    clearInterval(gIntervalId)
    gIntervalId = null;
}

function updateTime() {
    var diff = Date.now() - gStartTime
    var seconds = diff / 1000
    secondsArr = (seconds + '').split('.')
    var elTime = document.querySelector('.stopwatch')
    var time = seconds < 10 ? '0' + parseInt(seconds) : parseInt(seconds)
    time += ':'
    time += secondsArr[1] < 10 ? '0' + secondsArr[1] : secondsArr[1] || '00'

    elTime.innerText = time
}



