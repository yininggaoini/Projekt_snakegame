import { connectJoyCon, connectedJoyCons, JoyConLeft } from './lib/joycon/index.js';

document.addEventListener('DOMContentLoaded', onLoad);


function onLoad(){
    const button = document.getElementById('connect');
    button.addEventListener('click',connectJoyCon);

}

function buttonStickData(joyCon,packet){
    let div;
    let buttonCheck;
    let stickCheck;
    if(joyCon instanceof JoyConLeft){
        //div = document.getElementById("left");
        buttonCheck = packet.buttonStatus._raw['2'];
        stickCheck = packet.analogStickLeft;
        switch(buttonCheck){
          case 8: // left arrow
              if (Snake.direction != "r") {Snake.direction = "l";}
              break;
          case 2: // up arrow
              if (Snake.direction != "d") {Snake.direction = "u";}
              break;
          case 4: // right arrow
              if (Snake.direction != "l") {Snake.direction = "r";}
              break;
          case 1: // down arrow
              if (Snake.direction != "u") {Snake.direction = "d";}
              break;
        }
      }else{
       // div = document.getElementById("right");
        buttonCheck = packet.buttonStatus._raw['0'];
        stickCheck = packet.analogStickRight;
        switch(buttonCheck){
          case 1: // left arrow
              if (Snake.direction != "r") {Snake.direction = "l";}
              break;
          case 2: // up arrow
              if (Snake.direction != "d") {Snake.direction = "u";}
              break;
          case 8: // right arrow
              if (Snake.direction != "l") {Snake.direction = "r";}
              break;
          case 4: // down arrow
              if (Snake.direction != "u") {Snake.direction = "d";}
              break;
        }
      }
      const show = {
        buttonCheck,
        stickCheck
      }
      //div.innerText = JSON.stringify(show,null,4);
      if(stickCheck.horizontal <= -0.5){if (Snake.direction != "r") {Snake.direction = "l";}}
      else if(stickCheck.horizontal >= 0.5){if (Snake.direction != "l") {Snake.direction = "r";}}

      if(stickCheck.vertical <= -0.5){if (Snake.direction != "d") {Snake.direction = "u";}}
      else if(stickCheck.vertical >= 0.5){if (Snake.direction != "u") {Snake.direction = "d";}}   
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

  if(joyCon instanceof JoyConLeft){
    //accerometerCheck = packet;
    if(actualX > 0.007){ //up
      console.log("up");
      if (Snake.direction != "d") {Snake.direction = "u";}
    }
    else if(actualX < -0.007){  //down
      console.log("down");
      if (Snake.direction != "u") {Snake.direction = "d";}
    }
    if(actualY < -0.007){ //left
      console.log("left");
      if (Snake.direction != "r") {Snake.direction = "l";}
    }
    else if(actualY > 0.007){ //right
      console.log("right");
      if (Snake.direction != "l") {Snake.direction = "r";}
    }
  }
  else{

  }
} 

setInterval(async () => {
    for (const joyCon of connectedJoyCons.values()) {
      if (joyCon.eventListenerAttached) {
        continue;
      }
      await joyCon.open();
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();
      
      //if(oinputsValue==="joyconBewegung"){console.log("1");} else{console.log("0");} //oinputsValue not defined!
      var it = oinputsValue;
      console.log(it)
      joyCon.addEventListener('hidinput', (event) => {
        buttonStickData(joyCon, event.detail);
       // defineDirc(show);
      });
      
      joyCon.eventListenerAttached = true;
    }
  }, 2000);
