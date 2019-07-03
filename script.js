var tapElementOne = document.getElementById('one');
var regionOne = new ZingTouch.Region(tapElementOne, true, false);
var longTap = new ZingTouch.Tap({
  maxDelay: 1000
})
var swipe=new ZingTouch.Swipe({
	numInputs: 1,
	maxRestTime: 100,
	escapeVelocity: 0.2
});
var regionthree=new ZingTouch.Region(tapElementOne,true,false);
var rotate= new ZingTouch.Rotate({
  angle:20,
distanceFromOrigin:10,
distanceFromLast:20
})

regionthree.bind(tapElementOne, rotate, function(e){
  var textElement = document.getElementById('one');
  textElement.innerHTML = "Rotated!";
  tapElementOne.style.backgroundColor='red';
  setOutput([
    ['Gesture', 'Swipe'],
    ['inputs' , '1'],
    ['interval', Math.floor(e.detail.interval) + "ms"]
  ]);

  (function(element){
    setTimeout(function(){
      element.innerHTML = "swipe or rotate the bubble";
      tapElementOne.style.backgroundColor='lightgreen';
    }, 1000);
  })(textElement);
})

regionOne.bind(tapElementOne, swipe, function(e){
  var textElement = document.getElementById('one');
  textElement.innerHTML = "Swipped!";
  tapElementOne.style.backgroundColor='black';
  setOutput([
    ['Gesture', 'Swipe'],
    ['inputs' , '1'],
    ['interval', Math.floor(e.detail.interval) + "ms"]
  ]);

  (function(element){
    setTimeout(function(){
      element.innerHTML = "swipe or rotate the bubble";
      tapElementOne.style.backgroundColor='lightgreen';
    }, 1000);
  })(textElement);
})


var tapElementTwo = document.getElementById('two');
var TwoFingerTap = new ZingTouch.Tap({
  numInputs: 2,
  maxDelay: 1000
});

var regionTwo = new ZingTouch.Region(tapElementTwo, true, false);
regionTwo.bind(tapElementTwo, TwoFingerTap, function(e){
  setOutput([
    ['Gesture', 'Tap'],
    ['inputs' , '2'],
    ['interval', Math.floor(e.detail.interval) + "ms"]
  ]);

  var textElement = document.getElementById('two');
  textElement.innerHTML = "Tapped!";
  (function(element){
    setTimeout(function(){
      element.innerHTML = "Two Finger Tap";
    }, 1000);
  })(textElement);
})

var NUM_BUBBLES = 50;

var canvas = document.createElement('canvas');
var canvasPicker = document.createElement('canvas');
canvas.id = "main-canvas";
canvasPicker.id = "picker-canvas";
canvasPicker.style.visibility = "hidden";
canvasPicker.style.visibility = "hidden";
canvasPicker.style.position = 'fixed';

var bubbles = [];
var container = document.getElementById('container');
container.appendChild(canvas);
container.appendChild(canvasPicker);

var bBox = container.getBoundingClientRect();
canvas.width = canvasPicker.width = bBox.width;
canvas.height = canvasPicker.height = bBox.height;

window.onresize = function(){
  console.log('fire');
  resizeCanvas();
}

function resizeCanvas(){
  var container = document.getElementById('container');
  container.appendChild(canvas);
  container.appendChild(canvasPicker);

  var bBox = container.getBoundingClientRect();
  canvas.width = canvasPicker.width = bBox.width;
  canvas.height = canvasPicker.height = bBox.height;
}

resizeCanvas();
var canvasRegion = new ZingTouch.Region(document.getElementById('container'));
//SWIPING
canvasRegion.bind(canvas, 'swipe', function(e) {
  var weight = 1.5;

  setOutput([
    ['Gesture', 'Swipe'],
    ['velocity', Math.floor(e.detail.data[0].velocity) + "px/ms"],
    ['currentDirection', Math.floor(e.detail.data[0].currentDirection) + "¡"]
  ]);

  var canvas = document.getElementById('main-canvas');
  var canvasRect = canvas.getBoundingClientRect();
  var x = e.detail.events[0].x - canvasRect.left;
  var y = e.detail.events[0].y - canvasRect.top;

  bubbles[lastIndex].x = (x < 0) ? 0 : (x > canvasRect.width) ? canvasRect.width : x;
  bubbles[lastIndex].y = (y < 0) ? 0 : (y > canvasRect.height) ? canvasRect.height : y;
  var theta = Math.sin((Math.PI / 180) * e.detail.data[0].currentDirection);
  bubbles[lastIndex].vy = -1 * (2 * (e.detail.data[0].velocity * Math.sin((Math.PI / 180) * e.detail.data[0].currentDirection)));
  bubbles[lastIndex].vx = 2 * (e.detail.data[0].velocity * Math.cos((Math.PI / 180) * e.detail.data[0].currentDirection));
});

//PANNING
var currentIndex = lastIndex = null;
var customPan = new ZingTouch.Pan({
  threshold: 1
});
var startPan = customPan.start;

customPan.start = function(inputs) {
  /////////////////////////////////////////////////////////
  console.log("color change");
  bubble.color = 'rgba(' + getRandNum(0, 255) + ',' + getRandNum(0, 255)
  + ',' + getRandNum(0, 255) + ',' + 0.5 + ')'; //last one is opacity


  var canvas = document.getElementById('main-canvas');
  var canvasRect = canvas.getBoundingClientRect();

  var x = inputs[0].current.x - canvasRect.left;
  var y = inputs[0].current.y - canvasRect.top;
  currentIndex = getIndex(x, y);
  if (currentIndex !== null) {
    bubbles[currentIndex].stopped = true;
  }

  return startPan.call(this, inputs);
}
canvasRegion.bind(canvas, customPan, function(e) {
  setOutput([
    ['Gesture', 'Pan'],
    ['currentDirection', Math.floor(e.detail.data[0].currentDirection) + "¡"],
    ['directionFromOrigin', Math.floor(e.detail.data[0].directionFromOrigin) + "¡"],
    ['distanceFromOrigin', Math.floor(e.detail.data[0].distanceFromOrigin) + "px"]
  ]);

  var originalEvent = e.detail.events[0].originalEvent;
  var canvas = document.getElementById('main-canvas');
  var canvasRect = canvas.getBoundingClientRect();

  var x = e.detail.events[0].x - canvasRect.left;
  var y = e.detail.events[0].y - canvasRect.top;

  var rect = canvas.getBoundingClientRect();
  bubbles[currentIndex].x = (x < 0) ? 0 : (x > rect.width) ? rect.width : x;
  bubbles[currentIndex].y = (y < 0) ? 0 : (y > rect.height) ? rect.height : y;

  //Change velocity.
  bubbles[currentIndex].vy = -1 * Math.sin((Math.PI / 180) * e.detail.data[0].currentDirection);
  bubbles[currentIndex].vx = Math.cos((Math.PI / 180) * e.detail.data[0].currentDirection);
});

var endPan = customPan.end;
customPan.end = function(inputs) {
  bubbles[currentIndex].stopped = false;
  lastIndex = currentIndex;
  currentIndex = null;
  return endPan.call(this, inputs);
}

function getIndex(x, y) {
  x = Math.floor(x);
  y = Math.floor(y);
  var canvas = document.getElementById('picker-canvas');
  ctx = canvas.getContext('2d');
  var colors = ctx.getImageData(x, y, 1, 1).data;
  var str = "";
  for (var i = 0; i < colors.length - 1; i++) {
    str += colors[i];
  }
  return parseInt(str);
}

var Bubble = function() {
  this.x = getRandNum(0, canvas.width);
  this.y = getRandNum(0, canvas.height);
  this.vx = getRandNum(-1, 1, 2);
  this.vy = getRandNum(-1, 1, 2);
  this.radius = 40;
  this.minRadius = getRandNum(30, 50);
  this.maxRadius = 50;
  this.stopped = false;
  this.grow = true;
  //this.color = 'rgba(' + getRandNum(0, 10) + ',' + getRandNum(0, 250) + ',' + getRandNum(100, 255) + ',' + 0.6 + ')'; //get random blue:ish color
  this.rate = getRandNum(0.1, 0.2, 1);
};

Bubble.prototype = {
  render: function(id) {
    var canvas = document.getElementById('main-canvas');
    var canvasPicker = document.getElementById('picker-canvas');
    ctx = canvas.getContext('2d');
    ctxPicker = canvasPicker.getContext('2d');
    drawOnCanvas(this, ctx, id, false);
    drawOnCanvas(this, ctxPicker, id, true);

    function drawOnCanvas(_this, context, id, picker) {
      id = id + "";
      var arr = id.split('');
      while (arr.length < 3) {
        arr.unshift("0");
      }
      if (picker) {
        var color = arr.join(',');
        context.beginPath();
        context.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);
        context.fillStyle = 'rgba(' + color + ',1)';
        context.strokeStyle = 'rgba(' + color + ',1)';
      } else {
        var color = arr.join(',');
        context.beginPath();
        context.arc(_this.x, _this.y, _this.radius /2, 0, 2 * Math.PI); //change size
        context.fillStyle = _this.color;
        context.strokeStyle = (_this.stopped) ? 'rgba(0,0,0,0.5)' : _this.color;
      }

      context.fill();
      context.stroke();
    }

  },
  update: function() {
    //UPDATABLE
    if (this.stopped) {
      return;
    }

    //MOVEMENT
    var canvas = document.getElementById('main-canvas');
    var canvasRect = canvas.getBoundingClientRect();
    this.x = this.x + (this.vx * 1);
    this.y = this.y + (this.vy * 1);

    //Change direction / hit a boundary
    if (this.x > canvasRect.width || this.x < 0) {
      if (this.x < 0) {
        this.x = 0;
      } else {
        this.x = canvasRect.width;
      }

      //Reduce velocity
      var currentDirectionX = (this.vx > 0) ? 1 : -1;
      this.vx = Math.abs(this.vx) * 0.60; //Reduce velocity
      this.vx = (this.vx < 1) ? 1 : this.vx;
      this.vx = (currentDirectionX * -1) * this.vx;
    }

    if (this.y > canvasRect.height || this.y < 0) {
      if (this.y < 0) {
        this.y = 0;
      } else {
        this.y = canvasRect.height;
      }

      var currentDirectionY = (this.vy > 0) ? 1 : -1;
      this.vy = Math.abs(this.vy) * 0.60; //Reduce velocity
      this.vy = (this.vy < 1) ? 1 : this.vy;
      this.vy = (currentDirectionY * -1) * this.vy;
    }
  }
}

for (var i = 0; i < NUM_BUBBLES; i++) {
  var bubble = new Bubble();
  bubbles.push(bubble);
  bubble.render(i);

}

window.requestAnimationFrame(eventLoop);

function eventLoop(timestamp) {
  window.requestAnimationFrame(eventLoop);
  var canvas = document.getElementById('main-canvas');
  var canvasPicker = document.getElementById('picker-canvas');
  ctx = canvas.getContext('2d');
  ctxPicker = canvasPicker.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxPicker.clearRect(0, 0, canvasPicker.width, canvasPicker.height);

  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].update(i);
    bubbles[i].render(i);
  }
}

function getRandNum(min, max, decimals) {
  decimals = (decimals) ? decimals : 0;
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(decimals));
}

function setOutput(data){
  var outputStr = "> ";
  for (var i = 0; i < data.length; i++){
    outputStr += data[i][0] + ": " + data[i][1] + ((i===data.length-1) ? '' : ' , ');
  }
  var output = document.getElementById('output');
  output.innerHTML = outputStr;
}

function setOutput(data){
  console.log('here');

  var outputStr = "> ";
  for (var i = 0; i < data.length; i++){
    outputStr += data[i][0] + ": " + data[i][1] + ((i===data.length-1) ? '' : ' , ');
  }
  var output = document.getElementById('output');
  output.innerHTML = outputStr;
}