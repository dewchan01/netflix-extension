// contentScript.js

// Function to retrieve the current subtitle text
function getSubtitleText() {
    const subtitleElement = document.querySelector('.textBasedSub'); // Adjust the selector based on Netflix's HTML structure for subtitles
  
    if (subtitleElement) {
      return subtitleElement.textContent.trim();
    }
  
    return '';
  }
  
  // Send the subtitle text to the background script
  function sendSubtitleText(subtitleText) {
    chrome.runtime.sendMessage({ action: 'subtitleCaptured', subtitleText });
  }
  
  // Listen for changes in the subtitle element
  function observeSubtitleChanges() {
    const observer = new MutationObserver(function () {
      const subtitleText = getSubtitleText();
      sendSubtitleText(subtitleText);
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }

  