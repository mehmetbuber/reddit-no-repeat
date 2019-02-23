var interval;
var intervalState = false;
var hrefs = [];
var visitedThreads = [];

document.onkeyup = function (e) {
    var location = window.location.href;
    if (location.indexOf("https://www.reddit.com/") !== -1 && location.indexOf("/comments/") === -1) {
        if (e.ctrlKey && e.shiftKey && e.which === 32) {
            getUrls(function (data) {
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
                                            href = "https://www.reddit.com" + href;
                                            if (data.visitedThreads.indexOf(href) === -1) {
                                                if (hrefs.indexOf(href) === -1) {
                                                    if (hrefs.length < 5) {
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

                        console.log(hrefs);

                        if (hrefs.length === 5)
                            finalize();
                        else {
                            intervalState = true;
                        }

                    } else {
                        $(window).scrollTop(1200);
                        intervalState = false;
                    }
                }, 100);

            });
        }
    }
};

function getUrls(callback) {
    chrome.storage.local.get(["visitedThreads"], function (result) {
        callback(result);
    });
}

function finalize() {
    clearInterval(interval);
    for (var i = 0; i < hrefs.length; i++) {
        window.open(hrefs[i], "_blank");
    }

    visitedThreads = visitedThreads.concat(hrefs);
    hrefs = [];

    chrome.storage.local.set({ visitedThreads: visitedThreads }, function (result) {
        console.log(result);
    });
}