document.getElementById('startButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'start'});
});