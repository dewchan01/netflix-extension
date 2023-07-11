// WIP: update position of old subs and new subs
// WIP: fix the enable and disable of the extension button

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
  translatedSubtitleElement.style.cssText = 'left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; position: absolute; width: 1920px; top: 758.325px; font-size: 40px; font-weight: 500; font-family: "Netflix Sans", "Helvetica Neue", "Segoe UI", Roboto, Ubuntu, sans-serif; color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

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
  chrome.runtime.sendMessage({ action: 'enableExtension', subtitles: subtitleText }, function (response) {
    // if (chrome.runtime.lastError) {
    //   console.error(chrome.runtime.lastError);
    //   return;
    // }
    console.log("Response from background script: ", response);
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
let isEnabled = false;
let intervalId = null;

// Retrieve the extension state from storage when the content script is injected
chrome.storage.sync.get('isEnabled', function (result) {
  isEnabled = result.isEnabled;

  // Start observing subtitle changes if the extension is enabled
  if (isEnabled) {
    intervalId = setInterval(observeSubtitleChanges, 100);
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  
  if (message.action === 'toggleExtension') {
    isEnabled = !isEnabled;

    if (isEnabled && !intervalId) {
      intervalId = setInterval(observeSubtitleChanges, 100);
    } else if (!isEnabled && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      removeTranslatedSubtitle();
    }

    sendResponse({ isEnabled: isEnabled });
  }
});

function removeTranslatedSubtitle() {
  const translatedSubtitle = document.querySelector('.translatedSubtitle');
  if (translatedSubtitle) {
    translatedSubtitle.parentNode.removeChild(translatedSubtitle);
    console.log('Translated subtitle removed.');
  }
}

function observeSubtitleChanges() {
  const subtitleElement = getSubtitleElement();
  const subtitleText = getSubtitleText(subtitleElement);

  if (subtitleText === '') {
    setTranslatedSubtitleText('', subtitleElement);
  }

  if (subtitleText && subtitleText !== previousSubtitleText) {
    previousSubtitleText = subtitleText;
    sendSubtitleText(subtitleText);
  }
}
