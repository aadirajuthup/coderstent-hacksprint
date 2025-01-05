chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "checkPage") {
        // Get settings from local storage
        chrome.storage.local.get(['apiKey', 'baseUrl', 'modelName'], function (data) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content_scripts/content.js']
                }, () => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, response => {
                        if (response && response.pageText) {
                            // Send extracted text and settings to backend
                            fetch('http://localhost:3001/analyze', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    text: response.pageText,
                                    apiKey: data.apiKey,
                                    baseUrl: data.baseUrl,
                                    modelName: data.modelName
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log("Analysis from backend:", data);
                                    chrome.runtime.sendMessage({ action: "displayResults", results: data });
                                })
                                .catch(error => {
                                    console.error("Error:", error);
                                });
                        }
                    });
                });
            });
        });
    }
});