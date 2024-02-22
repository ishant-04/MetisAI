document.getElementById('startButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'start'});
});

document.getElementById('uploadButton').addEventListener('click', function() {
    const question = document.getElementById('textInput').value;
    console.log(question);
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'question': question
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = data.message.text;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});