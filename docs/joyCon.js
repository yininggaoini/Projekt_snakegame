import { connectJoyCon, connectedJoyCons, JoyConLeft } from './lib/joycon/index.js';

document.addEventListener('DOMContentLoaded', onLoad);

const accXLeft = [];
const accXRight = [];

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
     // console.log("up");
      let start = performance.now();
      if(actualX <= 0.007){
        let end = performance.now();
        console.log(end - start);
          if( (end - start) > 1000){
            // if end - start = 1000
            if (Snake.direction != "d") {Snake.direction = "u";}
          } //else break;
      }    
    }
    else if(actualX < -0.007){  //down
     // console.log("down");
     let start = performance.now();
     if(actualX >= -0.007){
       let end = performance.now();
       console.log(end - start);
       if( (end - start) > 1000){
          if (Snake.direction != "u") {Snake.direction = "d";}
       } //else break;
      }
    }
    if(actualY < -0.007){ //left
      //console.log("left");
      let start = performance.now();
      if(actualY >= -0.007){
       let end = performance.now();
       console.log(end - start);
       if( (end - start) > 1000){
        if (Snake.direction != "r") {Snake.direction = "l";}
       }//else break;
      }
    }
    else if(actualY > 0.007){ //right
     // console.log("right");
     let start = performance.now();
      if(actualY <= 0.007){
       let end = performance.now();
       console.log(end - start);
       if( (end - start) > 1000){
          if (Snake.direction != "l") {Snake.direction = "r";}
       }//else break;
      }
    }
  }
  else{

  }
} 

function saveData(joyCon, packet){
  if(joyCon instanceof JoyConLeft){
    let actualX = packet.actualAccelerometer["x"];
    if(accXLeft.length >= 50){
      // Lösche erste Elemente
      accXLeft.shift();
    }
   // accXLeft.push(actualX);
   // accXLeft.push([actualX,performance.now()])
   accXLeft.push({value:actualX,timeStamp:performance.now()})
  }else{

  }
}

setInterval(function (){

  console.log(accXLeft.length,accXLeft);
},500)


setInterval(async () => {

   // inputsValue();
    for (const joyCon of connectedJoyCons.values()) {
      if (joyCon.eventListenerAttached) {
        continue;
      }
      await joyCon.open();
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();
      //localStorage.getItem()
      //console.log(oinputsValue);
      //if(oinputsValue==="joyconBewegung"){console.log("1");} else{console.log("0");} //oinputsValue not defined!
      //if(oinputsValue=="joyconBewegung") console.log("123")
      joyCon.addEventListener('hidinput', (event) => {
        //armData(joyCon, event.detail);
       // defineDirc(show);
       saveData(joyCon, event.detail);
      // console.log(performance.now());
      });
      
      joyCon.eventListenerAttached = true;
    }
  }, 2000);

