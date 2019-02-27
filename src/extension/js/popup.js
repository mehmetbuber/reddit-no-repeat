$("#save").click(function () {
    chrome.storage.local.get(function (result) {
        result["linkCount"] = parseInt($("#links").val());
        result["imgurProxy"] = $('#imgur').is(":checked");
        console.log($('#imgur').is(":checked"));
        chrome.storage.local.set(result, function () {
            window.close();
        });
    });
});


$("#subredditSearch").bind("keyup change", function () {
    var query = $("#subredditSearch").val().toLowerCase();
    $(".subreddit").each(function () {
        var subreddit = $(this).attr("data-subreddit").toLowerCase();
        if (query.length > 0) {
            if (subreddit.includes(query)) {
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
        $("#imgur").prop('checked', result["imgurProxy"] === true);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== "linkCount" && keys[i] !== "imgurProxy") {
                $("#threads").append('<div data-subreddit="' + keys[i] + '" class="subreddit">' +
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
    var subreddit = $(this).parent().attr("data-subreddit");
    if (confirm("Are you sure?")) {
        chrome.storage.local.remove(subreddit, function () {
            ths.parent().remove();
        });
    }
});