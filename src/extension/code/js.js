var interval;
var intervalState = false;
var hrefs = [];
var codes = [];
var visitedThreads = [];
var linkCount = 5;
var subReddit = "";
var keys = [];
var i = 0;
var pageLocation = "";
var ths;
var href = "";
var id = "";
var working = false;

document.onkeyup = function (e) {
    if (!working) {
        chrome.storage.local.get(function (val) {
            console.log(val);
        });

        pageLocation = window.location.href;
        subReddit = pageLocation.replace("https://www.reddit.com", "").replace("/r/", "").split("?")[0].split("/")[0];

        if (!subReddit)
            subReddit = "reddit";

        if (subReddit.length === 0)
            subReddit = "reddit";

        if (e.ctrlKey && e.shiftKey && e.which === 32) {
            working = true;
            $("body").prepend("<div id=\"reddit-no-repeat-loading\">" +
                "<img class=\"reddit-loading\" src=\"http://mehmetbuber.com/loading.gif\">" +
                "<p>Loading new threads, please wait...</p>" +
                "</div>");

            if (pageLocation.indexOf("/comments/") === -1) {
                getUrls(function (data) {
                    visitedThreads = data[subReddit];

                    if (subReddit === "reddit") {
                        keys = Object.keys(data);
                        for (i = 0; i < keys.length; i++) {
                            if (keys[i] !== "linkCount") {
                                if (Array.isArray(data[keys[i]])) {
                                    visitedThreads = visitedThreads.concat(data[keys[i]]);
                                }
                            }
                        }
                    }

                    if (!visitedThreads)
                        visitedThreads = [];

                    interval = setInterval(function () {
                        $(window).scrollTop(0);
                        $(".scrollerItem").each(function () {
                            ths = $(this);
                            $(this).find("a").each(function () {
                                href = $(this).attr("href");
                                if (href.indexOf("https://www.reddit.com/") === -1) {
                                    if (href.indexOf("?instanceId=") === -1) {
                                        if (href.indexOf("/comments/") !== -1) {
                                            id = getId(href);
                                            if (visitedThreads.indexOf(id) === -1) {
                                                if (hrefs.indexOf(href) === -1) {
                                                    if (hrefs.length < linkCount) {
                                                        codes.push(id);
                                                        hrefs.push(href);
                                                        ths.parent().parent().remove();
                                                    }
                                                } else {
                                                    ths.parent().parent().remove();
                                                }
                                            } else {
                                                ths.parent().parent().remove();
                                            }
                                        }
                                    } else {
                                        ths.parent().parent().remove();
                                    }
                                }
                            });
                        });

                        if (hrefs.length > linkCount - 1)
                            finalize();
                        else {
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                    }, 200);
                });
            }
        }
    }
};

function getId(hrf) {
    try {
        return hrf.split("/")[4];
    }
    catch (err) {
        return "";
    }
}

function getUrls(callback) {
    chrome.storage.local.get([subReddit], function (result) {
        callback(result);
    });
}

function finalize() {
    document.documentElement.scrollTop = 0;
    clearInterval(interval);
    for (i = 0; i < hrefs.length; i++) {
        window.open("https://www.reddit.com" + hrefs[i], "_blank");
    }

    visitedThreads = visitedThreads.concat(codes);

    chrome.storage.local.get(subReddit, function (val) {
        if (typeof val[subReddit] === 'undefined')
            val[subReddit] = [];

        val[subReddit] = val[subReddit].concat(codes);

        chrome.storage.local.set(val);
        
        visitedThreads = [];
        hrefs = [];
        codes = [];

        $("#reddit-no-repeat-loading").remove();
        working = false;
    });
}