// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const translateButton = document.getElementById('translateButton');
  const languageSelect = document.getElementById('languageSelect');
  const translationResult = document.getElementById('translationResult');

  translateButton.addEventListener('click', function () {
    const targetLanguage = languageSelect.value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, { action: 'translate', targetLanguage }, function (response) {
        if (response.success) {
          translationResult.textContent = response.translatedSubtitles;
        } else {
          translationResult.textContent = 'Translation failed.';
        }
      });
    });
  });

  languageSelect.addEventListener('change', function () {
    const language = languageSelect.value;

    chrome.runtime.sendMessage({ action: 'changeLanguage', language }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  });
});
