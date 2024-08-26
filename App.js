let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector('#reset-btn');
let newGameBtn= document.querySelector('#new-btn');
let msgContainer= document.querySelector('.msg-container');
let msg= document.querySelector('#msg');

//playerX , playerO
let turnO=true;

const winner = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

// boxes[0].innerText='x';
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        console.log("box was clicked");
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
        checkWinner();
    });
});

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

const showWinner = (winner) => {
    msg.innerText=`Congratulations ${winner} `;
    msgContainer.classList.remove("hide");
    disableBoxes();
}
    

const checkWinner = () =>{
    let pattern=[];
    for(pattern of winner){
        let pos1Val=boxes[pattern[0]].innerText;
        let pos2Val=boxes[pattern[1]].innerText;
        let pos3Val=boxes[pattern[2]].innerText;
        if(pos1Val!="" && pos2Val!="" && pos3Val!=""){
            if(pos1Val===pos2Val && pos1Val===pos3Val){
                console.log("Winner",pos1Val);
                showWinner(pos1Val);
                return;
            }
        }
    }  
    // Checking for a tie by iterating over all boxes, not patterns
    let filledBoxes = 0;
    for(let i = 0; i < 9; i++){
        if(boxes[i].innerText !== '') filledBoxes++;
    }
    if(filledBoxes === 9) {
        showWinner('It\'s a Tie');
    }
}



const disableBoxes = () =>{
    for(let box of boxes){
        box.disabled = true;
    }
}

const enableBoxes = () =>{
    for(let box of boxes){
        box.disabled = false;
        box.innerText=""
        msgContainer.classList.add("hide");
    }
}


const resetGame = () =>{
    turnO =true;
    enableBoxes();
    msgContainer.classList.add("hide");
}

newGameBtn.addEventListener('click',()=>enableBoxes());
resetBtn.addEventListener('click',()=>resetGame());








ai='x';
human='o';
function bestMove(board){
    let bestScore=-Infinity;
    let move;
    for (let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            //is spot available?
            if(board[i][j]==''){
                board[i][j]=ai;
                let score=minimax(board,0,false);
                board[i][j]='';
                if(score>bestScore){
                    bestScore=score;
                    move={i,j};
                }
            }
        }
    }
    console.log(board);
    return (3*move.i+move.j);
}

const checkWinner1 = (board) =>{
    for(let pattern of winner){
        let pos1Val=board[Math.floor(pattern[0]/3)][pattern[0]%3];
        let pos2Val=board[Math.floor(pattern[1]/3)][pattern[1]%3];
        let pos3Val=board[Math.floor(pattern[2]/3)][pattern[2]%3];
        if(pos1Val!='' && pos2Val!='' && pos3Val!=''){
            if(pos1Val==pos2Val && pos1Val==pos3Val) return pos1Val
        }
    }
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(board[i][j]=='') return null
        }
    }
    return 'tie';
}

let scores = {
    x:1,
    o:-1,
    tie:0
}

function minimax(board,depth,isMaximazing){
    let result=checkWinner1(board);
    if(result != null){
        console.log(result);
        return scores[result];
    }
    if(isMaximazing){
        let bestScore=-Infinity;
        for (let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                //is spot available?
                if(board[i][j]==''){
                    board[i][j]=ai;
                    let score=minimax(board,depth+1,false);
                    board[i][j]='';
                    if(score>bestScore){
                        bestScore=score;
                    }
                }
            }
        }
        return bestScore;
    }
    else {
        let bestScore=Infinity;
        for (let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                //is spot available?
                if(board[i][j]==''){
                    board[i][j]=human;
                    let score=minimax(board,depth+1,true);
                    board[i][j]='';
                    if(score<bestScore){
                        bestScore=score;
                    }
                }
            }
        }
        return bestScore;
    }
}



