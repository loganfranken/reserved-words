'use strict';

const marks = [];
let currMismatchPercentage = 100;

const getRandomInt = (min, max) => ( Math.floor(Math.random() * (max - min + 1)) + min );

const getRandomGrayscale = () => {

  let colorIndex = getRandomInt(0, 255);
  return `rgb(${colorIndex}, ${colorIndex}, ${colorIndex})`;

};

const getRandomMark = (canvasWidth, canvasHeight) => {

  let x = getRandomInt(0, canvasWidth);
  let y = getRandomInt(0, canvasHeight);
  let radius = getRandomInt(3, 5);
  let color = getRandomGrayscale();

  return {
    x,
    y,
    radius,
    color
  };

};

const drawArtwork = (context, canvasWidth, canvasHeight) => {

  // Clear the canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the circles
  marks.forEach((mark) => {

    context.beginPath();
    context.arc(mark.x, mark.y, mark.radius, 0, 2 * Math.PI);
    context.fillStyle = mark.color;
    context.fill();
    context.closePath();

  });

};

// Initialize the canvas
let canvasContainer = document.getElementById('artwork');
let canvas = document.querySelector('#artwork canvas');
let context = canvas.getContext('2d');

// Reset canvas dimensions to the size of its container
let canvasWidth = canvasContainer.clientWidth;
let canvasHeight = canvasContainer.clientHeight

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const loop = () => {

  // Generate a random mark
  marks.push(getRandomMark(canvasWidth, canvasHeight));

  // Generate the artwork
  drawArtwork(context, canvasWidth, canvasHeight);

  // Get image data
  let canvasImageData = canvas.toDataURL();

  // Detect the generated artwork's similarity with the picture of myself
  resemble(canvasImageData).compareTo(creatorImageFile).ignoreColors().scaleToSameSize().onComplete((data) => {

    if(data.misMatchPercentage <= currMismatchPercentage)
    {
      currMismatchPercentage = data.misMatchPercentage;
      // Generated artwork is MORE similar to myself than it was before,
      // continue building on this artwork
    }
    else
    {
      // Generated artwork is LESS similar to myself than it was before,
      // remove the last mark that was generated
      marks.pop();
    }

    console.log(currMismatchPercentage);
    setTimeout(loop, 100);

  });

};

// Start the loop
loop();
