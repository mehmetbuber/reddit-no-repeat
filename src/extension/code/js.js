var interval;
var intervalState = false;
var hrefs = [];
var codes = [];
var visitedThreads = [];
var linkCount = 5;

document.onkeyup = function (e) {
    var location = window.location.href;
    if (location.indexOf("https://www.reddit.com/") !== -1 && location.indexOf("/comments/") === -1) {
        if (e.ctrlKey && e.shiftKey && e.which === 32) {
            getUrls(function (data) {
                visitedThreads = data.visitedThreads;

                if (!visitedThreads)
                    visitedThreads = [];

                interval = setInterval(function () {
                    if (!intervalState) {
                        $(window).scrollTop(0);
                        $(".scrollerItem").each(function () {
                            var ths = $(this);
                            $(this).find("a").each(function () {
                                var href = $(this).attr("href");
                                if (href.indexOf("https://www.reddit.com/") === -1) {
                                    if (href.indexOf("?instanceId=") === -1) {
                                        if (href.indexOf("/comments/") !== -1) {
                                            var id = getId(href);
                                            if (visitedThreads.indexOf(id) === -1) {
                                                if (hrefs.indexOf(href) === -1) {
                                                    if (hrefs.length < linkCount) {
                                                        codes.push(id);
                                                        hrefs.push(href);
                                                        ths.remove();
                                                    }
                                                } else {
                                                    ths.remove();
                                                }
                                            } else {
                                                ths.remove();
                                            }
                                        }
                                    } else {
                                        ths.remove();
                                    }
                                }
                            });
                        });
                        
                        if (hrefs.length > linkCount - 1)
                            finalize();
                        else {
                            intervalState = true;
                        }

                    } else {
                        $(window).scrollTop(120000);
                        intervalState = false;
                    }
                }, 100);

            });
        }
    }
};

function getId(hrf)
{
    var path = hrf.split("/");
    var id = path[4];
    return id;
}

function getUrls(callback) {
    chrome.storage.local.get(["visitedThreads"], function (result) {
        callback(result);
    });
}

function finalize() {
    clearInterval(interval);
    for (var i = 0; i < hrefs.length; i++) {
        window.open("https://www.reddit.com" +hrefs[i], "_blank");
    }

    visitedThreads = visitedThreads.concat(codes);
    hrefs = [];
    codes = [];

    chrome.storage.local.set({ visitedThreads: visitedThreads }, function () {
        console.log(visitedThreads.length);
        visitedThreads = [];
    });
}