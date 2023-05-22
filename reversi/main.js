/*----- constants -----*/
// import "./style.css";
// import javascriptLogo from "./javascript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.js";
const boardEl = document.querySelector(".board");
const msgEl = document.querySelector(".msgEl");
const COLORS = {
  0: "rgb(84,150,109)",
  // 1: "rgb(209,209,209)",
  1: "white",
  "-1": "black",
};

/*----- state variables -----*/
let board = [];
let turn = 1; // 1 or -1
let winner = null; //null = no winner; 1 or -1 = winner; 'T' = Tie
let startedGame = null;
let maxTurns;
let turnsLeft;
let length;
let whiteCount = 0;
let blackCount = 0;

/*----- cached elements  -----*/
const turnWindow = document.querySelector("#turnWindow");
const startButton = document.querySelector("#startButton");

/*----- event listeners -----*/

function init() {
  startButton.addEventListener("click", initBoard);
  render();
  // const startingBoard = initBoard();
  console.log("Starting board", board);
}

/*----- functions -----*/
function initBoard() {
  const inputLength = document.querySelector("#inputLength").value;
  length = Number(inputLength);
  let row = length;
  let column = length;
  const startingBoard = [];
  changeRowColumnGridStyle(length);
  for (let i = 0; i < row; i++) {
    startingBoard[i] = [];
    // console.log("row", board);
    for (let j = 0; j < column; j++) {
      if (i == length / 2 && j == length / 2) {
        startingBoard[i][j] = 1;
        startingBoard[i - 1][j - 1] = 1;
        startingBoard[i - 1][j] = -1;
        startingBoard[i][j - 1] = -1;
      } else {
        startingBoard[i][j] = 0;
      }
    }
  }
  turn = 1;
  winner = null;
  startedGame = true;
  console.log("turn", turn);
  console.log("Init board", startingBoard);
  board = startingBoard;
  maxTurns = length * length - 4;
  turnsLeft = maxTurns;
  console.log("max turns: ", maxTurns);

  render();
}

function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderBoard() {
  const boardSection = document.querySelector("#board");

  //Clear everything
  boardSection.innerHTML = "";
  let cell = 0;
  board.forEach(function (colArr, colIdx) {
    // Iterate over the cells in the cur column (colArr)
    colArr.forEach(function (cellVal, rowIdx) {
      const divSquare = document.createElement("div");
      boardSection.append(divSquare);
      divSquare.style.backgroundColor = COLORS[0];
      const divPieces = document.createElement("div");
      divPieces.classList.add("pieces");
      // divPieces.id = `c${colIdx}r${rowIdx}`;
      divPieces.id = cell;
      cell++;
      // console.log("evtListener", turnsLeft);
      // if (turnsLeft == 0) {
      //   divPieces.removeEventListener("click", playerEvt);
      //   console.log("GAME");
      // }
      divPieces.addEventListener("click", playerEvt);
      divSquare.append(divPieces);
      divPieces.style.backgroundColor = COLORS[cellVal];
    });
  });
}

function playerEvt(evt) {
  let TileCoor = evt.target.getAttribute("id");
  TileCoor;
  console.log("length", length);
  console.log("tileCoor:", TileCoor);
  let TileCoorX = Math.floor(TileCoor / length);
  let TileCoorY = TileCoor % length;
  console.log("X:", TileCoorX);
  console.log("Y", TileCoorY);
  board[TileCoorX][TileCoorY] = turn;
  // document.getElementById("0").removeEventListener("click", playerEvt);
  checkSurrounding(TileCoorX, TileCoorY);
  checkCount();
  console.log("bC", blackCount);
  console.log("wC", whiteCount);
  turn = turn * -1;
  console.log("player turn: ", turn);
  turnsLeft--;
  console.log("turns Left: ", turnsLeft);
  // checkZeroTurnsLeftRemoveListener();
  console.log(board);
  render();
}

function checkZeroTurnsLeftRemoveListener() {
  if (turnsLeft === 0) {
    console.log("GAMEOVER");
    board.forEach(function (colArr, colIdx) {
      // Iterate over the cells in the cur column (colArr)
      colArr.forEach(function (cellVal, rowIdx) {
        // divPieces.classList.add("pieces");
        // divPieces.removeEventListener("click", playerEvt);
        // divSquare.append(divPieces);
      });
    });
  }
}

function renderMessage() {
  if (turnsLeft <= 0) {
    msgEl.innerHTML = "Game over!";
    console.log("game!");
  } else {
    msgEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[
      turn
    ].toUpperCase()}</span>'s Turn`;
  }
}
function renderControls() {
  if (startedGame) {
    startButton.style.visibility = "hidden";
    msgEl.style.visibility = "visible";
    turnWindow.style.visibility = "visible";
  } else {
    startButton.style.visibility = "visible";
    msgEl.style.visibility = "hidden";
    turnWindow.style.visibility = "hidden";
  }
}

function checkCount() {
  let row = length;
  let column = length;
  whiteCount = 0;
  blackCount = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (board[i][j] == 1) {
        whiteCount++;
      }
      if (board[i][j] == -1) blackCount++;
    }
  }
}
function checkSurrounding(TileCoorX, TileCoorY) {
  let count = 0;
  let row = length;
  let column = length;
  let borderedBoard = [];
  for (let i = 0; i < row + 2; i++) {
    borderedBoard[i] = [];
    for (let j = 0; j < column + 2; j++) {
      borderedBoard[i][j] = 2;
    }
  }
  console.log("border", borderedBoard);

  //import board into borderedBoard
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      borderedBoard[i + 1][j + 1] = board[i][j];
    }
  }
  console.log(borderedBoard);

  let borderedBoardX = TileCoorX + 1;
  let borderedBoardY = TileCoorY + 1;

  //check east in bordered
  let cachedTileCoorXBordered = borderedBoardX;
  let cachedTileCoorYBordered = borderedBoardY;

  console.log("X", borderedBoardX);
  console.log("Y", borderedBoardY);
  console.log("T", turn);
  while (borderedBoard[borderedBoardX][borderedBoardY + 1] == -turn) {
    console.log("East works");
    borderedBoardY++;
    console.log("borderedBoardY", borderedBoardY);
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX][borderedBoardY + 1] == turn) {
      console.log("X", borderedBoardX, "Y", borderedBoardY + 1);

      console.log("Check east positive");
      borderedBoardY = borderedBoardY - count + 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX][borderedBoardY + i] = turn;
        console.log(borderedBoardX);
        console.log(borderedBoardY + i);
        console.log("flip", i);
      }

      console.log("East complete!");
    }
  }

  //Check West
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;

  count = 0;
  while (borderedBoard[borderedBoardX][borderedBoardY - 1] == -turn) {
    console.log("West works");
    borderedBoardY--;
    console.log("borderedBoardY", borderedBoardY);
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX][borderedBoardY - 1] == turn) {
      console.log("X", borderedBoardX, "Y", borderedBoardY + 1);

      console.log("Check west positive");
      borderedBoardY = borderedBoardY + count - 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX][borderedBoardY - i] = turn;
        console.log(borderedBoardX);
        console.log(borderedBoardY + i);
        console.log("flip", i);
      }

      console.log("West complete!");
    }
  }

  //Check South in bordered

  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;
  count = 0;
  while (borderedBoard[borderedBoardX + 1][borderedBoardY] == -turn) {
    console.log("South works");
    borderedBoardX++;
    console.log("borderedBoardX", borderedBoardX);
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX + 1][borderedBoardY] == turn) {
      console.log("X", borderedBoardX + 1, "Y", borderedBoardY);

      console.log("Check south positive");
      borderedBoardX = borderedBoardX - count + 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX + i][borderedBoardY] = turn;
        console.log(borderedBoardX + i);
        console.log(borderedBoardY);
        console.log("flipB", i);
      }
    }
  }
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;

  count = 0;
  //Check North in bordered
  while (borderedBoard[borderedBoardX - 1][borderedBoardY] == -turn) {
    console.log("North works");
    borderedBoardX--;
    console.log("borderedBoardX", borderedBoardX);
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX - 1][borderedBoardY] == turn) {
      console.log("Check north positive");
      borderedBoardX = borderedBoardX + count - 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX - i][borderedBoardY] = turn;
      }
    }
  }

  //Check SE in bordered
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;
  count = 0;
  while (borderedBoard[borderedBoardX + 1][borderedBoardY + 1] == -turn) {
    console.log("SE works");
    borderedBoardX++;
    borderedBoardY++;
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX + 1][borderedBoardY + 1] == turn) {
      console.log("Check SE positive");
      borderedBoardX = borderedBoardX - count + 1;
      borderedBoardY = borderedBoardY - count + 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX + i][borderedBoardY + i] = turn;
      }
    }
  }

  //Check NW in bordered
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;
  count = 0;
  while (borderedBoard[borderedBoardX - 1][borderedBoardY - 1] == -turn) {
    console.log("NW works");
    borderedBoardX--;
    borderedBoardY--;
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX - 1][borderedBoardY - 1] == turn) {
      console.log("Check SE positive");
      borderedBoardX = borderedBoardX + count - 1;
      borderedBoardY = borderedBoardY + count - 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX - i][borderedBoardY - i] = turn;
      }
    }
  }

  //Check NE in bordered
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;
  count = 0;
  while (borderedBoard[borderedBoardX - 1][borderedBoardY + 1] == -turn) {
    console.log("NE works");
    borderedBoardX--;
    borderedBoardY++;
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX - 1][borderedBoardY + 1] == turn) {
      console.log("Check NE positive");
      borderedBoardX = borderedBoardX + count - 1;
      borderedBoardY = borderedBoardY - count + 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX - i][borderedBoardY + i] = turn;
      }
    }
  }

  //Check SW in bordered
  borderedBoardX = cachedTileCoorXBordered;
  borderedBoardY = cachedTileCoorYBordered;
  count = 0;
  while (borderedBoard[borderedBoardX + 1][borderedBoardY - 1] == -turn) {
    console.log("NE works");
    borderedBoardX++;
    borderedBoardY--;
    count++;
    console.log("count", count);
    if (borderedBoard[borderedBoardX + 1][borderedBoardY - 1] == turn) {
      console.log("Check NE positive");
      borderedBoardX = borderedBoardX - count + 1;
      borderedBoardY = borderedBoardY + count - 1;
      for (let i = 0; i < count; i++) {
        borderedBoard[borderedBoardX + i][borderedBoardY - i] = turn;
      }
    }
  }

  //Port borderedBoard back to board
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      board[i][j] = borderedBoard[i + 1][j + 1];
    }
  }
}

function changeRowColumnGridStyle(length) {
  if (length == 4) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(4, 10vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(4, 10vmin)";
  } else if (length == 6) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(6, 10vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(6, 10vmin)";
  } else if (length == 8) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(8, 10vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(8, 10vmin)";
  } else if (length == 10) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(10, 10vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(10, 10vmin)";
  } else if (length == 12) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(12, 8vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(12, 8vmin)";
  } else if (length == 14) {
    document.getElementById("board").style.gridTemplateColumns =
      "repeat(14, 8vmin)";
    document.getElementById("board").style.gridTemplateRows =
      "repeat(14, 8vmin)";
  }
}

init();
