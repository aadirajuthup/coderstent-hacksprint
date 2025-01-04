

(function() {
    console.log("Content script injected!");

    function extractPageContent() {
        // Basic example: Extract all text from <p> tags
        const paragraphs = document.querySelectorAll('p');
        let pageText = '';
        paragraphs.forEach(p => {
            pageText += p.innerText + ' ';
        });

        return pageText;
    }

    let extractedText = extractPageContent(); // Use let instead of const
    console.log("Extracted Text:", extractedText);
})();

