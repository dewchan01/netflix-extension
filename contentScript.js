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
  const translatedSubtitleElement = document.createElement('div');
  translatedSubtitleElement.className = 'translatedSubtitle';
  translatedSubtitleElement.textContent = translatedSubtitles;
  console.log(translatedSubtitleElement)

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
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
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

function observeSubtitleChanges() {
  const observer = new MutationObserver(function () {
    const subtitleElement = getSubtitleElement();
    const subtitleText = getSubtitleText(subtitleElement);

    sendSubtitleText(subtitleText);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Run the script
observeSubtitleChanges();
