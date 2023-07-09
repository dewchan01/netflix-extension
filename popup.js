document.addEventListener('DOMContentLoaded', function () {
  const translateButton = document.getElementById('translateButton');
  const languageSelect = document.getElementById('languageSelect');
  const translationResult = document.getElementById('translationResult');

  let isEnabled = false;

  function toggleExtension() {
    isEnabled = !isEnabled;

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
  }

  function disableExtension() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleExtension', isEnabled: false }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  }

  translateButton.addEventListener('click', toggleExtension);

  languageSelect.addEventListener('change', function () {
    const language = languageSelect.value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeLanguage', language }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  });
});
