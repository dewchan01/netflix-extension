// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const translateButton = document.getElementById('translateButton');
  const languageSelect = document.getElementById('languageSelect');
  const translationResult = document.getElementById('translationResult');
  const originalSubsCheckbox = document.getElementById('originalSubs');

  let isEnabled = false;
  let isOriginalSubsVisible = true; // Variable to track the visibility of the original subtitles

  // Retrieve the extension state and original subtitles visibility from storage when the popup is opened
  chrome.storage.sync.get(['isEnabled', 'isOriginalSubsVisible'], function (result) {
    isEnabled = result.isEnabled;
    isOriginalSubsVisible = result.isOriginalSubsVisible;
    updateUI(isEnabled); // Update the UI based on the stored extension state
    originalSubsCheckbox.checked = isOriginalSubsVisible; // Set the checkbox state based on the stored visibility

    // Send message to content script to update the original subtitles visibility based on the stored value
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOriginalSubsVisibility', isOriginalSubsVisible }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  });

  function toggleExtension() {
    isEnabled = !isEnabled; // Toggle the isEnabled variable

    if (isEnabled) {
      translationResult.textContent = 'Extension enabled';
      translateButton.textContent = 'Disable';
       // Toggle the checkbox
       originalSubsCheckbox.checked = isEnabled;
      enableExtension();
    } else {
      translationResult.textContent = 'Extension disabled';
      translateButton.textContent = 'Enable';
      disableExtension();
    }
  }

  function toggleOriginalSubsVisibility() {
    isOriginalSubsVisible = originalSubsCheckbox.checked; // Update the isOriginalSubsVisible variable
    // console.log(isOriginalSubsVisible)
    // Send message to content script to toggle the visibility of the original subtitles
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOriginalSubsVisibility', isOriginalSubsVisible }, function (response) {
        if(isOriginalSubsVisible){
          chrome.tabs.insertCSS(tabs[0].id,{ code: '.hideSub { display: block!important; }'});
        }else{
          chrome.tabs.insertCSS(tabs[0].id,{ code: '.hideSub { display: none!important; }'});
        }
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });

    // Save the updated isOriginalSubsVisible value to storage
    chrome.storage.sync.set({ isOriginalSubsVisible }, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  function enableExtension() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.insertCSS(tabs[0].id,{ code: '.hideSub { display: block; }'});
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleExtension', isEnabled: true }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });

    chrome.storage.sync.set({ isEnabled: true }, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });

    chrome.runtime.sendMessage({ action: 'enableExtension' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  function disableExtension() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleExtension', isEnabled: false }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });

    chrome.storage.sync.set({ isEnabled: false }, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });

    chrome.runtime.sendMessage({ action: 'disableExtension' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  function updateUI(isEnabled) {
    if (isEnabled) {
      translationResult.textContent = 'Extension enabled';
      translateButton.textContent = 'Disable';
      originalSubsCheckbox.checked = isEnabled;
    } else {
      translationResult.textContent = 'Extension disabled';
      translateButton.textContent = 'Enable';
    }
  }

  translateButton.addEventListener('click', toggleExtension);
  originalSubsCheckbox.addEventListener('change', toggleOriginalSubsVisibility);

  languageSelect.addEventListener('change', function () {
    const language = languageSelect.value;

    chrome.runtime.sendMessage({ action: 'changeLanguage', language }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  });
});
