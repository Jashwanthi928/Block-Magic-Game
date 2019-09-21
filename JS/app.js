const canvas=document.getElementById("Block");
const scoreElement = document.getElementById("score");
const ctx = canvas.getContext("2d")
const ROW=20;
const COL=column=10;
const sqsquareSize = SQ =25;
let grd = ctx.createLinearGradient(500,0,700,700);
          grd.addColorStop(0,"#8bcbf1");
          grd.addColorStop(1,"white");
const VACANT = grd; // color of an empty square
let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT
    }
}
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}


function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
             
        }
    }
}



class Blockmagiclogic{
    constructor(tetromino,color){
        this.tetromino = tetromino;
        this.color = color
        
        this.tetrominoN = 0; // we start from the first pattern
        this.activeTetromino = this.tetromino[this.tetrominoN];
            // we need to control the pieces
        this.x = 3;
        this.y = -2;    
    }



    draw (){
        this.fill(this.color);
    }

    unDraw(){
        this.fill(VACANT);
    }

    fill (color){
        for( r = 0; r < this.activeTetromino.length; r++){
            for(c = 0; c < this.activeTetromino.length; c++){
                // we draw only occupied squares
                if( this.activeTetromino[r][c]){
                    drawSquare(this.x + c,this.y + r, color);
                }
            }
        }    
    }

    moveDown(){
        if(!this.collision(0,1,this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.draw();
        }else{
            // we lock the piece and generate a new one
            this.lock();
            p = randomPiece();
        }

    }

    moveRight = function(){
        if(!this.collision(1,0,this.activeTetromino)){
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    
    moveLeft = function(){
        if(!this.collision(-1,0,this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.draw();
        }
    }




    rotate(){
        let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
        let kick = 0;
        if(this.collision(0,0,nextPattern)){
            if(this.x > COL/2){
                // it's the right wall
                kick = -1; // we need to move the piece to the left
            }else{
                // it's the left wall
                kick = 1; // we need to move the piece to the right
            }
        }
        
        if(!this.collision(kick,0,nextPattern)){
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }





    lock(){
        for( r = 0; r < this.activeTetromino.length; r++){
            for(c = 0; c < this.activeTetromino.length; c++){
                // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                    continue;
                }
                // pieces to lock on top = game over
                if(this.y + r < 0){
                    
                    alert("Game Over");
                    // stop request animation frame
                    gameOver = true;
                    break;
                }
                // we lock the piece
                board[this.y+r][this.x+c] = this.color;
            }
        }
        // remove full rows
        for(r = 0; r < ROW; r++){
            let isRowFull = true;
            for( c = 0; c < COL; c++){
                isRowFull = isRowFull && (board[r][c] != VACANT);
            }
            if(isRowFull){
                // if the row is full
                // we move down all the rows above it
                for(let y = r; y > 1; y--){
                    for( c = 0; c < COL; c++){
                        board[y][c] = board[y-1][c];
                    }
                }
                // the top row board[0][..] has no row above it
                for( c = 0; c < COL; c++){
                    board[0][c] = VACANT;
                }
                // increment the score
                score += 10;
            }
        }
        // update the board
        drawBoard();
        
        // update the score
        scoreElement.innerHTML = score;
    }
    
    

     collision(x,y,piece){
        for( r = 0; r < piece.length; r++){
            for(c = 0; c < piece.length; c++){
                // if the square is empty, we skip it
                if(!piece[r][c]){
                    continue;
                }
                // coordinates of the piece after movement
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                
                // conditions
                if(newX < 0 || newX >= COL || newY >= ROW){
                    return true;
                }
                // skip newY < 0; board[-1] will crush our game
                if(newY < 0){
                    continue;
                }
                // check if there is a locked piece alrady in place
                if( board[newY][newX] != VACANT){
                    return true;
                }
            }
        }
        return false;
    }
    

}


function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Blockmagiclogic( PIECES[r][0],PIECES[r][1]);
}

let score = 0;
let p = randomPiece()

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}
let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1*200 ){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}


drop();
drawBoard();
