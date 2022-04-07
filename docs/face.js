const video = document.getElementById('video')

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
  const container = document.getElementById('facePart')
  container.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  const oXAchse = document.getElementById('xAchse');
  const oYAchse = document.getElementById('yAchse');

  setInterval(async () => {
    let input = localStorage.getItem('inputMode');

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

   /*  let xAchse = detections[0].landmarks._shift._x;
    let yAchse = detections[0].landmarks._shift._y; */
    let mittelwertKameraHeight = (detections[0].detection._imageDims._height)/2;
    let mittelwertKameraWidth = (detections[0].detection._imageDims._width)/2;
    let xAchse = detections[0].landmarks._shift._x;
    let yAchse = detections[0].landmarks._shift._y;
 // console.log(mittelwertKameraHeight+'. '+mittelwertKameraWidth)
//  console.log(detections);

   /*  oXAchse.innerText = detections[0].detection._box._x;
    oYAchse.innerText = detections[0].detection._box._y; */
    
    if(input=='mimikKamera'){
      mimikControl(resizedDetections);
    }
    else if(input=='kopfBewegung'){
      kopfControl(xAchse,yAchse,mittelwertKameraHeight,mittelwertKameraWidth,oXAchse,oYAchse);
    }
  }, 100)

})

function kopfControl(xAchse,yAchse,mittelwertKameraHeight,mittelwertKameraWidth,oXAchse,oYAchse){
  let positionX = (xAchse/mittelwertKameraWidth)*100;
  let positionY = (yAchse/mittelwertKameraHeight)*100;
  console.log('x:'+positionX+' . y:'+positionY);

  if(positionX>=90){ if (Snake.direction != "r") {Snake.direction = "l";}}
  else if(positionX<=65){if (Snake.direction != "l") {Snake.direction = "r";}}
  if(positionY<=45){ if (Snake.direction != "d") {Snake.direction = "u";}}
  else if(positionY>=70){ if (Snake.direction != "u") {Snake.direction = "d";}}

  oXAchse.innerText = positionX;
  oYAchse.innerText = positionY;
}

function mimikControl(resizedDetections){
  let happy = resizedDetections['0'].expressions['happy'];
  let sad = resizedDetections['0'].expressions['sad'];
  let angry = resizedDetections['0'].expressions['angry'];
  let surprised = resizedDetections['0'].expressions['surprised'];

  if(happy<=1.5 && happy>=0.6){ if (Snake.direction != "d") {Snake.direction = "u";}}
  else if(sad<=1.5 && sad>=0.6){ if (Snake.direction != "u") {Snake.direction = "d";}}
  if(angry<=1.5 && angry>=0.6){  if (Snake.direction != "r") {Snake.direction = "l";}}
  else if(surprised<=1.5 && surprised>=0.6){if (Snake.direction != "l") {Snake.direction = "r";}}
}