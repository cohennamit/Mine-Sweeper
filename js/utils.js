'use strict'
// This is a utility file for frequently used functions
// for the sprint.
// ALSO VIEW THE LATEST CR'S!! 
// PACMAN, BALLBOARD, TOUCH NUMS, IN PICTURE AND GAME OF LIFE!


//When you call this function you give the place where 
//you want to render your board like so: 

document.querySelector('.board-container').addEventListener('contextmenu', (e) => {
    e.preventDefault()
})


function renderBoard(board) {
    console.log('board', board)
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = `cell cell-${i}-${j}` + ' '
            cellClass += (currCell.isShown) ? 'clicked' : ''

            strHTML += `<td  oncontextmenu="markCell(this,${i},${j})" class="${cellClass}"  onclick="onCellClicked(this,${i},${j})" >`
            strHTML += `<span class ="hidden">`
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

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    // in this case the elCell is selected by class
    // to select by id :DQS(`#cell-${location.i}-${location.j}`)
    // to select by data attrib :DQS(`[data-i = "${i}""]`)
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

//if we have a global variable for the board 
//we don't have to pass it as an argument to the function
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

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d]
        console.log('item:', item)
    }
}

function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1]
        console.log('item:', item)
    }
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}