$("#save").click(function () {
    chrome.storage.local.get(function (result) {
        result["linkCount"] = parseInt($("#links").val());
        chrome.storage.local.set(result, function () {
            window.close();
        });
    });
});


$("#subRedditSearch").bind("keyup change", function () {
    var query = $("#subRedditSearch").val().toLowerCase();
    $(".subReddit").each(function () {
        var subReddit = $(this).attr("data-subReddit").toLowerCase();
        if (query.length > 0) {
            if (subReddit.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        } else {
            $(this).show();
        }
    });
});

$(document).ready(function () {
    chrome.storage.local.get(function (result) {
        var keys = Object.keys(result);

        $("#links").val(result["linkCount"]);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== "linkCount") {
                $("#threads").append('<div data-subReddit="' + keys[i] + '" class="subReddit">' +
                    '<i class="fa fa-trash remove-button"></i>' +
                    '<a class="reddit-link" target="blank" href="https://www.reddit.com/r/' + keys[i] + '/top/?t=all">' +
                    '<span class="key-label">' + keys[i] + "</span>: " + result[keys[i]].length  +
                    "</a>" +
                    "</div>");
            }
        }
    });
});

$(document).on("click", "body .remove-button", function () {
    var ths = $(this);
    var subReddit = $(this).parent().attr("data-subReddit");
    if (confirm("Are you sure?")) {
        chrome.storage.local.remove(subReddit, function () {
            ths.parent().remove();
        });
    }
});