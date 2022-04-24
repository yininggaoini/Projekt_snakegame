import { connectJoyCon, connectedJoyCons, JoyConLeft } from './lib/joycon/index.js';

document.addEventListener('DOMContentLoaded', onLoad);

const accXLeft = [];
const accYLeft = [];
const accXRight = [];
const accYRight = [];
let numX = 0;
let numY = 0;

let key;

function onLoad(){
    const button = document.getElementById('connect');
    button.addEventListener('click',connectJoyCon);
    console.log(connectedJoyCons);
}

function defineDirc(key){
  switch(key){
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
}

function buttonStickData(joyCon,packet){
    let div;
    let buttonCheck;
    let stickCheck;
    key = 0;
    if(joyCon instanceof JoyConLeft){
        //div = document.getElementById("left");
        buttonCheck = packet.buttonStatus._raw['2'];
        stickCheck = packet.analogStickLeft;
        switch(buttonCheck){
          case 8: // left arrow
            key = 37;
              break;
          case 2: // up arrow
            key = 38;
              break;
          case 4: // right arrow
            key = 39;
              break;
          case 1: // down arrow
            key = 40;
              break;
        }
        defineDirc(key);
      }else{
       // div = document.getElementById("right");
        buttonCheck = packet.buttonStatus._raw['0'];
        stickCheck = packet.analogStickRight;
        switch(buttonCheck){
          case 1: // left arrow
            key = 37;
              break;
          case 2: // up arrow
            key = 38;
              break;
          case 8: // right arrow
            key = 39;
              break;
          case 4: // down arrow
            key = 40;
           break;
        }
        defineDirc(key);
      }
    /* const show = {
      buttonCheck,
      stickCheck
    } */
      //div.innerText = JSON.stringify(show,null,4);
      if(stickCheck.horizontal <= -0.5){  key = 37;} //left
      else if(stickCheck.horizontal >= 0.5){  key = 39;}  //right
      if(stickCheck.vertical <= -0.5){  key = 38; }  //up
      else if(stickCheck.vertical >= 0.5){  key = 40; }   //down
      defineDirc(key);
    /* 
    const isLeft = joyCon instanceof JoyConLeft;
    document.getElementId(isLeft ? "left" : "right").innerText = packet; */
    //return show;
}

function armData(joyCon,packet){
  //let accerometerCheck;
  let actualX = packet.actualAccelerometer["x"];
  let actualY = packet.actualAccelerometer["y"];
  // let actualZ = packet.actualAccelerometer["z"];
  key = 0;
  if(joyCon instanceof JoyConLeft){
    //accelerometerCheck = packet;
    if(numX > 10){  key = 38;} //up
    else if(numX < -10){  key = 40; }//down
    if(numY > 10){  key = 37; } //left
    else if(numY < -10){ key = 39; }//right
    defineDirc(key);
    numY = 0;
    numX = 0;
  }
  else{
    if(numX > 10){   key = 38; } //up
     else if(numX < -10){  key = 40; } //down
     if(numY > 10){  key = 37;} //left
     else if(numY < -10){ key = 39;}//right
     numY = 0;
     numX = 0;
     defineDirc(key);
  }
} 

function saveData(joyCon, packet){
  if(joyCon instanceof JoyConLeft){
    let actualX = packet.actualAccelerometer["x"];
    let actualY = packet.actualAccelerometer["y"];
    if(accXLeft.length >= 50){
      // Lösche erste Elemente
      accXLeft.shift();
    }
    accXLeft.push(actualX);
    for(let x of accXLeft){
      if(actualX >= 0.007){ numX++} 
      else if (actualX <= -0.007){ numX--}
    } 
   
    if(accYLeft.length >= 50){
      accYLeft.shift();
    }
    accYLeft.push(actualY);
    for(let y of accYLeft){
      if(actualY <= -0.007){ numY++}
      else if(actualY >= 0.007){ numY--}
    }
   // accXLeft.push([actualX,performance.now()])
   //accXLeft.push({value:actualX,timeStamp:performance.now()})
  }else{
    //console.log( packet.actualAccelerometer);
    let actualX = packet.actualAccelerometer["x"];
    let actualY = packet.actualAccelerometer["y"];
    if(accXRight.length >= 50){
      // Lösche erste Elemente
      accXRight.shift();
    }
    accXRight.push(actualX);
    for(let x of accXRight){
      if(actualX >= 0.007){ numX++} 
      else if (actualX <= -0.007){ numX--}
    } 
   
    if(accYRight.length >= 50){
      accYRight.shift();
    }
    accYRight.push(actualY);
    for(let y of accYRight){
      if(actualY <= -0.007){ numY--}
      else if(actualY >= 0.007){ numY++}
    }
  }
}

setInterval(function (){
  for (const joyCon of connectedJoyCons.values()){
    joyCon.addEventListener('hidinput', (event) => {
      saveData(joyCon, event.detail);});
  }
 // console.log(accXLeft.length,accXLeft);
},500)


function handleJoyCon(joyCon){
  return function(event){

    let input = localStorage.getItem('inputMode');
    // console.log("localStorage",input)
    
    switch(input){
      case 'joyconBewegung':
          armData(joyCon, event.detail);
          console.log("armData")
          break;

      case 'joyconButtonStick':
          buttonStickData(joyCon, event.detail);  
          console.log("button")
          break;
    } 
  }
}

  
setInterval(async () => {
   // inputsValue();
    //let input = localStorage.getItem('inputMode');
   // console.log(input)
    for (const joyCon of connectedJoyCons.values()) {
      if (joyCon.eventListenerAttached) {
        continue;
      }
      await joyCon.open();
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();

      joyCon.addEventListener('hidinput',handleJoyCon(joyCon));
      joyCon.eventListenerAttached = true;
    }
    //console.log(Snake.alive)
   // localStorage.removeItem('inputMode');
  }, 2000);

