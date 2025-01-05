

document.getElementById('root').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "checkPage" });
});

