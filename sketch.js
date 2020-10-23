//basic setup
const canvas = 600;
//sets init permission (only on Chrome?)
let permissionGiven = false;
let input;
let analyzer;
let spritesheet;
let spritedata;
let expressYourself;
let animation = [];
let mouth;
const initSize = 100;
let x, y;

//setup for p5.Speech
let lang = navigator.language || 'en-US';
const speechRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
speechRec.continuous = true; // do continuous recognition
speechRec.interimResults = false; // allow partial recognition (faster, less accurate)
let words = [];
//end of setup for p5.Speech

//format background text
function formatText() {
  stroke(255);
  fill(255);
  textSize(20);
  textFont('Inconsolata');
}

function initPos() {
x = width/2 - initSize/2;
y = height/2 - initSize/2;
}

function printClick(){
}

function clickStarted () {
  getAudioContext().resume();
}

function preload(){
  spritedata = loadJSON('abstract/mouth-sprite.json');
  spritesheet = loadImage('abstract/mouth-sprite.png');
  weatherdata = loadJSON('abstract/weather.json');
  weathersheet = loadImage('abstract/weather.png');
  expressYourself = loadImage('./abstract/express-yourself.png');
  checkPermissions();
}

function makeAnimation() {
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }
}

function drawBG() {
  for (i = 0; i < 50; i++) {
    const xInit = Math.random() * canvas;
    const yInit = Math.random() * canvas;
    const randTile = tileArray[Math.floor(Math.random()*tileArray.length)];
    image(randTile, xInit, yInit, 25, 25);
  }
}

function newInput(){
  document.addEventListener("click", clickStarted);

  input = new p5.AudioIn();
  input.start();
}

function getThreshold(){
  let volume = input.getLevel();
  let threshold = 0.02;
  // ("volume", volume);

  if (volume > threshold) {
    volume = map(volume, 0.001, 0.5, 50, 500);
    // (mouth, volume);
    mouth.show(volume);
    mouth.update();
  }
  else {
    mouth.show();
  }
}

function setup() {
  createCanvas(canvas, canvas);
  initPos();
  frameRate(12);
  newInput();
  makeAnimation();
  mouth = new Sprite(animation, x, y, initSize, 10);
  speechRec.start();
}

function draw() {
  checkKey();
  formatText();
  checkWords();
  drawWords();
  if(!permissionGiven){
    displayPermissionMessage();
  } else {
    drawGame();
  }
}

function checkKey(){
  if(keyIsDown(LEFT_ARROW)){
    mouth.x -= mouth.speed
  }
  if(keyIsDown(RIGHT_ARROW)){
    mouth.x += mouth.speed
  }
  if(keyIsDown(UP_ARROW)){
    mouth.y -= mouth.speed
  }
  if(keyIsDown(DOWN_ARROW)){
    mouth.y += mouth.speed
  }
}

function drawGame(){
  getThreshold();
  stroke(0,0,0,0);
  fill(65);
  textSize(15);
  textFont('Inconsolata');
  textAlign(BOTTOM);
  text("tell me how you're feeling. I'm feeling... blue? // refresh and click to clear", 0, 580);
  text("// or say clear!", 0, 595);
}

//shows permissions message
function displayPermissionMessage(){
  background(0);
  stroke(0,0,0,0);
  fill(255);
  textSize(25);
  textFont('Inconsolata');
  text('please enable your microphone to continue', 10, 20);
}

//permissions to work with user's microphone (Chrome only)
function checkPermissions(){
  navigator.permissions.query(
    { name: 'microphone' } 
).then( (permissionStatus) => {
    if(permissionStatus.state === 'granted'){
      permissionGiven = true;
    }
    permissionStatus.onchange = function(){
        console.log("Permission changed to " + this.state);
        if(this.state === 'granted'){
          permissionGiven = true;
        }
    }
})
}

//p5.Speech functions
function drawWords() {
  for (i = 0; i < words.length; i++) {
      text(words[i], Math.floor(Math.random()*600), Math.floor(Math.random()*600));
    }
  }

function checkWords() {
  if (words.length == 0) {
      background(235); //RGB Value 
  }
}

//all of the speech functions and voice rec are in here
function parseResult()
{
  // recognition system will often append words into phrases.
      // so hack here is to only use the last word:
      if(speechRec.resultValue==true) {
          const result = speechRec.resultString.split(" ").pop();
          words.push(result);
          console.log(words);
      }
  const mostrecentword = speechRec.resultString.split(' ').pop();
  if(mostrecentword.indexOf("clear")!==-1 || mostrecentword.indexOf("yes")!==-1 || mostrecentword.indexOf("yeah")!==-1) {
          words.splice(0, words.length);
          console.log('Cleared Array!');
      } else if (mostrecentword.indexOf("pink" )!==-1) {
          background(7, 236, 24);
      } else if (mostrecentword.indexOf("blue")!==-1) {
          background(7, 13, 234);
      } else if (mostrecentword.indexOf("red")!==-1 || mostrecentword.indexOf("angry")!==-1) {
          background(234, 7, 26);
      } else if (mostrecentword.indexOf("yellow")!==-1 || mostrecentword.indexOf("purple")!==-1) {
          background(65, 0, 170);
      } else if (mostrecentword.indexOf("green")!==-1 || mostrecentword.indexOf("disgusted")!==-1) {
          background(65, 170, 0);
      } else if (mostrecentword.indexOf("orange")!==-1) {
          background(244, 146, 0);
      } else if (mostrecentword.indexOf("penis")!==-1 || mostrecentword.indexOf("*")!==-1) {
          words.splice(0, words.length, "NAUGHTY BOY");
          background(249, 0, 8);
      } else if (mostrecentword.indexOf("sad")!==-1 || mostrecentword.indexOf("depressed")!==-1 || mostrecentword.indexOf("frustrated")!==-1 || mostrecentword.indexOf("upset")!==-1 || mostrecentword.indexOf("anxious")!==-1 || mostrecentword.indexOf("overwhelmed")!==-1) {
          words.splice(0, words.length, "It's going to be okay");
          background(249, 208, 0);
      } else if (mostrecentword.indexOf("okay")!==-1 || mostrecentword.indexOf("fine")!==-1 || mostrecentword.indexOf("alright")!==-1 || mostrecentword.indexOf("so")!==-1 || mostrecentword.indexOf("good")!==-1 || mostrecentword.indexOf("well")!==-1) {
          words.splice(0, words.length, "Are you sure?");
          background(0, 0, 0);
      } else if (mostrecentword.indexOf("happy")!==-1 || mostrecentword.indexOf("optimistic")!==-1 || mostrecentword.indexOf("excited")!==-1 || mostrecentword.indexOf("peaceful")!==-1 || mostrecentword.indexOf("good")!==-1 || mostrecentword.indexOf("well")!==-1) {
          words.splice(0, words.length, "good to hear!");
          background(85, 237, 221);
      } else if (mostrecentword.indexOf("tire")!==-1 || mostrecentword.indexOf("tired")!==-1 || mostrecentword.indexOf("exhausted")!==-1 || mostrecentword.indexOf("sleepy")!==-1 || mostrecentword.indexOf("lethargic")!==-1 || mostrecentword.indexOf("done")!==-1 || mostrecentword.indexOf("bed")!==-1) {
          words.splice(0, words.length, "get some rest!");
          background(199, 150, 247);
      } else if (mostrecentword.indexOf("no")!==-1) {
          words.splice(0, words.length, "then what?");
          background(0, 0, 0);
      } else if (mostrecentword.indexOf("you")!==-1) {
          words.splice(0, words.length, "ERROR");
          background(0, 0, 0);
      }
  console.log(mostrecentword);
}