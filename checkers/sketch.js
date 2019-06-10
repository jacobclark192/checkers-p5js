let blackTurn = false;
let nextLoop = false;

function setup() {
  // put setup code here
  createCanvas(720,720);
  c = new Checkers();
  blackMove = false;
}

function draw() {
  if(nextLoop){
    nextLoop = false;
    c.BlackMove();
  }
  //This sets up a black move on the next iteration
  //This way the red move will be drawn and then the black move's recursion will occur
  if(blackTurn){
    blackTurn = false;
    nextLoop = true;
  }
  c.DrawBoard();
  if(c.CheckEndGame())
    noLoop();
}

function mouseReleased(){
  x = floor((mouseX-40)/80);
  y = floor((mouseY-40)/80);

  //If a click occured on an actual game space (lighter squares)
  if(x >= 0 && x <= 7 && y >= 0 && y <= 7 && ((x-y)%2 == 0)){

    //If a selected piece was clicked, unselect it
    if(c.selected.x == x && c.selected.y == y){
      c.selected.Reset();
    }
    //If a piece was clicked that isn't selected, select it
    else if(c.board[x][y] > 0){
      c.selected.Set(x,y);
    }
    //If an open space was clicked, check to see if a legal move is being made
    else if(c.board[x][y] == 0 && c.selected.x >= 0 && c.selected.y >= 0){
      if(c.RedMove(x,y) && c.BlackPiecesExist(c.board)){
        blackTurn = true;
      }
    }
  }

  return false; //always return false for system reasons
}
