var cols, rows;
var w;
var grid = [];
var current;
var stack = [];
var createMaze = false;
var test = 0;

var wid;
var hei;

var googleFontsCinzel;

var dfsImg1;
var dfsImg2;
var dfsImg3;
var dfsImg4;

var asaImg1;
var asaImg2

//screens
var titleScreenIsRunning = true;
var instructionsScreenIsRunning = false;

var openList = [];
var closedSet = [];
var start;
var end;
var weight, heuristic;
var directTest = false;
var foundPath = false;
var solveMaze = false;
var question = false;
var showAlert = true;

function preload() {
  googleFontsCinzel = loadFont("assets/Abel-Regular.ttf");
  dfsImg1 = loadImage("assets/dfs1.png");
  dfsImg2 = loadImage("assets/dfs2.png");
  dfsImg3 = loadImage("assets/dfs3.png");
  dfsImg4 = loadImage("assets/dfs4.png");
  asaImg1 = loadImage("assets/ASA1.png");
  asaImg2 = loadImage("assets/ASA2.png");
}

function resetVariables() {
  directTest = false;
  foundPath = false;
  solveMaze = false;
  question = false;
  openList = [];
  closedSet = [];
  grid = [];
  current;
  stack = [];
  createMaze = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
	resetVariables();
	w = windowWidth/48;
  titleScreenIsRunning = true;
  instructionsScreenIsRunning = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = windowWidth/48;
}

function draw() {
  if(titleScreenIsRunning) {
    titleScreen();
  } else if(createMaze) {
    generateMaze();
  } else if(question) {
    questionFunc();
  } else if(solveMaze) {
    finishMaze();
  } else if(instructionsScreenIsRunning) {
    instructionsScreen();
  }
}

function mousePressed() {
  if(titleScreenIsRunning) {
    if(mouseX > w*7 && mouseX < (w*7 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
      cols = 20;
      rows = 20;
      wid = w*20;
      hei = w*20;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > w*21 && mouseX < (w*21 + w*8) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
      cols = 48;
      rows = 23;
      wid = w*48;
      hei = w*23;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > w*36 && mouseX < (w*36 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
      cols = 10;
      rows = 10;
      wid = w*10;
      hei = w*10;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)) {
      titleScreenIsRunning = false;
      instructionsScreenIsRunning = true;
    }
  } else if(question) {
    if(mouseX > w*20 && mouseX < (w*20 + w*5) && mouseY > w*10 && mouseY < (w*10 + w*2) && wid == w*48) {
      question = false;
      solveMaze = true;
    } else if(mouseX > (wid + w*5) && mouseX < (wid + w*5 + w*5) && mouseY > (w*5) && mouseY < (w*5 + w*2) && (wid == w*20 || wid == w*10)) {
      question = false;
      solveMaze = true;
    }
  } else if(instructionsScreenIsRunning) {
    if(mouseX > (w*43) && mouseX < (w*43 + w*4) && mouseY > w && mouseY < (w + w)) {
      instructionsScreenIsRunning = false;
      titleScreenIsRunning = true;
    }
  }
}

function keyPressed() {
  if(keyCode == ESCAPE && (createMaze || question || solveMaze)) {
    resetVariables();
    titleScreenIsRunning = true;
  }
}

function generateArray() {
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i  < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];

  //solve solveMaze
  start = grid[0];
  end = grid[grid.length - 1];
  openList.push(start);
}

function generateMap() {
  for(var i = 0; i < width; i += width/48) {
    push();
    strokeWeight(1);
    stroke(0)
    line(i, 0, i, height);
    pop();
  }

  for(var i = 0; i < height; i += width/48) {
    push();
    strokeWeight(1);
    stroke(0)
    line(0, i, width, i);
    pop();
  }
}

function titleScreen() {
  background(0, 188, 255, 200);
  generateMap();

  textFont(googleFontsCinzel);
  textSize(w + 6);
  fill(0, 188, 255);
  rect(w*18, w*3, w*9, w*2);
  fill(0);
  text("MAZE GENERATOR", w*18 + w/2, w*3 + w);
  text("AND MAZE SOLVER", w*18 + w/2.6, w*3 + w/0.52);
  push();
  fill(0, 188, 255);
  if(mouseX > w*7 && mouseX < (w*7 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    fill(81, 255, 56, 160);
  } else {
    fill(0, 188, 255);
  }
  rect(w*7, w*11, w*7, w*2);
  if(mouseX > w*21 && mouseX < (w*21 + w*8) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    fill(81, 255, 56, 160);
  } else {
    fill(0, 188, 255);
  }
  rect(w*21, w*11, w*8, w*2);
  if(mouseX > w*36 && mouseX < (w*36 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    fill(81, 255, 56, 160);
  } else {
    fill(0, 188, 255);
  }
  rect(w*36, w*11, w*7, w*2);
  if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)) {
    fill(255, 10, 5, 160);
  } else {
    fill(0, 188, 255);
  }
  rect(w*20, w*16, w*10, w*2);

  fill(200, 188, 255);
  push();
  rect(w*3, w*3, w*9, w*2);
  fill(0);
  textSize(w - 2);
  text("DEPTH-FIRST SEARCH",w*3 + w/12, w*3 + w/1.2)
  text("RECURSIVE BACKTRACK",w*3 + w/12, w*3 + w/0.57)

  fill(188, 255, 188);
  rect(w*36, w*3, w*9, w*2)
  fill(0);
  text("A* SEARCH ALGORITHM", w*36 + w/12, w*3 + w/1.2)
  text("OPTIMAL PATH FINDING", w*36 + w/12, w*3 + w/0.57)
  pop();

  fill(0, 188, 255);
  rect(w*20, w*20, w*10, w*2);
  fill(0);
  textSize(w + w/1.4);
  text("UMER JAVED", w*20 + w/1.4, w*20 + w/0.6);

  pop();

  generateLineComplexity();
}

function generateLineComplexity() {
  push();
  strokeWeight(4);
  /*
  LINE 1
  */
  if(mouseX > w*7 && mouseX < (w*7 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(w*18.5, w*5 + 2, w*18.5, w*5.5);
  line(w*18.5, w*5.5, w*16.5, w*5.5);
  line(w*16.5, w*5.5, w*16.5, w*7.5);
  line(w*16.5, w*7.5, w*14.5, w*7.5);
  line(w*14.5, w*7.5, w*14.5, w*8.5);

  if(mouseX > w*7 && mouseX < (w*7 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(w*14.5, w*8.5, w*13.5, w*8.5);
  line(w*13.5, w*8.5, w*13.5, w*9.5);
  line(w*13.5, w*9.5, w*9.5, w*9.5);
  line(w*9.5, w*9.5, w*9.5, w*11 - 1);

  if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(w*14.5, w*8.5, w*16.5, w*8.5);
  line(w*16.5, w*8.5, w*16.5, w*11.5);
  line(w*16.5, w*11.5, w*17.5, w*11.5);
  line(w*17.5, w*11.5, w*17.5, w*13.5);
  line(w*17.5, w*13.5, w*18.5, w*13.5);
  line(w*18.5, w*13.5, w*18.5, w*14.5);
  line(w*18.5, w*14.5, w*19.5, w*14.5);
  line(w*19.5, w*14.5, w*19.5, w*15.5);
  line(w*19.5, w*15.5, w*22.5, w*15.5);
  line(w*22.5, w*15.5, w*22.5, w*16 - 1);
  //BRANCH OFF

  /*
  LINE 1 ENDS
  */

  /*
  LINE 2
  */
  if(mouseX > w*21 && mouseX < (w*21 + w*8) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(w*21.5, w*5 + 2, w*21.5, w*6.5);
  line(w*21.5, w*6.5, w*22.5, w*6.5);
  line(w*22.5, w*6.5, w*22.5, w*7.5);
  line(w*22.5, w*7.5, w*26.5, w*7.5);
  line(w*26.5, w*7.5, w*26.5, w*8.5);

  if(mouseX > w*21 && mouseX < (w*21 + w*8) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(w*26.5, w*8.5, w*23.5, w*8.5);
  line(w*23.5, w*8.5, w*23.5, w*9.5);
  line(w*23.5, w*9.5, w*24.5, w*9.5);
  line(w*24.5, w*9.5, w*24.5, w*11 - 1);

  if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(w*26.5, w*7.5, w*27.5, w*7.5);
  line(w*27.5, w*7.5, w*27.5, w*8.5);
  line(w*27.5, w*8.5, w*28.5, w*8.5);
  line(w*28.5, w*8.5, w*28.5, w*9.5);
  line(w*28.5, w*9.5, w*29.5, w*9.5);
  line(w*29.5, w*9.5, w*29.5, w*11.5);
  line(w*29.5, w*11.5, w*30.5, w*11.5);
  line(w*30.5, w*11.5, w*30.5, w*13.5);
  line(w*30.5, w*13.5, w*27.5, w*13.5);
  line(w*27.5, w*13.5, w*27.5, w*14.5);
  line(w*27.5, w*14.5, w*24.5, w*14.5);
  line(w*24.5, w*14.5, w*24.5, w*16 - 1);
  //BRANCH OFF

  /*
  LINE 2 ENDS
  */

  /*
  LINE 3
  */
  if(mouseX > w*36 && mouseX < (w*36 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(w*26.5, w*5 + 2, w*26.5, w*6.5);
  line(w*26.5, w*6.5, w*30.5, w*6.5);
  line(w*30.5, w*6.5, w*30.5, w*7.5);
  line(w*30.5, w*7.5, w*31.5, w*7.5);
  line(w*31.5, w*7.5, w*31.5, w*8.5);
  line(w*31.5, w*8.5, w*34.5, w*8.5);


  if(mouseX > w*36 && mouseX < (w*36 + w*7) && mouseY > (w*11) && mouseY < (w*11 + w*2)) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(w*34.5, w*8.5, w*34.5, w*7.5);
  line(w*34.5, w*7.5, w*36.5, w*7.5);
  line(w*36.5, w*7.5, w*36.5, w*8.5);
  line(w*36.5, w*8.5, w*37.5, w*8.5);
  line(w*37.5, w*8.5, w*37.5, w*9.5);
  line(w*37.5, w*9.5, w*38.5, w*9.5);
  line(w*38.5, w*9.5, w*38.5, w*11 - 1);

  if(mouseX > w*20 && mouseX < (w*20 + w*10) && mouseY > (w*16) && mouseY < (w*16 + w*2)){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(w*34.5, w*8.5, w*34.5, w*10.5);
  line(w*34.5, w*10.5, w*33.5, w*10.5);
  line(w*33.5, w*10.5, w*33.5, w*11.5);
  line(w*33.5, w*11.5, w*32.5, w*11.5);
  line(w*32.5, w*11.5, w*32.5, w*13.5);
  line(w*32.5, w*13.5, w*33.5, w*13.5);
  line(w*33.5, w*13.5, w*33.5, w*15.5);
  line(w*33.5, w*15.5, w*26.5, w*15.5);
  line(w*26.5, w*15.5, w*26.5, w*16 - 1);
  //BRANCH OFF

  /*
  LINE 3 ENDS
  */

  stroke(0);
  line(w*18 - 1, w*3.5, w*12 + 1, w*3.5);
  line(w*27 + 1, w*3.5, w*36 - 1, w*3.5);
  pop();


  push();
  textSize(w + w/1.4);
  text("20 x 20", w*7 + w/1.2, w*11 + w/0.6);
  text("48 x 23", w*21 + w/0.7, w*11 + w/0.6);
  text("10 x 10", w*36 + w/1.2, w*11 + w/0.6);
  textSize(w + w/1.4);
  text("INFORMATION", w*20 + w/1.5, w*16 + w/0.6);
  pop();
}

function instructionsScreen() {
  background(0, 188, 255);
  generateMap();
  fill(0, 188, 255);
  //instruction box
  rect(w*17, w*2, w*11, w*2);


  //recursive
  rect(w*5, w*2, w*8, w);
  rect(w, w*4, w*15, w*4);
  //img

  image(dfsImg1, w + 1, w*9 + 1, w*6 - 1, w*6 - 1);
  image(dfsImg2, w*9 + 1, w*9 + 1, w*6 - 1, w*6 - 1);
  image(dfsImg3, w + 1, w*16 + 1, w*6 - 1, w*6 - 1);
  image(dfsImg4, w*9 + 1, w*16 + 1, w*6 - 1, w*6 - 1);


  fill(0);
  push();
  strokeWeight(4);
  line(w*3.5, w*8 + 2, w*3.5, w*9 - 1);
  line(w*7 + 1, w*11.5, w*9 - 1, w*11.5);
  line(w*11.5, w*15 + 2, w*11.5, w*15.5);
  line(w*11.5, w*15.5, w*2.5, w*15.5);
  line(w*2.5, w*15.5, w*2.5, w*16 - 2);
  line(w*7 + 2, w*18.5, w*9 - 2, w*18.5);
  pop();
  push();
  textSize(w + w/1.4);
  text("INFORMATION", w*17 + w, w*2 + w/0.6);
  pop();
  textSize(w/1.1);
  text("DEPTH-FIRST SEARCH", w*5 + w/6, w*2 + w/1.2);
  text("THIS IS A PROGRAM THAT DEMONSTRATES",w, w*4 + w/1.1);
  text("DEPTH'S-FIRST SEARCH ALGORITHM IN", w ,w*4 + w/0.6);
  text("ORDER TO GENERATE A MAZE USING AN", w, w*4 + w/0.42);
  text("ALGORITHM TECHNIQUE CALLED RECURSIVE",w, w*4 + w/0.32);
  text("BACKTRACKING", w, w*4 + w/0.26);

  fill(200, 188, 255);
  rect(w*18, w*5, w*9, w*2);
  fill(0);
  textSize(w/1.4);
  text("PRESS 'ESC' ANY TIME TO EXIT\nDURING MAZE GEN./SOLVING", w*18 + w/6.5, w*5 + w/1.3);

  //second half
  fill(0, 188, 255);
  rect(w*32, w*3, w*10, w);
  rect(w*30, w*5, w*15, w*7);
  image(asaImg1, w*28 + 1, w*13 + 1, w*9 - 1, w*9 - 1);
  image(asaImg2, w*38 + 1, w*13 + 1, w*9 - 1, w*9 - 1);
  fill(0);

  push();
  strokeWeight(4);
  line(w*31.5, w*12 + 2, w*31.5, w*13 - 2);
  line(w*37 + 2, w*17.5, w*38 - 1, w*17.5);
  pop();

  textSize(w/1.16);
  text("A-STAR SEARCH ALGORITHM", w*32 + w/1.8, w*3 + w/1.2);
  text("THE A-STAR PATH FINDING ALGORITHM IS",w*30, w*5 + w/1.2);
  text("USED TO FIND THE OPTIMUM SOLUTION TO",  w*30 ,w*5 + w/0.64);
  text("GENERATED MAZE, USING A HEURISTIC ", w*30 ,w*5 + w/0.44);
  text("FUNCTION TO ESTIMATE THE DISTANCE", w*30, w*5 + w/0.335);
  text("FROM THE TARGET AT ANY GIVEN NODE. THE", w*30, w*5 + w/0.27);
  text("FUNCTION USED IS THE PYTHAGOREAN", w*30, w*5 + w/0.225);
  text("THEOREM. BASED ON THE HEURISTIC, THE", w*30, w*5 + w/0.193);
  text("ALGORITHM IS ABLE TO DETERMINE THE", w*30, w*5 + w/0.170);
  text("SHORTEST AND MOST OPTIMAL SOLUTION.", w*30, w*5 + w/0.15);

  if(mouseX > w*43 && mouseX < (w*43 + w*4) && mouseY > w && mouseY < (w+w)) {
    fill(200, 31, 15);
  } else {
    fill(w*2.5, 188, 255);
  }
  rect(w*43, w, w*4, w);
  push();
  if(mouseX > w*43 && mouseX < (w*43 + w*4) && mouseY > w && mouseY < (w+w)) {
    stroke(200, 31, 15);
  } else {
    stroke(0);
  }
  strokeWeight(4);
  line(w*47 + 2, w*1.5, w*47.5, w*1.5);
  line(w*47.5, w*1.5, w*47.5, w*0.5);
  line(w*47.5, w*0.5, w*48, w*0.5);
  pop();
  fill(0);
  textSize(w);
  text("RETURN ", w*43 + w/2, w + w/1.2);
}


function generateMaze() {
  background(50);

  //unbounded area
  if(wid != 1920) {
    push()
    stroke(200, 10, 10);
    strokeWeight(3);

    for(var i = 0; i < width; i += width/48) {
      if(i <= wid) {
        line(i, hei, i, height);
      } else {
        line(i, 0, i, height);
      }
    }
    for(var i = 0; i < height; i += width/48) {
      if(i <= hei) {
        line(hei, i, width, i);
      } else {
        line(0, i, width, i);
      }
    }
    pop();
  }

  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
    grid[i].showWalls();
  }

  current.visited = true;

  //step 1
  var next = current.checkNeighbours();
  if (next) {
    next.visited = true;
    //step 2
    stack.push(current);
    //step 3
    removeWalls(current, next);


    //step 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
  current.outline();
  if(stack.length == 0) {
    for(var i = 0; i < grid.length; i++) {
      grid[i].addSurrounding(grid);
    }
    createMaze = false;
    question = true;
  }

}

function questionFunc() {
  push();
  if(wid == w*48) {
    fill(0, 188, 255, 50);
    rect(w*20, w*10, w*5, w*2);
    textSize(w/0.5);
    fill(0, 0, 0, w*2.5);
    strokeWeight(3);
    text("SOLVE", w*20, w*10 + w/0.6);
  } else {
    fill(0, 188, 255);
    rect(wid + w*5, w*5, w*5, w*2);
    textSize(w/0.5);
    fill(0);
    strokeWeight(3);
    text("SOLVE", wid + w*5, w*5 + w/0.6);
  }
  pop();
}

function finishMaze() {
  if(directTest) {
    foundPath = true;
  }
  if(openList.length > 0) {
    var lowestIndex = 0;
    for(var i = 0; i < openList.length; i++) {
      if(openList[i].functionScore < openList[lowestIndex].functionScore) {
        lowestIndex = i;
      }
    }
    var cur = openList[lowestIndex];
    if(cur == end) {
      directTest = true;
    }
    for(var i = openList.length - 1; i >= 0; i--) {
      if(openList[i] == cur) {
        openList.splice(i, 1);
      }
    }
    closedSet.push(cur);

    var neighbours = cur.neighbours;
    for(var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      if(cur.x <= 0 && cur.y <= 0) {
        c = i + 1;
      } else if(cur.x <= 0 && cur.y >= rows - 1) {
        c = i;
      } else if(cur.x >= cols - 1 && cur.y <= 0) {
        c = i + 2;
      } else if(cur.x >= cols - 1 && cur.y >= rows - 1) {
        c = i;
        if(i >= 1) {
          c = i + 2;
        }
      } else if(cur.x <= 0) {
        c = i;
      } else if(cur.x >= cols - 1) {
        c = i;
        if(i >= 1) {
          c = i + 1;
        }
      } else if(cur.y <= 0) {
        c = i + 1;
      } else if(cur.y >= rows - 1) {
        c = i;
        if(i >= 2) {
          c = i + 1;
        }
      } else {
        c = i;
      }
      if(!closedSet.includes(neighbour) && (!cur.walls[c])) {
        var curG = cur.costFunction + 1;
        if(openList.includes(neighbour)) {
          if(curG < neighbour.costFunction) {
            neighbour.costFunction = curG;
          }
        } else {
          neighbour.costFunction = curG;
          openList.push(neighbour);
        }
        neighbour.heuristic = heuristic(neighbour, end);
        neighbour.functionScore = neighbour.costFunction + neighbour.h;
        neighbour.previous = cur;
      }
    }
  } else {
    return;
  }
  background(0);

  for(var i = 0; i < openList.length; i++) {
    openList[i].outline(color(0, 188, 255, 200));
  }

  for(var i = 0; i < closedSet.length; i++) {
    closedSet[i].outline(color(w*2.5, 205, 205, 200));
  }

  for(var i = 0; i <grid.length; i++) {
    grid[i].show(color(255));
    grid[i].showWalls();
  }

  if(!foundPath) {
    idealPath = [];
    var currentPlace = cur;
    idealPath.push(currentPlace);
    while(currentPlace.previous) {
      idealPath.push(currentPlace.previous);
      currentPlace = currentPlace.previous;
    }
  } else {
    for(var q = 0; q < idealPath.length; q++) {
      // idealPath[q].outline(color(81, 255, 56, 130));
      idealPath[q].outline(color(255, 81, 56, 150));
    }
  }

  push();
  noFill();
  strokeWeight(4);
  stroke(255, 65, 65);
  beginShape();
  for(var i = 0; i < idealPath.length; i++) {
    vertex(idealPath[i].x * (wid/cols) + (wid/cols)/2, idealPath[i].y * (hei/rows) + (hei/rows)/2);
  }
  endShape();
  fill(255, 0, 0);
  ellipse(w/2, w/2 , 8, 8);
  ellipse(wid - w/2, hei- w/2 , 8, 8);
  pop();
  for(var i = 0; i <grid.length; i++) {
    grid[i].showWalls();
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.x = i;
  this.y = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.weight = 0;
  this.functionScore = 0;
  this.costFunction = 0;
  this.heuristic = 0;
  this.previous = null;
  this.blockage = false;
  this.neighbours = [];

  this.checkNeighbours = function() {
    var neighbours = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbours.push(top);
    }
    if (right && !right.visited) {
      neighbours.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbours.push(bottom);
    }
    if (left && !left.visited) {
      neighbours.push(left);
    }

    if (neighbours.length > 0) {
      var r = floor(random(0, neighbours.length));
      return neighbours[r];
    } else {
      return undefined;
    }
  }

  this.outline = function(col) {
    var x = this.x*w;
    var y = this.y*w
    push();
    noStroke();
    if(col) {
      fill(col);
    } else {
      fill(200, 78, 109);
    }
    rect(x, y, w, w);
    pop();
  }

  this.show = function() {
    var x = this.x*w;
    var y = this.y*w;
    if (this.visited) {
      push();
      noStroke();
      fill(w*2.5, 255, 255, 200);
      rect(x, y, w, w);
      pop();
    }
  }

  this.showWalls = function() {
    push();
    var x = this.x*w;
    var y = this.y*w;
    strokeWeight(3);
    stroke(0);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {

      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
    pop();
  }

  this.addSurrounding = function() {
    push();
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top) {
      this.neighbours.push(top);
    }
    if (right) {
      this.neighbours.push(right);
    }
    if (bottom) {
      this.neighbours.push(bottom);
    }
    if (left) {
      this.neighbours.push(left);
    }
    pop();
  }
}

function removeWalls(a, b) {
  var x = a.x - b.x;
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.y - b.y;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function heuristic(chosenPoint, endPoint) {
  var distance = dist(chosenPoint.x, chosenPoint.y, endPoint.x, endPoint.y);
  return distance;
}
