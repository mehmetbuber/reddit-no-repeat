var manif = chrome.runtime.getManifest();

$(document).ready(function () {
    chrome.storage.local.get(function (store) {
        chrome.tabs.getSelected(null, function (tab) {
            var tablink = tab.url;
        });
    });
});