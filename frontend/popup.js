

document.getElementById('checkPage').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "checkPage" });
});

