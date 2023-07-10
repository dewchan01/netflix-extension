document.addEventListener('DOMContentLoaded', function () {
  const translateButton = document.getElementById('translateButton');
  const languageSelect = document.getElementById('languageSelect');
  const translationResult = document.getElementById('translationResult');

  let isEnabled = false;

  // Retrieve the extension state from storage when the popup is opened
  chrome.storage.sync.get('isEnabled', function (result) {
    isEnabled = result.isEnabled;
    updateUI(isEnabled); // Update the UI based on the stored extension state
  });

  function toggleExtension() {
    isEnabled = !isEnabled; // Toggle the isEnabled variable

    if (isEnabled) {
      translationResult.textContent = 'Extension enabled';
      translateButton.textContent = 'Disable';
      enableExtension();
    } else {
      translationResult.textContent = 'Extension disabled';
      translateButton.textContent = 'Enable';
      disableExtension();
    }
  }

  function enableExtension() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
    } else {
      translationResult.textContent = 'Extension disabled';
      translateButton.textContent = 'Enable';
    }
  }

  translateButton.addEventListener('click', toggleExtension);

  languageSelect.addEventListener('change', function () {
    const language = languageSelect.value;

    chrome.runtime.sendMessage({ action: 'changeLanguage', language }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  });
});
