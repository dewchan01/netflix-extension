// WIP: Script to translate subtitles on Netflix still cannot continuously running

// Function to retrieve the current subtitle element
function getSubtitleElement() {
    const subtitleElement = document.querySelector('.player-timedtext-text-container'); // Adjust the selector based on Netflix's HTML structure for subtitles
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
  
    if (subtitleElement) {
      subtitleElement.parentNode.insertBefore(translatedSubtitleElement, subtitleElement.nextSibling);
    }
  }
  
  // Function to send the subtitle text to the background script
  function sendSubtitleText(subtitleText) {
    chrome.runtime.sendMessage({ action: 'translate', subtitles: subtitleText }, function (response) {
      if (response.success) {
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
  
      if (subtitleText) {
        sendSubtitleText(subtitleText);
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }  
  
  // Run the script
  observeSubtitleChanges();
  