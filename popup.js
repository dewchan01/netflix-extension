// popup.js

document.addEventListener('DOMContentLoaded', function () {
    const translateButton = document.getElementById('translateButton');
    const subtitlesInput = document.getElementById('subtitles');
    const languageSource = document.getElementById('languageSource');
    const languageSelect = document.getElementById('languageSelect');
    const translationResult = document.getElementById('translationResult');
  
    translateButton.addEventListener('click', function () {
      const subtitles = subtitlesInput.value;
      const targetLanguage = languageSelect.value;
      const sourceLanguage = languageSource.value;
  
      chrome.runtime.sendMessage({ action: 'translate', subtitles: subtitles, sourceLanguage:sourceLanguage, targetLanguage: targetLanguage }, function (response) {
        if (response.success) {
          translationResult.textContent = response.translatedSubtitles;
        } else {
          translationResult.textContent = 'Translation failed.';
        }
      });
    });
  });
  