let textFiles = [];

// Listen for a message from the content script or popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        // Inject the content script into each tab
        console.log('start');
        chrome.tabs.query({currentWindow:true}, tabs => {
            let promises = tabs.map(tab => {
                console.log('tab', tab);
                return chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames: true},
                    files: ['contentscript.js']
                }).then(() => {
                    console.log('script executed');
                    
                    // Create a blob object from the text
                    const blob = new Blob([request.text], { type: 'text/plain' });
                    
                    // Create a file object from the blob
                    const file = new File([blob], `${tab.id}.txt`, {
                        type: 'text/plain'
                    });
                    console.log("file created");

                    // Add the file to the array
                    textFiles.push(file);
                    console.log("text files pushed");
                });
            });

            Promise.all(promises).then(uploadFiles);
        });
    }
});

// Function to upload files
function uploadFiles() {
    // Create a new FormData object
    const formData = new FormData();

    // Add the text files to the FormData object
    textFiles.forEach((file, index) => {
        formData.append('files', file);
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