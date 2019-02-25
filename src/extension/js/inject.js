var interval;
var ths;
var codes = [];
var i = 0;
var pageLocation = "";
var href = "";
var id = "";
var itemSubreddit = "";
var hiddenThread = 0;
var hiddenAds = 0;
var working = false;
var triggered = false;

$(document).ready(function () {
    pageLocation = window.location.href;

    if (pageLocation.indexOf("0imgur") !== -1) //Ignore if inside the thread
    {
        $(".yatay").each(function () {
            $(this).remove();
        });

        $(".dikey").each(function () {
            $(this).remove();
        });

        $(".icerik").each(function () {
            $(this).remove();
        });

        $("iframe").each(function () {
            $(this).remove();
        });

        var video = $("video").get(0);
        toggleControls(video);

    }
    else if (pageLocation.indexOf("/comments/") !== -1) {

        chrome.storage.local.get(function (result) {

            console.log("1");
            if (result["imgurProxy"] !== true)
                return;

            console.log("2");

            $("h2").parent().parent().parent().find("a").each(function () {
                var href = $(this).attr("href");

                if (href.indexOf("imgur") !== -1) {
                    var newHref = href.replace("imgur", "0imgur");
                    window.open(newHref, "_blank");
                }
            });
        });
    }
});

document.onkeyup = function (e) {
    pageLocation = window.location.href;
    triggered = e.ctrlKey && e.shiftKey && e.which === 32;

    if (pageLocation.indexOf("https://www.reddit.com/") === -1) //Only on reddit
        return;

    if (!triggered) //Ignore event if not triggered
        return;

    if (working) //Ignore trigger if working
        return;

    if (pageLocation.indexOf("/comments/") !== -1) //Ignore if inside the thread
        return;

    console.time("Duration");
    working = true;

    $("body").prepend("<div id=\"reddit-no-repeat-loading\">" +
        "<img class=\"reddit-loading\" src=\"https://i.0imgur.com/uR1TrP8.gif\">" +
        "<p>Loading new threads, please wait...</p>" +
        "</div>");

    chrome.storage.local.get(function (result) {
        if (!result["linkCount"])
            result["linkCount"] = 5;

        interval = setInterval(function () {
            $(window).scrollTop(0);

            $(".scrollerItem").each(function () {
                ths = $(this);
                href = $(this).find("h2").parent().attr("href");
                if (!href) {
                    ths.parent().parent().remove();
                    hiddenAds++;
                    return;
                }

                itemSubreddit = getItemSubreddit(href);
                if (!itemSubreddit)
                    return;

                id = getId(href);
                if (!id)
                    return;

                if (href.indexOf("/comments/") === -1)
                    return;

                if (href.indexOf("?instanceId=") !== -1) {
                    ths.parent().parent().remove();
                    hiddenAds++;
                    return;
                }

                if (!result[itemSubreddit])
                    result[itemSubreddit] = [];

                if (result[itemSubreddit].indexOf(id) !== -1) {
                    ths.parent().parent().remove();
                    hiddenThread++;
                    return;
                }

                if (codes.length >= result["linkCount"])
                    return;

                result[itemSubreddit].push(id);
                codes.push({
                    id: id,
                    href: href,
                    itemSubreddit: itemSubreddit
                });
                ths.parent().parent().remove();
            });

            if (codes.length < result["linkCount"])
                window.scrollTo(0, document.body.scrollHeight);
            else {
                clearInterval(interval);

                for (i = 0; i < codes.length; i++) {
                    window.open("https://www.reddit.com" + codes[i].href, "_blank");
                }

                chrome.storage.local.set(result, function () {
                    $("#reddit-no-repeat-loading").remove();
                    codes = [];
                    working = false;
                    document.documentElement.scrollTop = 0;

                    console.timeEnd("Duration");
                    console.log("%c" + hiddenAds + " ads.", "font-weight: 600; color:#1a73e8");
                    console.log("%c" + hiddenThread + " old threads.", "font-weight: 600; color:#1a73e8");

                    hiddenAds = 0;
                    hiddenThread = 0;
                });
            }
        }, 200);
    });
};

function getId(hrf) {
    try {
        return hrf.split("/")[4];
    }
    catch (err) {
        return "";
    }
}

function getItemSubreddit(hrf) {
    try {
        return hrf.split("/")[2];
    }
    catch (err) {
        return "";
    }
}

function toggleControls(video) {
    if (video) {
        if (video.hasAttribute("controls")) {
            video.removeAttribute("controls");
        } else {
            video.setAttribute("controls", "controls");
        }
    }
}