var cols, rows;
var w = 40;
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

function setup() {
  createCanvas(1920, 920);
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
    if(mouseX > 240 && mouseX < 520 && mouseY > 400 && mouseY < 480) {
      cols = 20;
      rows = 20;
      wid = 800;
      hei = 800;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > 800 && mouseX < 1120 && mouseY > 400 && mouseY < 480) {
      cols = 48;
      rows = 23;
      wid = 1920;
      hei = 920;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > 1400 && mouseX < 1680 && mouseY > 400 && mouseY < 480) {
      cols = 10;
      rows = 10;
      wid = 400;
      hei = 400;
      generateArray();
      titleScreenIsRunning = false;
      createMaze = true;
    } else if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680) {
      titleScreenIsRunning = false;
      instructionsScreenIsRunning = true;
    }
  } else if(question) {
    if(mouseX > 640 && mouseX < 840 && mouseY > 160 && mouseY < 240 && wid == 400) {
      question = false;
      solveMaze = true;
    } else if(mouseX > 1040 && mouseX < 1240 && mouseY > 360 && mouseY < 420 && wid == 800) {
      question = false;
      solveMaze = true;
    } else if(mouseX > 800 && mouseX < 1000 && mouseY > 440 && mouseY < 520 && wid == 1920) {
      question = false;
      solveMaze = true;
    }
  } else if(instructionsScreenIsRunning) {
    if(mouseX > 1720 && mouseX < 1880 && mouseY > 40 && mouseY < 80) {
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
  for(var i = 0; i < width; i += 40) {
    push();
    strokeWeight(1);
    stroke(0)
    line(i, 0, i, height);
    pop();
  }

  for(var i = 0; i < height; i += 40) {
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
  textSize(50);
  fill(0, 188, 255);
  rect(720, 80, 360, 80);
  fill(0);
  text("MAZE GENERATOR", width/3 + 80, 118);
  text("AND MAZE SOLVER", width/3 + 80, 158);
  push();
  fill(0, 188, 255);
  if(mouseX > 240 && mouseX < 520 && mouseY > 400 && mouseY < 480) {
    fill(81, 255, 56, 160);
  } else {
    fill(255, 129, 33);
  }
  rect(240, 400, 280, 80);
  if(mouseX > 800 && mouseX < 1120 && mouseY > 400 && mouseY < 480) {
    fill(81, 255, 56, 160);
  } else {
    fill(255, 129, 33);
  }
  rect(800, 400, 320, 80);
  if(mouseX > 1400 && mouseX < 1680 && mouseY > 400 && mouseY < 480) {
    fill(81, 255, 56, 160);
  } else {
    fill(255, 129, 33);
  }
  rect(1400, 400, 280, 80);
  if(mouseX > 800 && mouseX < 1120 && mouseY > 600 && mouseY < 680) {
    fill(255, 10, 5, 160);
  } else {
    fill(255, 129, 33);
  }
  rect(760, 600, 400, 80);

  fill(200, 188, 255);
  push();
  rotate(-PI/4);
  rect(-114, 283, 283, 57);
  fill(0);
  textSize(30);
  text("DEPTH-FIRST SEARCH",-112, 310)
  text("RECURSIVE BACKTRACK",-112, 335)

  rotate(PI/2);
  fill(188, 255, 188);
  rect(1188, -1075, 283, 57)
  fill(0);
  text("A* SEARCH ALGORITHM",1190, -1048)
  text("OPTIMAL PATH FINDING",1192, -1022)
  pop();

  fill(0, 188, 255);
  rect(760, 800, 400, 80);
  fill(0);
  textSize(80);
  text("UMER JAVED", 766, 870);

  pop();

  generateLineComplexity();
}

function generateLineComplexity() {
  push();
  strokeWeight(4);

  /*
  LINE 1
  */
  if(mouseX > 240 && mouseX < 520 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(740, 162, 740, 180);
  line(740, 180, 660, 180);
  line(660, 180, 660, 260);
  line(660, 260, 580, 260);
  line(580, 260, 580, 300);

  if(mouseX > 240 && mouseX < 520 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(580, 300, 540, 300);
  line(540, 300, 540, 340);
  line(540, 340, 380, 340);
  line(380, 340, 380, 399);

  if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(580, 300, 660, 300);
  line(660, 300, 660, 420);
  line(660, 420, 700, 420);
  line(700, 420, 700, 500);
  line(700, 500, 740, 500);
  line(740, 500, 740, 540);
  line(740, 540, 780, 540);
  line(780, 540, 780, 580);
  line(780, 580, 900, 580);
  line(900, 580, 900, 599);
  //BRANCH OFF

  /*
  LINE 1 ENDS
  */

  /*
  LINE 2
  */
  if(mouseX > 800 && mouseX < 1120 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(860, 162, 860, 220);
  line(860, 220, 900, 220);
  line(900, 220, 900, 260);
  line(900, 260, 1060, 260);
  line(1060, 260, 1060, 300);

  if(mouseX > 800 && mouseX < 1120 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(1060, 300, 940, 300);
  line(940, 300, 940, 340);
  line(940, 340, 980, 340);
  line(980, 340, 980, 399);

  if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(1060, 300, 1100, 300);
  line(1100, 300, 1100, 340);
  line(1100, 340, 1140, 340);
  line(1140, 340, 1140, 380);
  line(1140, 380, 1180, 380);
  line(1180, 380, 1180, 460);
  line(1180, 460, 1220, 460);
  line(1220, 460, 1220, 500);
  line(1220, 500, 1100, 500);
  line(1100, 500, 1100, 540);
  line(1100, 540, 980, 540);
  line(980, 540, 980, 599);
  //BRANCH OFF

  /*
  LINE 2 ENDS
  */

  /*
  LINE 3
  */
  if(mouseX > 1400 && mouseX < 1680 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  line(1060, 162, 1060, 220);
  line(1060, 220, 1220, 220);
  line(1220, 220, 1220, 260);
  line(1220, 260, 1260, 260);
  line(1260, 260, 1260, 300);
  line(1260, 300, 1380, 300);


  if(mouseX > 1400 && mouseX < 1680 && mouseY > 400 && mouseY < 480) {
    stroke(81, 255, 56, 160);
  } else {
    stroke(0);
  }
  line(1380, 300, 1380, 260);
  line(1380, 260, 1460, 260);
  line(1460, 260, 1460, 300);
  line(1460, 300, 1500, 300);
  line(1500, 300, 1500, 340);
  line(1500, 340, 1540, 340);
  line(1540, 340, 1540, 399);

  if(mouseX > 760 && mouseX < 1160 && mouseY > 600 && mouseY < 680){
    stroke(255, 10, 5);
  } else {
    stroke(0);
  }
  //BRANCH OFF
  line(1380, 300, 1380, 380);
  line(1380, 380, 1340, 380);
  line(1340, 380, 1340, 420);
  line(1340, 420, 1300, 420);
  line(1300, 420, 1300, 500);
  line(1300, 500, 1340, 500);
  line(1340, 500, 1340, 580);
  line(1340, 580, 1060, 580);
  line(1060, 580, 1060, 599);
  //BRANCH OFF

  /*
  LINE 3 ENDS
  */



  stroke(0);
  line(719, 100, 341, 100);
  textSize(70);
  text("800 x 800", 242, 465);
  text("1920 x 920", 804, 465);
  text("400 x 400", 1404, 465);
  textSize(75);
  text("INFORMATION", 764, 665);
  pop();
}

function instructionsScreen() {
  background(0, 188, 255);
  generateMap();
  fill(0, 188, 255);
  rect(680, 80, 440, 80);


  rect(200, 80, 320, 40);
  rect(40, 160, 600, 160);
  //img

  image(dfsImg1, 41, 361, 239, 239);
  image(dfsImg2, 361, 361, 239, 239);
  image(dfsImg3, 41, 641, 239, 239);
  image(dfsImg4, 361, 641, 239, 239);


  fill(0);
  push();
  strokeWeight(4);
  line(140, 322, 140, 359);
  line(281, 460, 359, 460);
  line(460, 602, 460, 620);
  line(460, 620, 100, 620);
  line(100, 620, 100, 638);
  line(282, 740, 358, 740);
  pop();
  push();
  textSize(84);
  text("INFORMATION", width/3 + 42, 148);
  pop();
  textSize(35);
  text("DEPTH-FIRST SEARCH", 210, 113);
  text("THIS IS A PROGRAM THAT DEMONSTRATES",42, 195);
  text("DEPTH'S-FIRST SEARCH ALGORITHM IN", 42 ,225);
  text("ORDER TO GENERATE A MAZE USING AN", 42, 255);
  text("ALGORITHM TECHNIQUE CALLED RECURSIVE", 42, 285);
  text("BACKTRACKING", 42, 315);

  fill(200, 188, 255);
  rect(720, 200, 360, 80);
  fill(0);
  textSize(30);
  text("PRESS 'ESC' ANY TIME TO EXIT\nDURING MAZE GEN./SOLVING", 724, 231);

  //second half
  fill(0, 188, 255);
  rect(1280, 120, 400, 40);
  rect(1200, 200, 600, 280);
  image(asaImg1, 1121, 521, 359, 359);
  image(asaImg2, 1521, 521, 359, 359);
  fill(0);

  push();
  strokeWeight(4);
  line(1260, 482, 1260, 518);
  line(1482, 700, 1519, 700);
  pop();

  textSize(35);
  text("A-STAR SEARCH ALGORITHM", 1295, 153);
  text("THE A-STAR PATH FINDING ALGORITHM IS",1210, 235);
  text("USED TO FIND THE OPTIMUM SOLUTION TO", 1210 ,265);
  text("GENERATED MAZE, USING A HEURISTIC ", 1210, 295);
  text("FUNCTION TO ESTIMATE THE DISTANCE", 1210, 325);
  text("FROM THE TARGET AT ANY GIVEN NODE. THE", 1210, 355);
  text("FUNCTION USED IS THE PYTHAGOREAN", 1210, 385);
  text("THEOREM. BASED ON THE HEURISTIC, THE", 1210, 415);
  text("ALGORITHM IS ABLE TO DETERMINE THE", 1210, 445);
  text("SHORTEST AND MOST OPTIMAL SOLUTION.", 1210, 475);

  if(mouseX > 1720 && mouseX < 1880 && mouseY > 40 && mouseY < 80) {
    fill(200, 31, 15);
  } else {
    fill(100, 188, 255);
  }
  rect(1720, 40, 160, 40);
  push();
  if(mouseX > 1720 && mouseX < 1880 && mouseY > 40 && mouseY < 80) {
    stroke(200, 31, 15);
  } else {
    stroke(0);
  }
  strokeWeight(4);
  line(1882, 60, 1900, 60);
  line(1900, 60, 1900, 20);
  line(1900, 20, 1920, 20);
  pop();
  fill(0);
  textSize(50);
  text("RETURN ", 1724, 78);
}


function generateMaze() {
  background(50);

  //unbounded area
  if(wid != 1920) {
    push()
    stroke(200, 10, 10);
    strokeWeight(3);

    for(var i = 0; i < width; i += 40) {
      if(i <= wid) {
        line(i, hei, i, height);
      } else {
        line(i, 0, i, height);
      }
    }
    for(var i = 0; i < height; i += 40) {
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
  if(wid == 400) {
    fill(0, 188, 255);
    rect(640, 160, 200, 80);
    textSize(80);
    fill(0);
    strokeWeight(3);
    text("SOLVE", 642, 228);
  } else if(wid == 800) {
    fill(0, 188, 255);
    rect(1040, 360, 200, 80);
    textSize(80);
    fill(0);
    strokeWeight(3);
    text("SOLVE", 1042, 428);
  } else if(wid == 1920) {
    fill(0, 188, 255, 50);
    rect(800, 440, 200, 80);
    textSize(80);
    fill(0, 0, 0, 100);
    strokeWeight(3);
    text("SOLVE", 802, 508);
  }
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
    closedSet[i].outline(color(100, 205, 205, 200));
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
      fill(100, 255, 255, 200);
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
