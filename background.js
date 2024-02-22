let textFiles = [];

// Listen for a message from the content script or popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        // Inject the content script into each tab
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames: true},
                    files: ['contentscript.js']
                });
            });
        });
    } else if (request.text) {
        // Create a blob object from the text
        const blob = new Blob([request.text], { type: 'text/plain' });

        // Create a file object from the blob
        const file = new File([blob], `${sender.tab.id}.txt`, {
            type: 'text/plain'
        });

        // Add the file to the array
        textFiles.push(file);
    }
});


// Function to upload files
function uploadFiles() {
    // Create a new FormData object
    const formData = new FormData();

    // Add the text files to the FormData object
    textFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    // Send the text files as the body of a POST request
    fetch('http://localhost:3000/upload/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to upload files');
        }
        return response.text();
    })
    .then(data => {
        console.log('Files uploaded successfully:', data);
    })
    .catch(error => {
        console.error('Error uploading files:', error);
    });
}

// Call uploadFiles function when you want to upload the files
uploadFiles();