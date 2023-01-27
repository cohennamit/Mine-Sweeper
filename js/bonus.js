'use strict'
//This is the file where I place all the functions related to the bonuses
//some of these functions calls will be from the main.js file.

const OFF = '⚫'
const ON = '💡'

//This function activates the hint, we have hard codded 3 hints, so each time we 
//activate a hint we set gGame.isHintActive to be true and subtract 1 from gGame.hintCount.
function activateHint(elBtn) {
    if (elBtn.innerText === OFF || gGame.hintCount === 0) return
    gGame.isHintActive = true
    gGame.hintCount--
    elBtn.innerText = OFF
    console.log('gGame.hintCount;', gGame.hintCount)
}

//This function resets the gGame.hintCount back to three and disables any active hint
//and also changes the DOM buttons to show that hints are available.
//This function will be called from onInit.
function resetHints() {
    var elHintBtns = document.querySelectorAll('.hint-btn')
    gGame.hintCount = 3
    gGame.isHintActive = false
    for (var i = 0; i < elHintBtns.length; i++) {
        elHintBtns[i].innerText = ON
    }
}

//This function activates hintRevealCell() and timeouts hintHideCell() a second later 
//for every neighbor of a clicked cell while a hint is active.
//This function will be called if a cell is clicked and an hint is active.
function hintReveal(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            hintRevealCell(elCell, i, j)
            setTimeout(hintHideCell, 1000, elCell, i, j)
        }
    }
    gGame.isHintActive = false
}

//This function shows a cell on the DOM without affecting the model
//because it's a cell that is hinted so the game won't act like it's
//been really shown (clicked on by the user without hint).
function hintRevealCell(elCell) {
    var elCellSpan = elCell.querySelector('span')
    if (elCellSpan) {
        elCellSpan.classList.remove('hidden')
        elCell.classList.add('clicked')
    }
    else return
}

//This function hides a cell on the DOM without affecting the model
//it makes sure not to hide a game shown cell (a cell that the user actively clicked on).
//it does so just to hide the cells that were hint shown.
function hintHideCell(elCell, i, j) {
    var elCellSpan = elCell.querySelector('span')
    if (gBoard[i][j].isShown) return
    if (elCellSpan) {
        elCellSpan.classList.add('hidden')
        elCell.classList.remove('clicked')
    }
    else return
}

//This function checks if the user has enough safe clicks and if the game's on,
// if so it gets a safe position from getSafePos() marks it as safe and then timeouts 
// to unmark it and reduce the amount of safe click counts the user has after the activation.
function safeClick() {
    if (gGame.safeClickCount <= 0 || !gGame.isOn) return
    const safePos = getSafePos()
    if (!safePos) return
    var ClassSelector = `.cell-${safePos.i}-${safePos.j}`
    var elCell = document.querySelector(ClassSelector)
    elCell.classList.add('safe-marked')
    setTimeout(() => {
        elCell.classList.remove('safe-marked')
    }, 1000)
    gGame.safeClickCount--
    gElSafeBtnSpan.innerText = gGame.safeClickCount
}

//This function finds all the safe spots (spots that aren't a mines and that aren't shown)
//and returns a random one.
function getSafePos() {
    const safePoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safePoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, safePoss.length)
    return safePoss[randIdx]
}

//This function sets the mega hint value to be active
//and work on the next two clicks.
function activateMegaHint() {
    gGame.isMegaHintActive = true
}

//This function takes the two objects created in onCellClicked() while
//mega hint is active and loops through their values and performs hintRevealCell()
//and then timeouts hintHideCell() on each one of them, in that way creates a mega hint.
function performMegaHint() {
    for (var i = gElMegaHintCell1.i; i <= gElMegaHintCell2.i; i++) {
        for (var j = gElMegaHintCell1.j; j <= gElMegaHintCell2.j; j++) {
            var ClassSelector = `.cell-${i}-${j}`
            var elCell = document.querySelector(ClassSelector)
            hintRevealCell(elCell, i, j)
            setTimeout(hintHideCell, 1000, elCell, i, j)

        }
    }
}

