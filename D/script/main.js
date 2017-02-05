'use strict';

const getRandomInt = (min, max) => ( Math.floor(Math.random() * (max - min + 1)) + min );

const getRandomElement = (targetArray) => ( targetArray[getRandomInt(0, targetArray.length - 1)] );

const getRandomMark = (canvasWidth, canvasHeight) => {

  let x = getRandomInt(0, canvasWidth);
  let y = getRandomInt(0, canvasHeight);
  let radius = getRandomInt(3, 5);
  let color = getRandomInt(0, 255);

  return {
    x,
    y,
    radius,
    color
  };

};

const drawArtwork = (context, canvasWidth, canvasHeight, marks) => {

  // Clear the canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the circles
  marks.forEach((mark) => {

    context.beginPath();
    context.arc(mark.x, mark.y, mark.radius, 0, 2 * Math.PI);
    context.fillStyle = `rgb(${mark.color}, ${mark.color}, ${mark.color})`;
    context.fill();
    context.closePath();

  });

};

const displayPositiveCritique = (critiqueContainer, critiqueMessage) => {

  const messageParts = [
    getRandomElement(['Look at this', 'What a', 'A truly', 'A', 'Wow, just a', 'Such a']),
    getRandomElement(['beautiful', 'intriguing', 'fascinating', 'inspiring', 'groundbreaking', 'necessary', 'important', 'critical']),
    getRandomElement(['piece', 'work', 'creation'])
  ];

  critiqueMessage.innerHTML = messageParts.join(' ');

};

const displayNegativeCritique = (critiqueContainer, critiqueMessage) => {

  const messageParts = [
    getRandomElement(['Look at this', 'What a', 'A', 'Such a', 'Ugh, just a']),
    getRandomElement(['worthless', 'useless', 'unnecessary', 'lackluster', 'thoughtless', 'uninspired', 'pointless']),
    getRandomElement(['piece', 'work', 'creation'])
  ];

  critiqueMessage.innerHTML = messageParts.join(' ');

};

const loop = (props) => {

  // Generate a random mark and add it to the artwork
  let mark = getRandomMark(props.canvasWidth, props.canvasHeight);
  props.marks.push(mark);

  // Generate the artwork
  drawArtwork(props.context, props.canvasWidth, props.canvasHeight, props.marks);

  // Get the color of the corresponding pixel from the creator's image
  let creatorPixelData = creatorContext.getImageData(mark.x, mark.y, 1, 1).data;

  if((Math.abs(creatorPixelData[0] - mark.color) < props.colorCompareThreshold)
      && (Math.abs(creatorPixelData[1] - mark.color) < props.colorCompareThreshold)
      && (Math.abs(creatorPixelData[2] - mark.color) < props.colorCompareThreshold))
  {
    // Generated artwork is MORE similar to myself than it was before,
    // continue building on this artwork
    displayPositiveCritique(props.critiqueContainer, props.critiqueMessage);
  }
  else
  {
    // Generated artwork is LESS similar to myself than it was before,
    // remove the last mark that was generated
    props.marks.pop();
    displayNegativeCritique(props.critiqueContainer, props.critiqueMessage);
  }

  setTimeout(() => { loop(props) }, props.frameRate);

};

// Get references to the critique messaging
let critiqueContainer = document.getElementById('critique');
let critiqueMessage = document.getElementById('critique-message');

// Initialize the canvas
let canvasContainer = document.getElementById('artwork');
let canvas = document.querySelector('#artwork canvas');
let context = canvas.getContext('2d');

// Reset canvas dimensions to the size of its container
let canvasWidth = canvasContainer.clientWidth;
let canvasHeight = canvasContainer.clientHeight

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Initialize the creator image
let creatorCanvas = document.createElement('canvas');
creatorCanvas.width = canvasWidth;
creatorCanvas.height = canvasHeight;

let creatorContext = creatorCanvas.getContext('2d');

let creatorImage = new Image();
creatorImage.src = creatorImageFile;
creatorImage.onload = () => {

  creatorContext.drawImage(creatorImage, 0, 0, canvasWidth, canvasHeight);
  loop({
    context,
    canvasWidth,
    canvasHeight,
    marks: [],
    creatorContext,
    critiqueContainer,
    critiqueMessage,
    colorCompareThreshold: 100,
    frameRate: 500
  });

};
