'use strict';

const maxFrames = 20;
let frames = [];

const loadFrame = (index) => {

  let image = new Image();
  image.src = `images/${index}.jpg`;
  image.onload = () => {

    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    canvas.getContext('2d').drawImage(image, 0, 0);

    onLoadedFrame(canvas.toDataURL('image/jpeg', 0.5), index);

  };

}

const loadingBar = document.getElementById('loading-bar');
const loadingBarContainer = document.getElementById('loading-bar-container');

const onLoadedFrame = (image, index) => {

  frames[index] = image;
  loadingBar.setAttribute('style', `width: ${(frames.length/maxFrames) * 100}%;`);

  if(frames.length >= maxFrames)
  {
    loadingBarContainer.setAttribute('style', 'display: none;');
    onAllFramesLoaded();
  }

}

const onAllFramesLoaded = () => { start() }

const start = () => {

  // Randomize the frames (except for the first one)
  shuffle(frames);

  let sortedFrames = [];

  let lastFrame = frames[0];
  sortedFrames.push(lastFrame);
  frames[0] = null;

  // Play the initial frame
  playSortedFrames(sortedFrames);

  const advanceSort = () => {

    // Calculate how similar this frame is to all of the other frames
    let mostSimilarFrame = null;

    let diffCalcPromises = frames.map((frame, index) => {
      return new Promise((resolve, reject) => {

        if(frame === null)
        {
          resolve();
          return;
        }

        resemble(lastFrame).compareTo(frame).ignoreColors().onComplete((data) => {

          let similarity = (100 - data.misMatchPercentage);

          if(mostSimilarFrame === null || similarity > mostSimilarFrame.similarity)
          {
            mostSimilarFrame = {
              similarity,
              index
            };
          }

          resolve();

        });

      });
    });

    // Set the most similar frame as the next frame
    Promise.all(diffCalcPromises).then(() => {

      let lastFrame = frames[mostSimilarFrame.index];
      sortedFrames.push(lastFrame);
      frames[mostSimilarFrame.index] = null;

    });

    // Play the current movie and continue the loop
    playSortedFrames(sortedFrames).then(() => {

      if(sortedFrames.length >= frames.length)
      {
        // Reset and restart
        frames = sortedFrames.map((frame) => (frame));
        sortedFrames = [];
        start();
      }
      else
      {
        advanceSort();
      }

    });

  }

  advanceSort();

}

const playSortedFrames = (sortedFrames) => {
  return new Promise((resolve, reject) => {

    let currIndex = 0;

    const nextFrame = () => {

      if(currIndex >= sortedFrames.length)
      {
        resolve();
        return;
      }

      document.getElementById('screen').setAttribute('src', sortedFrames[currIndex++]);
      setTimeout(nextFrame, 100);

    };

    nextFrame();

  });
};

// Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = (array) => {

  let currentIndex = array.length;
  let temporaryValue = null;
  let randomIndex = null;

  // Leave the first frame in place
  while (1 !== currentIndex)
  {
    do
    {
      randomIndex = Math.floor(Math.random() * currentIndex);
    }
    while(randomIndex === 0)

    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;

}

// Load all images
for(let i=0; i<maxFrames; i++)
{
  loadFrame(i);
}
