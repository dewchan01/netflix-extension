// background.js

function translate(sourceText, sourceLang, targetLang, sendResponse) {
  var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var translatedText = data[0][0][0];
      sendResponse({ success: true, translatedSubtitles: translatedText });
    })
    .catch(error => {
      console.error(error);
      sendResponse({ success: false });
    });
}

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'translate') {
    const subtitles = message.subtitles;
    const targetLanguage = message.targetLanguage;
    const sourceLanguage = message.sourceLanguage;

    // Use the translate function to perform the translation
    translate(subtitles, sourceLanguage, targetLanguage, sendResponse);

    // Return `true` to keep the message channel open for async response
    return true;
  } else if (message.action === 'changeLanguage') {
    const language = message.language;
    // Change the target language using the translation library of your choice
    // ...
    sendResponse({ success: true });

    // Return `true` to keep the message channel open for async response
    return true;
  }
});
