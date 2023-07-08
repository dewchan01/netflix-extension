// WIP: Script to translate subtitles on Netflix and continuously update translations

// Function to retrieve the current subtitle element
function getSubtitleElement() {
  const subtitleElement = document.querySelector('#mainSub'); // Adjust the selector based on Netflix's HTML structure for subtitles
  return subtitleElement;
}

// Function to retrieve the current subtitle text
function getSubtitleText(subtitleElement) {
  if (subtitleElement) {
    return subtitleElement.textContent.trim();
  }

  return '';
}

// Function to set the translated subtitle text
function setTranslatedSubtitleText(translatedSubtitles, subtitleElement) {
  const translatedSubtitleElement = document.createElement('p');
  translatedSubtitleElement.className = 'translatedSubtitle';
  translatedSubtitleElement.textContent = translatedSubtitles;
  translatedSubtitleElement.style.cssText = 'left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; position: absolute; width: 1920px; top: 708.325px; font-size: 40px; text-shadow: 0 0 10px rgba(0, 0, 0, 0.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

  const existingTranslatedSubtitle = document.querySelector('.translatedSubtitle');

  if (existingTranslatedSubtitle) {
    existingTranslatedSubtitle.textContent = translatedSubtitles;
    console.log('Translated subtitle updated.');
  } else {
    if (subtitleElement && subtitleElement.parentNode) {
      const parentElement = subtitleElement.parentNode;
      const siblingElement = subtitleElement.nextElementSibling;

      parentElement.insertBefore(translatedSubtitleElement, siblingElement);
      parentElement.removeChild(subtitleElement);
      console.log('Translated subtitle inserted into DOM.');
    } else {
      console.log('Subtitle element or parent node not found.');
    }
  }
}


// Function to send the subtitle text to the background script
function sendSubtitleText(subtitleText) {
  console.log(subtitleText);
  // send message to background script
  chrome.runtime.sendMessage({ action: 'translate', subtitles: subtitleText }, function (response) {
    // if (chrome.runtime.lastError) {
    //   console.error(chrome.runtime.lastError);
    //   return;
    // }
    console.log("Response from background script: ",response);
    // handle response from background script and set translated subs
    if (response) {
      const translatedSubtitles = response.translatedSubtitles;
      const subtitleElement = getSubtitleElement();
      setTranslatedSubtitleText(translatedSubtitles, subtitleElement);
    } else {
      console.error('Translation failed.');
    }
  });
}

let previousSubtitleText = '';

function observeSubtitleChanges() {
  setInterval(() => {
    const subtitleElement = getSubtitleElement();
    const subtitleText = getSubtitleText(subtitleElement);

    if (subtitleText && subtitleText !== previousSubtitleText) {
      previousSubtitleText = subtitleText;
      sendSubtitleText(subtitleText);
    }
  }, 100); // Adjust the interval duration as needed
}

// Run the script
observeSubtitleChanges();
