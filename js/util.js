
function createMat(rows, cols) {
    var mat = []
    for (var i = 0; i < rows; i++) {
      var row = []
      for (var j = 0; j < cols; j++) {
        row.push('')
      }
      mat.push(row)
    }
    return mat
  }



function countNeighbors(cellI, cellJ, board) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsSum++;
            if (board[i][j]) neighborsSum++;
        }
    }
    return neighborsSum;
  }

  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }


function isEmptyCell(pos) {
    return gBoard[pos.i][pos.j] === ''
  }


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
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