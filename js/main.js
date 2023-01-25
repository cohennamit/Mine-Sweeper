'use strict'

const MINE = '💣'

var gBoard

var gLevel = {
    Size: 4,
    Mines: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

function onInit() {
    console.log('Hello!')
    gGame.isOn = true
    gBoard = buildBoard(gLevel.Size)
    addMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')

}

function buildBoard(num) {
    var minesAmount = 2
    const board = []
    for (var i = 0; i < num; i++) {
        const row = []
        for (var j = 0; j < num; j++) {
            row[j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
            }
        }
        board.push(row)
    }
    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = mineNegLoop(board, i, j)
        }
    }

}

function onCellClicked(elCell, i, j) {
    if (gBoard[i][j].isMine) {
        revealBombs()
    } else if (gBoard[i][j].minesAroundCount === 0) {
        revealCell(elCell, i, j)
        revealNegs(i, j)
    } else {
        revealCell(elCell, i, j)
    }
}

function revealBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                currCell.isShown = true
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                revealCell(elCell, i, j)

            }
        }
    }
}


function revealNegs(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            var currCell = gBoard[i][j]
            currCell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            revealCell(elCell, i, j)
        }
    }
}


function revealCell(elCell, i, j) {
    gBoard[i][j].isShown = true
    var elCellSpan = elCell.querySelector('.hidden')
    if (elCellSpan) {
        elCellSpan.classList.remove('hidden')
        elCell.classList.add('clicked')
        gGame.shownCount++
        console.log('gGame.shownCount', gGame.shownCount)
    }
    else return
}

function addMines(board) {
    board[1][1].isMine = true
    board[3][3].isMine = true
    // for (var i = 0; i < gLevel.Mines; i++) {
    //     const emptyPos = getEmptyPos()
    //     if (!emptyPos) return
    //     gBoard[emptyPos.i][emptyPos.j].isMine = true
    // }

}

function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) {
                emptyPoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    return emptyPoss[randIdx]
}
