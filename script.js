var origBoard;
const human = "O";
const ai = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let gamesPlayed = 0;
let aiWon = 0;
let humanWon = 0;
let tiedGames = 0;

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function startOver() {
  gamesPlayed = 0;
  aiWon = 0;
  humanWon = 0;
  tiedGames = 0;
  startGame();
  document.getElementById("hst").innerText = humanWon;
  document.getElementById("aist").innerText = aiWon;
  document.getElementById("tied").innerText = tiedGames;
  document.getElementById("cantPlay").style.display = "none";
}

function turnClick(e) {
  if (typeof origBoard[e.target.id] === "number") {
    turn(e.target.id, human);
    if (!checkTie() && checkWin(origBoard, human) === null) {
      turn(bestSpot(), ai);
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      plays.push(i);
    }
  }
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((element) => plays.includes(element))) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === human ? "green" : "red";
  }
  if (gameWon.player === ai) {
    aiWon += 1;
    if (aiWon > tiedGames && aiWon > 2) {
      document.getElementById("cantPlay").style.display = "block";
    }
  } else if (gameWon.player === human) {
    humanWon += 1;
  }

  document.getElementById("hst").innerText = humanWon;
  document.getElementById("aist").innerText = aiWon;

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player === human ? "You won!" : "You lost!");
}

function emptySquares() {
  return origBoard.filter((square) => typeof square === "number");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  gamesPlayed += 1;
  document.querySelector("#text").innerText = who;
}

function checkTie() {
  if (emptySquares().length === 0 && checkWin(origBoard, human) === null) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "grey";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    tiedGames += 1;
    document.getElementById("tied").innerText = tiedGames;
    return true;
  }
  return false;
}

function bestSpot() {
  return minimax(origBoard, ai).index;
}

function minimax(board, player) {
  var availableSpots = emptySquares(board);
  if (checkWin(board, human)) {
    return { score: -1 };
  } else if (checkWin(board, ai)) {
    return { score: 1 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = {};
    move.index = availableSpots[i];
    board[move.index] = player;

    if (player == ai) {
      var result = minimax(board, human);
      move.score = result.score;
    } else {
      var result = minimax(board, ai);
      move.score = result.score;
    }

    // backtracking
    board[move.index] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player == ai) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
