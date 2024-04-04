# MetisAI

MetisAI is an AI-based conversation tool designed to provide contextual responses using a user's open browser tabs. It leverages the power of AI to understand the context of your browsing and provide relevant responses to your queries.

This tool is deployed as a Chrome extension, making it easily accessible right from your browser. It acts as a chatbot, allowing you to interact with it in a conversational manner. Whether you're researching, studying, or just browsing the web, MetisAI can enhance your browsing experience by providing intelligent and context-aware assistance.

## Features

- Contextual responses based on open browser tabs
- Easy interaction through a chatbot interface
- Convenient deployment as a Chrome extension

# HOW TO SET UP

1. clone/save the the files in your system 

2. Installing the extension 
- Open Google Chrome and go to `chrome://extensions` page by typing this link directly into the address bar (chrome://extensions).
- Click on "Load Unpacked" (top-right-corner) and load the ExtensionFrontend folder  from cloned repository.
- You will see a popup asking for permission, click on "Allow".

3. Setting up  backend
step 1 : open MetisBackend folder
step 2 : insert your chatgpt api key into the .env file.
step 3 : open terminal inside MetisBackend folder
step 3 : TERMINAL: npm install 
step 4 : TERMINAL: node index.js

 
# HOW TO TEST

1. Once the extension is installed and the backend is set up, click on the MetisAI icon in the Chrome extension toolbar.

2. You should see a chat interface pop up. Start by typing a simple greeting like "Hello" to test if the chatbot is responding.

3. Open a few browser tabs with different content. Try asking the chatbot questions related to the content of these tabs to see if it provides contextual responses.

4. Test the chatbot with different types of queries and scenarios to ensure it's working as expected.

5. Check the console in the backend terminal for any errors or issues.

