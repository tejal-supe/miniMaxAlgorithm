var originalBoard;
const PLAYER = 'X';
const COMPUTER = 'O';

const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [6, 4, 2],
    
]

const cells = document.querySelectorAll('.cell');
startGame();


function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    originalBoard = Array.from(Array(9).keys()); // it displays all the values from 0 to 8

    for (var i = 0; i < cells.length; i++){ 
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false)
    }
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
        turn(square.target.id, PLAYER)
        if(!checkTie()) turn(bestSpot(),COMPUTER)
    }
}

function turn(id,player) {
    originalBoard[id] = player;
    document.getElementById(id).innerText = player;
    let gameWon = checkWin(originalBoard,player)

    if (gameWon) {
        gameOver(gameWon)
    }
}


function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => //accumulator,element,index
        (e === player) ? a.concat(i) : a, []
    )
    let gameWon = null
    for (let [index, win] of WIN_COMBOS.entries()) {
        if (win.every(ele => plays.indexOf(ele) > -1)) {
            gameWon = { index, player };
            break;
        }
    }
    return gameWon
}


function gameOver(gameWon){
    for (let index of WIN_COMBOS[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
			gameWon.player == PLAYER ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player==PLAYER?"You Win!":"You Lose")
}

function emptySpace() {
    return originalBoard.filter(s=> typeof s === 'number')
}


function bestSpot() {
    return minimax(originalBoard, COMPUTER).index;
}

function checkTie() {
    if (emptySpace().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green"
            cells[i].removeEventListener('click',turnClick,false)
        }
        declareWinner("Tie Game")
        return true
    }
    return false
}


function declareWinner(who) {
    document.querySelector('.endgame').style.display = "block";
    document.querySelector('.endgame .text').innerText=who
}


function minimax(newBoard, player) {
	var availSpots = emptySpace();

	if (checkWin(newBoard, PLAYER)) {
		return {score: -10};
	} else if (checkWin(newBoard, COMPUTER)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == COMPUTER) {
			var result = minimax(newBoard, PLAYER);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, COMPUTER);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === COMPUTER) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}