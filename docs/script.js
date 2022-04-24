/*jslint browser: true*/
/*global $, jQuery, alert*/

var gameBoardSize = 40;
var gamePoints = 0;
var gameSpeed = 100;

$(document).ready(function () {
    console.log("Ready Player One!");
    localStorage.removeItem('inputMode');
    createBoard();
    $(".btn").click(function() {
        inputsValue();
        farbeSettingsValue();
        inputsSpeed();
        spielFarben();
        startGame();
    });
});

var Snake = {
    position: [[20, 20], [20, 19], [20, 18]], // snake start position
    size: 3,
    direction: "r",
    alive: true
}

var Food = {
    position: [],
    present: false
}

function createBoard() {
    $("#gameBoard").empty();
    var size = gameBoardSize;
    
    for (i = 0; i < size; i++) {
        $("#gameBoard").append('<div class="row"></div>');
        for (j = 0; j < size; j++) {
            $(".row:last-child").append('<div class="pixel"></div>');
        }
    }
}

function moveSnake() {
  var head = Snake.position[0].slice();

  switch (Snake.direction) {
    case 'r':
      head[1] += 1;
      break;
    case 'l':
      head[1] -= 1;
      break;
    case 'u':
      head[0] -= 1;
      break;
    case 'd':
      head[0] += 1;
      break;
  }

  // check after head is moved
  if (alive(head)) {
    // draw head
    $(".row:nth-child(" + head[0] + ") > .pixel:nth-child(" + head[1] + ")").addClass("snakePixel");

    // draw rest of body loop
    for (var i = 0; i < Snake.size; i++) {
      $(".row:nth-child(" + Snake.position[i][0] + ") > .pixel:nth-child(" + Snake.position[i][1] + ")").addClass("snakePixel");
    }

    // if head touches food
    if (head.every(function(e,i) {
      return e === Food.position[i];
    })) {
      Snake.size++;
      Food.present = false;
      gamePoints += 5;
      playCoinAudio();
      let colorSetting = localStorage.getItem('farbeSetting');
            
      switch(colorSetting){
        case 'standard':
          $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixel");
          break;
        case 'roteGruen':
          $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixelRed");
          break;  
        case 'blau':
          $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixelBlue");
          break;
        case 'total':
          $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixelTotal");
          break;
      }
      // $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixel");
      $("#score").html("Score: "+gamePoints)
        if (gamePoints % 16 == 0 && gameSpeed > 10) { gameSpeed -= 5; };
    } else {
      $(".row:nth-child(" + Snake.position[Snake.size-1][0] + ") > .pixel:nth-child(" + Snake.position[Snake.size-1][1] + ")").removeClass("snakePixel");
      Snake.position.pop();
    }
    Snake.position.unshift(head);
  } else {
    gameOver();
  }
}

function playCoinAudio(){
  const coinAud = new Audio("./coin.wav");
  coinAud.play();
}

function playOverAudio(){
  const overAud = new Audio("./game-over.mp3");
  overAud.play();
}

function farbeSettingsValue(){
  const oFarbensIndex = document.getElementById("farbenSetting").selectedIndex;
  const oFarbensValue = document.getElementById("farbenSetting").options[oFarbensIndex].value;
 // console.log(oinputsValue);
 
 JSON.stringify( localStorage.setItem('farbeSetting',oFarbensValue));
 //JSON.parse()
}

function generateFood() {
    if (Food.present === false) {
        Food.position = [Math.floor((Math.random()*40) + 1), Math.floor((Math.random()*40) + 1)]
        Food.present = true;
        console.log("Food at: "+Food.position);
        // $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixel");

        let colorSetting = localStorage.getItem('farbeSetting');
        
        switch(colorSetting){
          case 'standard':
            $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixel");
            break;
          case 'roteGruen':
            $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixelRed");
            break;     
          case 'blau':
            $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixelBlue");
            break;
          case 'total':
            $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixelTotal");
            break;
        }         
    }
}

function keyPress() {
    $(document).one("keydown", function(key) {
        switch(key.which) {
            case 37: // left arrow
                if (Snake.direction != "r") {Snake.direction = "l";}
                break;
            case 38: // up arrow
                if (Snake.direction != "d") {Snake.direction = "u";}
                break;
            case 39: // right arrow
                if (Snake.direction != "l") {Snake.direction = "r";}
                break;
            case 40: // down arrow
                if (Snake.direction != "u") {Snake.direction = "d";}
                break;
        }
    });
}


function inputsValue(){
  var oinputsIndex = document.getElementById("inputs").selectedIndex;
  var oinputsValue = document.getElementById("inputs").options[oinputsIndex].value;
 // console.log(oinputsValue);
 JSON.stringify( localStorage.setItem('inputMode',oinputsValue));
 //JSON.parse()
}

function inputsSpeed(){
  var ospeedIndex = document.getElementById("geschwindigkeit").selectedIndex;
  var ospeedValue = document.getElementById("geschwindigkeit").options[ospeedIndex].value;
 JSON.stringify( localStorage.setItem('speedMode',ospeedValue));
 //JSON.parse()
}

function spielFarben(){
  let colorSetting = localStorage.getItem('farbeSetting');
  const oGameBcgrd = document.getElementById('gameBoard');
  const oInfoBcgrd = document.getElementById('wholeDiv');

  switch(colorSetting){
    case 'standard':
      oGameBcgrd.style.backgroundColor = '#a8c899';
      oInfoBcgrd.style.backgroundColor = '#c4d6a7';
      break;
    case 'roteGruen':
      oGameBcgrd.style.backgroundColor = '#FAFAD2';
      oInfoBcgrd.style.backgroundColor = '#EEE8AA';
      break;  
    case 'blau':
      oGameBcgrd.style.backgroundColor = '#CCFFFF';
      oInfoBcgrd.style.backgroundColor = '#BFEFFF';
      break;
    case 'total':
      oGameBcgrd.style.backgroundColor = '#FFF';
      oInfoBcgrd.style.backgroundColor = '#FFF';
      break;
  }
}

function gameLoop() {
    setTimeout(function() {
        //inputsValue();
        keyPress();
        generateFood();
        moveSnake();
        if (Snake.alive) {gameLoop(); }
    }, gameSpeed);
}

function alive(head) {
  // head check
  if (head[0] < 1 || head[0] > 40 || head[1] < 1 || head[1] > 40) {
    return false;
  }
  // wall collision
  if (Snake.position[0][0] < 1 || Snake.position[0][0] > 40 || Snake.position[0][1] < 1 || Snake.position[0][1] > 40) {
    return false;
  }
  // self collision
  for (var i = 1; i < Snake.size; i++) {
    if ((Snake.position[0]).every(function(element,index) {
      return element === Snake.position[i][index];
    })) {
      return false;
    }
  }
  return true;
}

function gameOver() {
    Snake.alive = false;
    console.log("Game Over!");
    playOverAudio();
    $(".overlay").show();
    $("#gameOver").show();
    var blink = function() {
        $(".row:nth-child(" + Snake.position[0][0] + ") > .pixel:nth-child(" + Snake.position[0][1] + ")").toggleClass("snakePixel");
    }
    
    var i = 0;
    function blinkLoop() {
        blink();
        setTimeout(function() {
            i++;
            if (i < 10) { blinkLoop();}
        }, 400);
    }
    blinkLoop();
}


function startGame() {
    let speedSetting = localStorage.getItem('speedMode');
    switch(speedSetting){
      case 'standard':
        gameSpeed = 200;
        break;
      case 'langsamer':
        gameSpeed = 300;
        break;
      case 'schneller':
        gameSpeed = 100;
        break;
    }

    // reset game settings
    Snake.size = 3;
    Snake.position = [[20,20],[20,19],[20,18]];
    Snake.direction = "r";
    Snake.alive = true;
    gamePoints = 0;
    Food.present = false;

    // start game
    //inputsValue();
    createBoard();
    $(".overlay").hide();
    gameLoop();
}

