let targetLanguage = 'zh-cn'; // Default target language

function translate(sourceText, sendResponse) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(sourceText)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const translatedText = data[0][0][0];
      sendResponse({ success: true, translatedSubtitles: translatedText });
    })
    .catch(error => {
      console.error(error);
      sendResponse({ success: false });
    });
}

function changeTargetLanguage(language) {
  targetLanguage = language;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'translate') {
    const subtitles = message.subtitles;

    // Use the translate function to perform the translation
    translate(subtitles, sendResponse);

    // Return `true` to keep the message channel open for async response
    return true;
  } else if (message.action === 'changeLanguage') {
    const language = message.language;
    // Change the target language
    changeTargetLanguage(language);
    sendResponse({ success: true });

    // Return `true` to keep the message channel open for async response
    return true;
  }
});
