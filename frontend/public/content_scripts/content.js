(function() {
    console.log("Content script injected!");

    function extractPageContent() {
        const paragraphs = document.querySelectorAll('p');
        let pageText = '';
        paragraphs.forEach(p => {
            pageText += p.innerText + ' ';
        });

        return pageText;
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "getPageContent") {
            let extractedText = extractPageContent();
            console.log("Extracted Text:", extractedText);
            sendResponse({ pageText: extractedText });
            return true;
        }
    });
})();