'use strict'
// This is a utility file for MINE SWEEPER SPRINT
// ALSO VIEW THE LATEST CRS!! 
// PACMAN, BALLBOARD, TOUCH NUMS, IN PICTURE AND GAME OF LIFE!

//This disables context menu when we rightclick on the game board
//so we can use our rightclick in order to mark/unmark spots.

document.querySelector('.board-container').addEventListener('contextmenu', (e) => {
    e.preventDefault()
})


//This function renders the matrix we created at buildBoard() into the dom
//also gives the classes that we will need to select elements and change them.
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = `cell cell-${i}-${j}` + ' '
            cellClass += (currCell.isShown) ? 'clicked ' : ''
            cellClass += (currCell.isMarked) ? ' marked' : ''

            strHTML += `<td  oncontextmenu="markCell(this,${i},${j})" class="${cellClass}"  onclick="onCellClicked(this,${i},${j})" >`
            strHTML += (!currCell.isShown) ? `<span class ="hidden">` : `<span>`
            if (currCell.isMine) {
                strHTML += MINE
            } else if (currCell.minesAroundCount > 0) {

                strHTML += currCell.minesAroundCount
            }
            strHTML += `</span>`

        }

        strHTML += '</td>'
    }
    strHTML += '</tr>'
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board-container')
    elContainer.innerHTML = strHTML
}

//This function finds how many mines are the neighbors of a given cell.
function mineNegLoop(board, rowIdx, colIdx) {
    var mineNegCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) mineNegCount++
        }
    }
    return mineNegCount
}

//This function finds all the empty spots in the matrix and returns a random one.
function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                emptyPoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    return emptyPoss[randIdx]
}

//This function sets the seconds timer for the game
//and updates the dom accordingly.
function timer() {
    gGame.secsPassed++
    if (gGame.secsPassed >= 1000) {
        gElTimer.innerText = gGame.secsPassed
    }
    else if (gGame.secsPassed >= 100) {
        gElTimer.innerText = '0' + gGame.secsPassed
    }
    else if (gGame.secsPassed >= 10) {
        gElTimer.innerText = '00' + gGame.secsPassed
    }
    else {
        gElTimer.innerText = '000' + gGame.secsPassed
    }

}

//This function sets gLevel's properties for 'EXPERT' level, clears the seconds timer 
//activates onInit() so it uses the new gLevel values, and sets the best score for each
//level, if there is no best score yet it acts appropriately.
function level3() {

    gLevel.size = 12
    gLevel.mines = 32
    clearInterval(gSecsPassed)
    // gBestTime = Infinity
    gElBestScore.innerText = localStorage.getItem('lvl3Best')
    if (!localStorage.getItem('lvl3Best')) {
        gElBestScore.innerText = 'BEST SCORE'
    }
    onInit()
}

//This function sets gLevel's properties for 'MEDIUM' level, clears the seconds timer 
//activates onInit() so it uses the new gLevel values.
function level2() {
    gLevel.size = 8
    gLevel.mines = 14
    clearInterval(gSecsPassed)
    // gBestTime = Infinity
    gElBestScore.innerText = localStorage.getItem('lvl2Best')
    if (!localStorage.getItem('lvl2Best')) {
        gElBestScore.innerText = 'BEST SCORE'
    }
    onInit()
}

//This function sets gLevel's properties for 'BEGINNER' level, clears the seconds timer 
//activates onInit() so it uses the new gLevel values.
function level1() {
    gLevel.size = 4
    gLevel.mines = 2
    clearInterval(gSecsPassed)
    // gBestTime = Infinity
    gElBestScore.innerText = localStorage.getItem('lvl1Best')
    if (!localStorage.getItem('lvl1Best')) {
        gElBestScore.innerText = 'BEST SCORE'
    }
    onInit()
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}