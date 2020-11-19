'use stricr'

const MINE = '💣';
const MARK = '🚩';
const WIN = '🥳';
const LOSE = '😖';
const HAPPY = '😃';
const HEART = '❤️';
const BROKEN_HEART = '💔';
const HINT = '❔'
const HINT2 = '❓'

var gStartTime = null;
var gIntervalId = null;
var gBoard;
var gLevelOpt = ['Easy', 'Hard', 'Extreme']
var gSelectedCell;
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
var gLives = 3;
var gHint = 3;
var isHintOn = false

function init() {
    renderLevel()
    gBoard = createBoard(gLevel.SIZE);
    console.log(gBoard);
    for (var i = 0; i < gLevel.MINES; i++) {
        addMine()
    }

    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
    console.log(gBoard);
    resetHints();
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    

}

function resetGame() {
    gGame.isOn = false
    stopTimer()
    init()
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = HAPPY;
    gLives = 3;
    gHint = 3;
    deleteHeart(3);
    gStartTime = null;
    var elTime = document.querySelector('.stopwatch');
    elTime.innerText = '00:00';

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
            // var currCell = board[i][j];
            var className = getClassName({ i: i, j: j })
            strHTML += `<td class="${className}" id="${i}-${j}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this);return false;">`

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
    if(!gGame.isOn) {startTimer()};
    gGame.isOn = true
    gSelectedCell = elCell
    if (elCell.innerHTML === MARK) return
    var currCell = gBoard[i][j]
    currCell.isShown = true; // the reveal him
    gGame.shownCount++
    console.log(gGame.shownCount);
    checkGameOver()

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
    // checkGameOver()

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
// reveal all the neighbors ofan empty cell
function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var currCell = board[i][j]
            if(!isHintOn){
              board[i][j].isShown = true;  
              gGame.shownCount++
            } 
            var pos = { i: i, j: j }
            renderCell(pos)
            if(!isHintOn && currCell.innerText === '') expandShown(board, i, j)
        }
    }
}

// add mine in a random position
function addMine() {
    var i = getRandomInt(0, gLevel.SIZE)
    var j = getRandomInt(0, gLevel.SIZE)
    var pos = { i: i, j: j }
    if (gBoard[pos.i][pos.j].isMine) {
        i = getRandomInt(0, gLevel.SIZE)
        j = getRandomInt(0, gLevel.SIZE)
    }
    else{
        gBoard[pos.i][pos.j].isMine = true;
        gBoard[pos.i][pos.j].isShown = false;

    }
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
    if (shownCell + markedCell === gLevel.SIZE ** 2) {
        stopTimer()
        elSmiley.innerText = WIN;
        console.log('Victory!')
        return true
    }
}

// right click event - marks and count marks
function cellMarked(elCell) {
    if (elCell.innerHTML === MARK) {
        elCell.innerHTML = ''
        gGame.markedCount--;
    }
    else {
        elCell.innerHTML = MARK;
        gGame.markedCount++;
        console.log('markd', gGame.markedCount);
    }
}

function gameOver() {
    if (gLives > 0) {
        gLives--;
        deleteHeart(gLives)
        console.log('gLives', gLives);
    }
    else {
        stopTimer()
        //gIntervalId = null;
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
        
        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = LOSE;
        console.log('Game Over');
    }


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
    if (currCell.isMine) elCell.innerHTML = MINE;
    else if (currCell.minesAroundCount > 0) {
        elCell.innerHTML = currCell.minesAroundCount;
    }
    else {
        elCell.innerHTML = ''
    }
}


function deleteHeart(idx) {
    var elHeart = document.querySelector('.lives')
    var heartsStr = elHeart.innerText;
    var hearts = heartsStr.split(' ');
    if (idx === 3) {
        elHeart.innerText = HEART + ' ' + HEART + ' ' + HEART //  '❤️ ❤️ ❤️';
    }else {
        hearts[idx] = BROKEN_HEART;
        elHeart.innerText = hearts.join(' ')
    }
    // console.log(hearts);

}

function getHint(elHint){
    isHintOn = true;
    gHint--;
    gGame.shownCount--
    elHint.innerText = HINT2;
    var cellPos = getPos(gSelectedCell.id)
    // var currCell = gBoard[cellPos.i][cellPos.j]
    expandShown(gBoard, cellPos.i, cellPos.j)
    setTimeout(unExpandShown, 1000, gBoard, cellPos.i, cellPos.j)

}

function getPos(className){
    var parts = className.split('-')
    var pos = { i: +parts[0], j: +parts[1] };
    return pos;
}

function unExpandShown(board, cellI, cellJ){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var pos = { i: i, j: j }
            isHintOn = !isHintOn
            if(!board[i][j].isShown){
                unRenderCell(pos);
            }
        }
    }
}

function unRenderCell(position){
    // var currCell = gBoard[position.i][position.j]
    // Select the elCell and set the value
    var elCell = document.querySelector('.' + getClassName(position));
        elCell.classList.remove('shown')
        elCell.innerHTML = ''
    
}

function resetHints(){
    document.querySelectorAll('.hint1').innerHTML = HINT;
    document.querySelectorAll('.hint2').innerHTML = HINT;
    document.querySelectorAll('.hint3').innerHTML = HINT;
}

//--------------- timer-----------------
function startTimer() {
    if (!gStartTime) gStartTime = Date.now()
    gIntervalId = setInterval(updateTime, 100)
}

function stopTimer() {
    clearInterval(gIntervalId)
    gIntervalId = undefined;
    
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
