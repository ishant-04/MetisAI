console.log(document.body.innerText);

// content.js

function getInnerText() {
    return document.body.innerText;
  }
  
  chrome.runtime.sendMessage({innerText: getInnerText()});
  