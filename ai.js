ai='x';
human='o';

function bestMove(){
    //AI to make its turn
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
    board[move.i][move.j]=ai;
    currentPlayer=human;
}

let scores = {
    x:1,
    o:-1,
    tie:0
}

function minimax(board,depth,isMaximazing){
    let result=checkWinner();
    if(result != null){
        let score = scores[result];
        return score
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