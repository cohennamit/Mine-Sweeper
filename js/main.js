'use strict'

const MINE = '💣'
const NORMAL = '😃'
const BLOWN = '🤯'
const WINNER = '😎'


var gElLivesSpan = document.querySelector('.lives')
var gElSmileyBtn = document.querySelector('.smiley-btn')
var gElTimer = document.querySelector('.timer')



var gBoard

var gSecsPassed

var gLevel = {
    size: 8,
    mines: 14,
}

var gGame = {
    isOn: false,
    isHintActive: false,
    turnCount: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    hintCount: 3,

}


function onInit() {

    resetHints()
    gElTimer.innerText = '0000'
    gSecsPassed = 0
    gElSmileyBtn.innerText = NORMAL
    gGame.isOn = true
    gGame.turnCount = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.livesCount = 3
    gElLivesSpan.innerText = gGame.livesCount
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard, '.board-container')
}

function onInitAfterClick() {

    addMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
}

function buildBoard(num) {
    const board = []
    for (var i = 0; i < num; i++) {
        const row = []
        for (var j = 0; j < num; j++) {
            row[j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
        board.push(row)
    }
    return board
}

function addMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        const emptyPos = getEmptyPos()
        if (!emptyPos) return
        gBoard[emptyPos.i][emptyPos.j].isMine = true
    }

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = mineNegLoop(board, i, j)
        }
    }

}

function markCell(elCell, i, j) {

    if (gBoard[i][j].isShown || !gGame.isOn) return

    if (gGame.markedCount >= gLevel.mines) {

        if (!gBoard[i][j].isMarked) return

        gBoard[i][j].isMarked = false
        elCell.classList.remove('marked')
        gGame.markedCount--

    } else {

        if (!gBoard[i][j].isMarked) {
            gGame.markedCount++
        } else {
            gGame.markedCount--
        }
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        elCell.classList.toggle('marked')
    }

    if (checkVictory()) {
        gameVictory()
    }

}

function onCellClicked(elCell, i, j) {

    if (gGame.isHintActive) {
        hintReveal(i, j)
        return
    }

    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) return

    gGame.turnCount++
    if (gBoard[i][j].isMine && !gGame.isHintActive) {
        revealCell(elCell, i, j)
        gGame.livesCount--
        gElLivesSpan.innerText = gGame.livesCount
        if (gGame.livesCount === 0) {
            gameOver()
        }
    } else if (gBoard[i][j].minesAroundCount === 0) {
        revealCell(elCell, i, j)
        revealNegs(i, j)
    } else {
        revealCell(elCell, i, j)
    }
    if (checkVictory()) {
        gameVictory()
    }
    if (gGame.turnCount === 1) {
        gSecsPassed = setInterval(timer, 1000)
        onInitAfterClick()
    }
}

function revealCell(elCell, i, j) {
    gBoard[i][j].isShown = true
    var elCellSpan = elCell.querySelector('span')
    if (elCellSpan) {
        elCellSpan.classList.remove('hidden')
        elCell.classList.add('clicked')
        gGame.shownCount++
    }
    else return
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


function checkVictory() {
    var isVictory = true
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMarked) {
                isVictory = false
            }
            if (!currCell.isMine && currCell.isMarked) {
                isVictory = false
            }
        }
    }
    return isVictory
}

function gameVictory() {
    gGame.isOn = !gGame.isOn
    gElSmileyBtn.innerText = WINNER
    clearInterval(gSecsPassed)
}

function gameOver() {
    gGame.isOn = !gGame.isOn
    gElSmileyBtn.innerText = BLOWN
    clearInterval(gSecsPassed)
    revealBombs()
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