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

const actualEmo = document.getElementById('emotion');
const actualDirc = document.getElementById('direction');
const actualEmoDircDiv = document.getElementById('actualEmotDirc');
const actualEmoDirIcons = document.getElementById('actualIcons');
const actualDiv = document.getElementById('actualEmotion');

const happyIcon = document.getElementById('laugh');
const sadIcon = document.getElementById('sad');
const angryIcon = document.getElementById('angry');
const surpriseIcon = document.getElementById('surprise');

const upIcon = document.getElementById("up");
const downIcon = document.getElementById("down");
const leftIcon = document.getElementById("left");
const rightIcon = document.getElementById("right");

actualDiv.style.visibility = 'hidden';
actualEmoDircDiv.style.visibility = 'hidden';
actualEmoDirIcons.style.visibility = 'hidden';
actualEmo.style.display = "none";
actualDirc.style.display = "none";
happyIcon.style.display = "none";
sadIcon.style.display = "none";
angryIcon.style.display = "none";
surpriseIcon.style.display = "none";

upIcon.style.display = "none";
downIcon.style.display = "none";
leftIcon.style.display = "none";
rightIcon.style.display = "none";

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  const container = document.getElementById('facePart')
  container.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)


  setInterval(async () => {
    let input = localStorage.getItem('inputMode');

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

   /*  let xAchse = detections[0].landmarks._shift._x;
    let yAchse = detections[0].landmarks._shift._y; */
    let mittelwertKameraHeight = (detections[0].detection._imageDims._height)/2;
    let mittelwertKameraWidth = (detections[0].detection._imageDims._width)/2;
    let xAchse = detections[0].landmarks._shift._x;
    let yAchse = detections[0].landmarks._shift._y;

    actualDiv.style.visibility = 'visible';
    actualEmoDircDiv.style.visibility = 'visible';
    actualEmoDirIcons.style.visibility = 'visible'; 

    if(input=='mimikKamera'){
      actualDirc.style.display = "none";
      actualEmo.style.display = "block";
      upIcon.style.display = "none";
      downIcon.style.display = "none";
      leftIcon.style.display = "none";
      rightIcon.style.display = "none";
      mimikControl(resizedDetections);
    }
    else if(input=='kopfBewegung'){    
      happyIcon.style.display = "none";
      sadIcon.style.display = "none";
      angryIcon.style.display = "none";
      surpriseIcon.style.display = "none";
      actualDirc.style.display = "block";
      actualEmo.style.display = "none";
      kopfControl(xAchse,yAchse,mittelwertKameraHeight,mittelwertKameraWidth);
    }
  }, 100)

})

function kopfControl(xAchse,yAchse,mittelwertKameraHeight,mittelwertKameraWidth){
  let positionX = (xAchse/mittelwertKameraWidth)*100;
  let positionY = (yAchse/mittelwertKameraHeight)*100;
  if(positionX>=90){
    upIcon.style.display = "none";
    downIcon.style.display = "none";
    leftIcon.style.display = "block";
    rightIcon.style.display = "none";
    if (Snake.direction != "r") {Snake.direction = "l";}}
  else if(positionX<=65){
    upIcon.style.display = "none";
    downIcon.style.display = "none";
    leftIcon.style.display = "none";
    rightIcon.style.display = "block";
    if (Snake.direction != "l") {Snake.direction = "r";}}
  if(positionY<=45){ 
    upIcon.style.display = "block";
    downIcon.style.display = "none";
    leftIcon.style.display = "none";
    rightIcon.style.display = "none";
    if (Snake.direction != "d") {Snake.direction = "u";}}
  else if(positionY>=70){ 
    upIcon.style.display = "none";
    downIcon.style.display = "block";
    leftIcon.style.display = "none";
    rightIcon.style.display = "none";
    if (Snake.direction != "u") {Snake.direction = "d";}} 
}

function mimikControl(resizedDetections){
  let happy = resizedDetections['0'].expressions['happy'];
  let sad = resizedDetections['0'].expressions['sad'];
  let angry = resizedDetections['0'].expressions['angry'];
  let surprised = resizedDetections['0'].expressions['surprised'];

  if(happy<=1.5 && happy>=0.6){ 
    happyIcon.style.display = "block";
    sadIcon.style.display = "none";
    angryIcon.style.display = "none";
    surpriseIcon.style.display = "none";
    if (Snake.direction != "d") {Snake.direction = "u";}}
  else if(sad<=1.5 && sad>=0.6){ 
    happyIcon.style.display = "none";
    sadIcon.style.display = "block";
    angryIcon.style.display = "none";
    surpriseIcon.style.display = "none";
    if (Snake.direction != "u") {Snake.direction = "d";}}
  if(angry<=1.5 && angry>=0.6){ 
    happyIcon.style.display = "none";
    sadIcon.style.display = "none";
    angryIcon.style.display = "block";
    surpriseIcon.style.display = "none"; 
    if (Snake.direction != "r") {Snake.direction = "l";}}
  else if(surprised<=1.5 && surprised>=0.6){
    happyIcon.style.display = "none";
    sadIcon.style.display = "none";
    angryIcon.style.display = "none";
    surpriseIcon.style.display = "block";
    if (Snake.direction != "l") {Snake.direction = "r";}}
}