function Checkers(){
  //Starting board layout
  const GAME = 0;
  const STANDARD_GAME = 0;
  const CHECK_JUMP    = 1;
  const CHECK_EXPOSED = 2;
  const CENTER_PIECES = 3;
  const DOUBLE_JUMP   = 4;

  const DIFFICULTY = 4; //recursion goes to 2*DIFFICULTY - 1 depth
  let PRINT_TREE = (DIFFICULTY<3); //SET DIFFICULTY TO <3

  //Colors
  const COLOR_RED   = '#FF0000';
  const COLOR_OFFRED = '#660000';
  const COLOR_BLACK = '#000000';
  const COLOR_OFFBLACK = '#666666'
  const COLOR_WHITE = '#FFFFFF';
  const COLOR_NEON  = '#66FF00';
  const COLOR_LIGHTBROWN = '#CC8855';

  this.board = Make2DArray();
  switch(GAME){
    case STANDARD_GAME:
      this.board = [[-1, 0,-1, 0, 0, 0, 1, 0],
                    [ 0,-1, 0, 0, 0, 1, 0, 1],
                    [-1, 0,-1, 0, 0, 0, 1, 0],
                    [ 0,-1, 0, 0, 0, 1, 0, 1],
                    [-1, 0,-1, 0, 0, 0, 1, 0],
                    [ 0,-1, 0, 0, 0, 1, 0, 1],
                    [-1, 0,-1, 0, 0, 0, 1, 0],
                    [ 0,-1, 0, 0, 0, 1, 0, 1]];
      break;
    case CHECK_JUMP:
      this.board = [[ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0,-2, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 1, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0,-2, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0]];
      break;
    case CHECK_EXPOSED:
      this.board = [[ 0, 0, 0, 0, 2, 0, 1, 0],
                    [ 0, 0, 0, 0, 0, 0, 0,-2],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0,-2, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0]];
      break;
    case CENTER_PIECES:
      this.board = [[ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 2, 0, 0, 0, 0, 0],
                    [ 0, 0, 0,-2, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0]];
      break;
    case DOUBLE_JUMP:
      this.board = [[ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 2, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 2, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0,-2, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0],
                    [ 0, 0, 0, 0, 0, 0, 0, 0]];
      break;
  }
  this.selected = new Selected();
  this.eval = 0;
  let recursions = 0;

  this.DrawBoard = function(){
    fill(COLOR_LIGHTBROWN);
    rect(0,0,720,720);
    fill('#660000');
    rect(30,30,660,660);
    for(let i=0; i<4; i++){
      for(let j=0; j<4; j++){
        fill(COLOR_LIGHTBROWN);
        rect(40 + i*160,40 + j*160,80,80);
        rect(120 + i*160,120 + j*160,80,80);
        fill('#662211');
        rect(40 + i*160,120 + j*160,80,80);
        rect(120 + i*160,40 + j*160,80,80);
      }
    }

    for(let i=0; i<8; i++){
      for(let j=0; j<8; j++){
        if((i-j)%2 == 0){
          let king = (abs(this.board[i][j]) == 2);

          let color = COLOR_BLACK;
          if(this.board[i][i] > 0)
            color = COLOR_RED;

          if(this.board[i][j] > 0)
            this.DrawPiece(COLOR_RED, i, j, king, false);
          if(this.board[i][j] < 0)
            this.DrawPiece(COLOR_BLACK, i, j, king, false);
        }
      }
    }
  }

  this.DrawPiece = function(color, x, y, king, clicked){
    let posx = (x+1)*80;
    let posy = (y+1)*80;
    fill(color);
    ellipse(posx, posy, 64, 64);

    if(x == this.selected.x && y == this.selected.y)
      stroke(COLOR_NEON);
    else if(color == COLOR_RED)
      stroke(COLOR_OFFRED);
    else if(color == COLOR_BLACK)
      stroke(COLOR_OFFBLACK);

    strokeWeight(2);
    ellipse(posx, posy, 54, 54);
    strokeWeight(1);
    ellipse(posx, posy, 46, 46);

    if(king){
      noFill()
      strokeWeight(2)
      rect(posx-7, posy-7, 14, 14, 3);
      rect(posx-12, posy-12, 24, 24, 3);
      strokeWeight(1);
    }
    stroke(COLOR_BLACK);
  }

  this.CheckEndGame = function(){
    if(!this.BlackPiecesExist(this.board)){
      console.log("Red has won");
      return true;
    }
    if(!this.RedPiecesExist(this.board)){
      console.log("Black has won");
      return true;
    }
    return false;
  }

  this.RedMove = function(x,y){
    //At this point a piece is selected and a click occured on an empty square
    //we need to test for legal moves being attempted.

    //If moving Red forward
    if(y == this.selected.y-1 && (x == this.selected.x-1 || x == this.selected.x+1)){
      this.MoveSelectedPiece(x,y);
    }
    //Moving red kings backwards
    else if(this.board[this.selected.x][this.selected.y] == 2 && y == this.selected.y+1 && (x == this.selected.x-1 || x == this.selected.x+1)){
      this.MoveSelectedPiece(x,y);
    }
    //Jump over black to the left
    else if(x == this.selected.x-2 && y == this.selected.y-2 && this.board[this.selected.x-1][this.selected.y-1] < 0){
      this.MoveSelectedPiece(x,y);
    }
    //Jump over black to the right
    else if(x == this.selected.x+2 && y == this.selected.y-2 && this.board[this.selected.x+1][this.selected.y-1] < 0){
      this.MoveSelectedPiece(x,y);
    }
    //Jump back and left with a king
    else if(x == this.selected.x-2 && y == this.selected.y+2 && this.board[this.selected.x-1][this.selected.y+1] < 0){
      this.MoveSelectedPiece(x,y);
    }
    //Jump back and right with a king
    else if(x == this.selected.x+2 && y == this.selected.y+2 && this.board[this.selected.x+1][this.selected.y+1] < 0){
      this.MoveSelectedPiece(x,y);
    }
    else{
      return false;
    }

    return true; //if we got to here a legal move was made
  }

  this.BlackMove = function(){
    //setup
    recursions = 0;
    let d = (DIFFICULTY*2)-1;

    //perform the recursive mini-max tree
    eval = this.MakeTree(this.board,true,d);

    //print results
    console.log("Board States Checked: " + recursions)
    console.log("Static Eval after black moves:");
    this.StaticEval(this.board,true);
  }

  this.MakeTree = function(board, firstTime, lvl){
    let temp = Make2DArray();
    let bestMove = Make2DArray();
    Copy2DArray(board,bestMove);
    let staticValue = 0;
    let max = Number.MIN_SAFE_INTEGER; //Nothing will be smaller
    let min = Number.MAX_SAFE_INTEGER; //Nothing will be larger
    recursions++;

    if(PRINT_TREE){
      console.log("-------------recursion lvl: " + lvl);
      this.ConsolePrintBoard(board);
      console.log('Static Eval: ' + this.StaticEval(board, false))
    }
    if(lvl == 0){
      return this.StaticEval(board, false);
    }

    //Look at each move that each piece can make and recurse on that
    for(let i=0; i<8; i++){
      for(let j=0; j<8; j++){

        //if piece is black and lvl is even (On black's turn we maximize)
        if(lvl%2 == 1 && board[i][j] < 0){

          //Jump down and left
          if(i>1 && j<6 && board[i-2][j+2] == 0 && board[i-1][j+1] > 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i-2, j+2);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (max < staticValue){
              max = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Jump down and right
          if (i<6 && j<6 && board[i+2][j+2] == 0 && board[i+1][j+1] > 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i+2, j+2);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (max < staticValue){
              max = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Move down and left
          if (i>0 && j<7 && board[i-1][j+1] == 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i-1, j+1);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (max < staticValue){
              max = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Move down and right
          if (i<7 && j<7 && board[i+1][j+1] == 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i+1, j+1);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (max < staticValue){
              max = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Special Cases for kings
          if (board[i][j] == -2){

            //Jump forward and left
            if (i>1 && j>1 && board[i-2][j-2] == 0 && board[i-1][j-1] > 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i-2, j-2)
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (max < staticValue){
                max = staticValue;
                Copy2DArray(temp, bestMove);
              }
              if (this.JumpAvailable(temp, i-2, j-2)){
                if(PRINT_TREE)console.log("Jump available");
              }
            }

            //Jump forward and right
            if (i<6 && j>1 && board[i+2][j-2] == 0 && board[i+1][j-1] > 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i+2, j-2)
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (max < staticValue){
                max = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

            //Move back and left
            if (i>0 && j>0 && board[i-1][j-1] == 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i-1, j-1)
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (max < staticValue){
                max = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

            //Move back and right
            if (i<7 && j>0 && board[i+1][j-1] == 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i+1, j-1)
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (max < staticValue){
                max = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }
          }
        }

        //if piece is red and lvl is even (On red's turn we minimize)
        else if(lvl%2 == 0 && board[i][j] > 0){

          //Jump up and left
          if (i>1 && j>1 && board[i-2][j-2] == 0 && board[i-1][j-1] < 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i-2, j-2);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (min > staticValue){
              min = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Jump up and right
          if (i<6 && j>1 && board[i+2][j-2] == 0 && board[i+1][j-1] < 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i+2, j-2);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (min > staticValue){
              min = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Move up and left
          if (i>0 && j>0 && board[i-1][j-1] == 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i-1, j-1);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (min > staticValue){
              min = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Move up and right
          if (i<7 && j>0 && board[i+1][j-1] == 0){
            Copy2DArray(board, temp);
            temp = this.MovePiece(temp, i, j, i+1, j-1);
            staticValue = this.MakeTree(temp, false, lvl-1);
            if (min > staticValue){
              min = staticValue;
              Copy2DArray(temp, bestMove);
            }
          }

          //Special cases for kings
          if (board[i][j] == 2){

            //Jump back and left
            if (i>1 && j<6 && board[i-2][j+2] == 0 && board[i-1][j+1] < 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i-2, j+2);
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (min > staticValue){
                min = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

            //Jump back and right
            if (i<6 && j<6 && board[i+2][j+2] == 0 && board[i+1][j+1] < 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i+2, j+2);
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (min > staticValue){
                min = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

            //Move back and left
            if (i>0 && j<7 && board[i-1][j+1] == 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i-1, j+1);
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (min > staticValue){
                min = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

            //Move back and right
            if (i<7 && j<7 && board[i+1][j+1] == 0){
              Copy2DArray(board, temp);
              temp = this.MovePiece(temp, i, j, i+1, j+1);
              staticValue = this.MakeTree(temp, false, lvl-1);
              if (min > staticValue){
                min = staticValue;
                Copy2DArray(temp, bestMove);
              }
            }

          }
        }
      }
    }

    if(firstTime) {
      Copy2DArray(bestMove, this.board);
      return max;
    }
    else if(max == Number.MIN_SAFE_INTEGER && min == Number.MAX_SAFE_INTEGER){
      if(lvl%2==1){
        return max;
      } else {
        return min;
      }
    }
    else {
      return this.StaticEval(bestMove, false);
    }
  }

  this.StaticEval = function(board, print){

    if(!this.RedPiecesExist(board))
      return Number.MAX_SAFE_INTEGER-1; //Make this a touch smaller so that it is large but not larger than the default number
    if(!this.BlackPiecesExist(board))
      return Number.MIN_SAFE_INTEGER+1;

    let base = 50;
    let eval = 0;

    let pieceScore = 0;
    let exposedPieces = 0;
    let openEdges = 0;
    let centerDistance = 0;

    //count pieceScore
    let numPieces = 0
    for(let i=0; i<4; i++){
      for(let j=0; j<8; j++){
        if(board[i*2 + (j%2)][j] != 0)
          numPieces++;
      }
    }

    for(let oi=0; oi<4; oi++){
      for(let j=0; j<8; j++){
        let i = (oi*2) + (j%2); //a way to reduce number of loops needed

        //If early game
        if(numPieces > 18){

          //Count number of red and black pieces
          if(board[i][j] > 0)
            pieceScore -= board[i][j]*base*2;
          if(board[i][j] < 0)
            pieceScore -= board[i][j]*base*3;


          //Number of exposed pieces
          if(board[i][j] < 0 && i>0 && i<7){ //if the exposed piece is black
            if((board[i-1][j+1] > 0 && board[i+1][j-1]==0) || (board[i+1][j+1] > 0 && board[i-1][j-1]==0)
            || (board[i-1][j-1] == 2 && board[i+1][j+1]==0) || (board[i+1][j-1] == 2 && board[i-1][j+1]==0))
                exposedPieces += base*board[i][j]*(1.5);
          }
          if (board[i][j] > 0 && i>0 && i<7){ //if exposed piece is red
            if((board[i-1][j-1] < 0 && board[i+1][j+1]==0) || (board[i+1][j-1] < 0 && board[i-1][j+1]==0)
            || (board[i-1][j+1] == 2 && board[i+1][j-1]==0) || (board[i+1][j+1] == 2 && board[i-1][j-1]==0))
                exposedPieces += base*board[i][j]*(1);
          }

          //Number of exposed top and bottom edge tiles (abality to get kings)
          if(i<4){
            if(board[i*2][0] >= 0) //if black home tile exposed or red
              openEdges -= base*(0.8);
            if(board[(i*2)+1][7] <= 0) //if red home tile exposed or black
              openEdges += base*(0.6);
            if(board[0][i*2] == 0 || board[7][i*2+1] == 0){ //look at edge tiles
              openEdges -= base*.25;
            }
          }
        }
        //If mid game
        else if (numPieces > 10) {

          //Count number of red and black pieces
          if(board[i][j] > 0)
            pieceScore -= board[i][j]*base*4;
          if(board[i][j] < 0)
            pieceScore -= board[i][j]*base*4;


          //Number of exposed pieces
          if(board[i][j] < 0 && i>0 && i<7){ //if the exposed piece is black
            if((board[i-1][j+1] > 0 && board[i+1][j-1]==0) || (board[i+1][j+1] > 0 && board[i-1][j-1]==0)
            || (board[i-1][j-1] == 2 && board[i+1][j+1]==0) || (board[i+1][j-1] == 2 && board[i-1][j+1]==0))
                exposedPieces += base*board[i][j]*(3.5);
          }
          if (board[i][j] > 0 && i>0 && i<7){ //if exposed piece is red
            if((board[i-1][j-1] < 0 && board[i+1][j+1]==0) || (board[i+1][j-1] < 0 && board[i-1][j+1]==0)
            || (board[i-1][j+1] == 2 && board[i+1][j-1]==0) || (board[i+1][j+1] == 2 && board[i-1][j-1]==0))
                exposedPieces += base*board[i][j]*(2.5);
          }

          //Number of exposed top and bottom edge tiles (abality to get kings)
          if(i<4){
            if(board[i*2][0] >= 0) //if black home tile exposed or red
              openEdges -= base*(1);
            if(board[(i*2)+1][7] <= 0) //if red home tile exposed or black
              openEdges += base*(0.5);
          }
        }
        //If end game
        else{

          //Count number of red and black pieces
          if(board[i][j] > 0)
            pieceScore -= board[i][j]*base*6;
          if(board[i][j] < 0)
            pieceScore -= board[i][j]*base*6;


          //Number of exposed pieces
          if(board[i][j] < 0 && i>0 && i<7){ //if the exposed piece is black
            if((board[i-1][j+1] > 0 && board[i+1][j-1]==0) || (board[i+1][j+1] > 0 && board[i-1][j-1]==0)
            || (board[i-1][j-1] == 2 && board[i+1][j+1]==0) || (board[i+1][j-1] == 2 && board[i-1][j+1]==0))
                exposedPieces += base*board[i][j]*(5);
          }
          if (board[i][j] > 0 && i>0 && i<7){ //if exposed piece is red
            if((board[i-1][j-1] < 0 && board[i+1][j+1]==0) || (board[i+1][j-1] < 0 && board[i-1][j+1]==0)
            || (board[i-1][j+1] == 2 && board[i+1][j-1]==0) || (board[i+1][j+1] == 2 && board[i-1][j-1]==0))
                exposedPieces += base*board[i][j]*(3);
          }

          if(board[i][j] < 0){
            centerDistance += base*board[i][j]*(abs(i-3.5)+abs(j-3.5))*0.5;
          }
          centerDistance = floor(centerDistance);
        }
      }
    }

    eval = pieceScore + exposedPieces + openEdges + centerDistance;

    if(print){
      console.log("pieceScore: " + pieceScore);
      console.log("exposedPieces: " + exposedPieces);
      console.log("openEdges: " + openEdges);
      if(numPieces <= 10) console.log("centerDistance: " + centerDistance);
      console.log("TOTAL: " + eval);
      console.log("------------------------");
    }

    return eval;
  }

  this.MoveSelectedPiece = function(x,y){
    //Move piece
    if(y == 0){
      this.board[x][y] = 2; //set to king
    }
    else {
      this.board[x][y] = this.board[this.selected.x][this.selected.y];
    }

    //Remove the old piece
    this.board[this.selected.x][this.selected.y] = 0;

    //If a jump was made, delete the jumped piece
    if(abs(x-this.selected.x)==2 || abs(y-this.selected.y)==2){
      this.board[this.selected.x + ((x-this.selected.x)/2)][this.selected.y + ((y-this.selected.y)/2)] = 0;
    }

    //Remove the selected state of the moved piece
    this.selected.Reset();
    console.log("Static Eval after red moves:");
    this.eval = this.StaticEval(this.board, true);
  }

  this.MovePiece = function(board, startx, starty, endx, endy){
    //Move piece
    if (endy == 7 && board[startx][starty]<0) {//king black pieces on the bottom
      board[endx][endy] = -2;
    }
    else if (endy == 0 && board[startx][starty]>0) { //king red pieces on the top
      board[endx][endy] = 2;
    }
    else {
      board[endx][endy] = board[startx][starty];
    }

    //Remove the old piece
    board[startx][starty] = 0;

    //If a jump was made, delete the jumped piece
    if(abs(endx-startx)==2 || abs(endy-starty)==2){
      board[startx + ((endx-startx)/2)][starty + ((endy-starty)/2)] = 0;
    }

    return board;
  }

  this.JumpAvailable = function(board, x, y){
    if(board[x][y] > 0){ //if red
      if(x>1 && y>1 && board[x-2][y-2] == 0 && board[x-1][y-1] < 0){
        return true;
      }
      if(x<6 && y>1 && board[x+2][y-2] == 0 && board[x+1][y-1] < 0){
        return true;
      }
      if(x>1 && y<6 && board[x-2][y+2] == 0 && board[x-1][y+1] < 0 && board[x][y] == 2){
        return true;
      }
      if(x<6 && y<6 && board[x+2][y+2] == 0 && board[x+1][y+1] < 0 && board[x][y] == 2){
        return true;
      }
    }

    if(board[x][y] < 0){ //if black
      if(x>1 && y>1 && board[x-2][y-2] == 0 && board[x-1][y-1] > 0 && board[x][y] == -2){
        return true;
      }
      if(x<6 && y>1 && board[x+2][y-2] == 0 && board[x+1][y-1] > 0 && board[x][y] == -2){
        return true;
      }
      if(x>1 && y<6 && board[x-2][y+2] == 0 && board[x-1][y+1] > 0){
        return true;
      }
      if(x<6 && y<6 && board[x+2][y+2] == 0 && board[x+1][y+1] > 0){
        return true;
      }
    }

    return false;
  }

  this.RedPiecesExist = function(board){
    for(let i=0; i<4; i++){
      for(let j=0; j<8; j++){
        if(board[i*2 + (j%2)][j] > 0)
          return true
      }
    }
    return false
  }

  this.BlackPiecesExist = function(board){
    for(let i=0; i<4; i++){
      for(let j=0; j<8; j++){
        if(board[i*2 + (j%2)][j] < 0)
          return true
      }
    }
    return false
  }

  this.ConsolePrintBoard = function(board){
    for(let i=0; i<8; i++){
      console.log("line" + i + ": " + board[0][i] + " " + board[1][i] + " " + board[2][i] + " " + board[3][i] + " " + board[4][i] + " " + board[5][i] + " " + board[6][i] + " " + board[7][i]);
    }
  }

}

function Make2DArray(){
  let x = new Array(8);
  for (let i = 0; i < 8; i++) {
    x[i] = new Array(8);
  }
  return x;
}

function Copy2DArray(x, y){
  for(let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      y[i][j] = x[i][j];
    }
  }
}



//Selected Class
function Selected(){
  this.x = -1;
  this.y = -1;

  this.Reset = function(){
    this.x = -1;
    this.y = -1;
  }

  this.Set = function(x,y){
    this.x = x;
    this.y = y;
  }
}
