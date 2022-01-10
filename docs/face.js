const video = document.getElementById('video')

let numUp = 0;
let numDown = 0;
let numLeft = 0;
let numRight = 0;
let expressArr = [];

let key;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/docs/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/docs/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/docs/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/docs/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
/* 
  let oHappy = document.getElementById('happy');
  let oSad = document.getElementById('sad');
  let oSurprised = document.getElementById('surprised');
  let oAngry = document.getElementById('angry');
   */
  setInterval(async () => {
    let input = localStorage.getItem('inputMode');

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
   // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  //  console.log(detections['0'].expressions.angry)

    let happy = resizedDetections['0'].expressions['happy'];
    let sad = resizedDetections['0'].expressions['sad'];
    let angry = resizedDetections['0'].expressions['angry'];
    let surprised = resizedDetections['0'].expressions['surprised'];

    if(input=='mimikKamera'){
      //console.log(resizedDetections)
      /* saveArrData(resizedDetections,'happy',numUp);
      saveArrData(resizedDetections,'sad',numDown);
      saveArrData(resizedDetections,'angry',numLeft);
      saveArrData(resizedDetections,'surprised',numRight);  */

      if(happy<=1.5 && happy>=0.6){ key = 38;}
      else if(sad<=1.5 && sad>=0.6){  key = 40;}
      if(angry<=1.5 && angry>=0.6){ key = 37;}
      else if(surprised<=1.5 && surprised>=0.6){ key = 39;}
      /* if(numUp>20){ key = 38;}
      else if(numDown>20){  key = 40;}
      if(numLeft>20){ key = 37;}
      else if(numRight>20){ key = 39;}*/
      defineDirc(key);
      numUp=0;
      numDown=0;
      numLeft=0;
      numRight=0; 

    }
  }, 100)
})

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

function saveArrData(detection,inputEmo,num){
  let actualEmo = detection['0'].expressions[inputEmo];
  if(expressArr.length>=50){  expressArr.shift();}
  expressArr.push(actualEmo);
  for(let x of expressArr){
    if(actualEmo<=1&&actualEmo>=0.6){num++}
  }
  //console.log(expressArr)
  //text.innerText = actualEmo;
}