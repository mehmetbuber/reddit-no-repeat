$('#save').click(function () {
    chrome.storage.local.get(function (result) {
        result["linkCount"] = parseInt($('#links').val());
        chrome.storage.local.set(result, function() {
            window.close();
        });
    });
})

$(document).ready(function() {
    chrome.storage.local.get(function (result) {
        $('#links').val(result["linkCount"]);
    });
})