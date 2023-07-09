document.addEventListener('DOMContentLoaded', function () {
  const translateButton = document.getElementById('translateButton');
  const languageSelect = document.getElementById('languageSelect');
  const translationResult = document.getElementById('translationResult');

  let isEnabled = false;

  // Function to toggle the extension state
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

  // Function to enable the extension
  function enableExtension() {
    chrome.runtime.sendMessage({ action: 'enableExtension' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  // Function to disable the extension
  function disableExtension() {
    chrome.runtime.sendMessage({ action: 'disableExtension' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
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

// chrome.runtime.sendMessage({ action: 'getExtensionState' }, function (response) {
//   if (chrome.runtime.lastError) {
//     console.error(chrome.runtime.lastError);
//   } else {
//     isEnabled = response.enabled;

//     if (isEnabled) {
//       translationResult.textContent = 'Extension enabled';
//       translateButton.textContent = 'Disable';
//     } else {
//       translationResult.textContent = 'Extension disabled';
//       translateButton.textContent = 'Enable';
//     }
//   }
// });