'use strict';

(() => {

  const hasRevealedSecretKey = 'hasRevealedSecret';
  const button = document.querySelector('#touchscreen button');
  const buttonLoader = document.querySelector('#touchscreen button #button-loading');

  const getHasRevealedSecret = () => ((document.cookie.indexOf('hasRevealedSecret') != -1) || (localStorage && localStorage.getItem(hasRevealedSecretKey)));

  let isLoading = false;
  let hasRevealedSecret = getHasRevealedSecret();
  let secret = `I have a secret to tell you.
  But please promise me you won't tell anyone.
  I cheated on several spelling tests when I was in the first grade.
  I looked over the shoulders of the classmates sitting next to me.`;

  // If the User has already revealed the secret, immediately hide it
  // and stop execution of all other scripts
  if(hasRevealedSecret)
  {
    button.setAttribute('style', 'display: none');
    return;
  }

  const onPressButton = () => {

    if(hasRevealedSecret)
    {
      return;
    }

    isLoading = true;
    updateButtonLoader();

  };

  const onReleaseButton = () => {

    if(hasRevealedSecret)
    {
      return;
    }

    isLoading = false;
    resetButtonLoader();

  };

  button.addEventListener('mousedown', onPressButton);
  button.addEventListener('mouseup', onReleaseButton);

  let height = 0;

  const updateButtonLoader = () => {

    if(!isLoading)
    {
      return;
    }

    if(height > 100)
    {
      revealSecret();
      return;
    }

    displayButtonLoader();
    setTimeout(updateButtonLoader, 30);

  };

  const resetButtonLoader = () => {

    height = 0;
    displayButtonLoader();

  };

  const displayButtonLoader = () => {
    buttonLoader.setAttribute('style', `height: ${height++}%`);
  };

  const revealSecret = () => {

    if(hasRevealedSecret)
    {
      return;
    }

    hasRevealedSecret = true;

    // Hide the button
    button.className = 'hidden';

    // Play the secret
    let message = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    message.voice = voices[4];
    message.voiceURI = 'native';
    message.volume = 0.3; // 0 to 1
    message.rate = 0.8; // 0.1 to 10
    message.pitch = 0.8; //0 to 2
    message.text = secret;
    message.lang = 'en-US';

    speechSynthesis.speak(message);

    // Lock the touchscreen so the secret can no longer be played
    lockTouchscreen();

  };

  const lockTouchscreen = () => {

    document.cookie = hasRevealedSecretKey;

    if(localStorage)
    {
      localStorage.setItem(hasRevealedSecretKey, true);
    }

  };

})();
