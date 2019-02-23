$('#save').click(function () {
    chrome.storage.local.get(function (result) {
        result["linkCount"] = parseInt($('#links').val());
        chrome.storage.local.set(result, function () {
            window.close();
        });
    });
})

$(document).ready(function () {
    chrome.storage.local.get(function (result) {
        var keys = Object.keys(result);

        $('#links').val(result["linkCount"]);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== "linkCount") {
                $('#threads').append("<a target=\"blank\" href=\"https://www.reddit.com/r/" + keys[i] + "/top/?t=all\" <p style=\"margin: 2px; display: inline-block\"><bold style=\"font-weight: 600\">" + keys[i] + "</bold>: " + result[keys[i]].length + ",</p></a>");
            };
        }
    });
})