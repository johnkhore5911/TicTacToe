let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector('#reset-btn');
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');

// PlayerX , PlayerO
let turnO = true;

const winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize AI and human players
const ai = 'x';
const human = 'o';

// Function to get the current state of the board
function getCurrentBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i][j] = boxes[i * 3 + j].innerText;
        }
    }
    return board;
}

// Function to show the winner
const showWinner = (winner) => {
    msg.innerText = `Congratulations, the Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

// Function to check if there's a winner or tie
const checkWinner = () => {
    for (let pattern of winner) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            showWinner(pos1Val);
            return true;
        }
    }
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a tie!";
        msgContainer.classList.remove("hide");
        disableBoxes();
        return true;
    }
    return false;
}

// Function to disable all boxes (end the game)
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

// Function to enable all boxes (start a new game)
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
    msgContainer.classList.add("hide");
}

// Function to reset the game
const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
}

// Add event listeners for new game and reset buttons
newGameBtn.addEventListener('click', () => enableBoxes());
resetBtn.addEventListener('click', () => resetGame());

// AI's move calculation using the minimax algorithm
function bestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    return 3 * move.i + move.j;
}

// Minimax algorithm for AI decision making
function minimax(board, depth, isMaximizing) {
    let result = checkWinner1(board);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

// Score mapping for the minimax algorithm
const scores = {
    x: 1,
    o: -1,
    tie: 0
}

// Function to check the winner specifically for the minimax algorithm
const checkWinner1 = (board) => {
    for (let pattern of winner) {
        let pos1Val = board[Math.floor(pattern[0] / 3)][pattern[0] % 3];
        let pos2Val = board[Math.floor(pattern[1] / 3)][pattern[1] % 3];
        let pos3Val = board[Math.floor(pattern[2] / 3)][pattern[2] % 3];
        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            return pos1Val;
        }
    }
    if (board.flat().every(cell => cell !== "")) {
        return 'tie';
    }
    return null;
}

// Event listeners for box clicks (player's move and AI's move)
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerHTML === "") {
            box.innerText = turnO ? 'o' : 'x';  // Player's move
            turnO = !turnO;
            if (checkWinner()) return;  // If player wins, stop here

            if (!turnO) {  // AI's move
                let board = getCurrentBoard();
                let move = bestMove(board);
                boxes[move].innerText = 'x';
                turnO = !turnO;
                checkWinner();
            }
        }
    });
});
