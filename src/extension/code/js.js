var hidden = 0;
var interval;
var clearCount = 0;
var intervalState = false;

document.onkeyup = function (e) {
    var location = window.location.href;
    if (location.indexOf("https://www.reddit.com/") !== -1 && location.indexOf("/comments/") === -1) {
        if (e.ctrlKey && e.shiftKey && e.which === 32) {
            clearCount = 0;
            getUrls(function (data) {
                var hrefs = [];

                if (!data.visitedThreads) {
                    data.visitedThreads = [];
                }

                $(".scrollerItem").each(function () {
                    $(this).find("a").each(function () {
                        var href = $(this).attr("href");

                        if (href.indexOf("https://www.reddit.com/") === -1) {
                            if (href.indexOf("?instanceId=") === -1) {
                                if (href.indexOf("/comments/") !== -1) {
                                    href = "https://www.reddit.com" + href;
                                    if (data.visitedThreads.indexOf(href) === -1 && hrefs.indexOf(href) === -1) {
                                        if (hrefs.length < 5) {
                                            hrefs.push(href);
                                        }
                                    }
                                }
                            } 
                        }
                    });
                });

                for (var i = 0; i < hrefs.length; i++) {
                    window.open(hrefs[i], "_blank");
                }

                addUrls(hrefs, function() {
                    interval = setInterval(function () {
                        if (!intervalState) {
                            $(window).scrollTop(0);

                            if (hidden === 0) {
                                clearCount++;
                            } else {
                                clearCount = 0;
                            }

                            if (clearCount > 0) {
                                intervalState = true;
                            }

                            if (clearCount > 30 || hrefs.length === 5) {
                                clearInterval(interval);
                            }

                            hidden = 0;

                            getUrls(function (result) {
                                $(".scrollerItem").each(function () {
                                    var ths = $(this);
                                    $(this).find("a").each(function () {
                                        var href = $(this).attr("href");
                                        if (href.indexOf("?instanceId=") !== -1) {
                                            ths.remove();
                                            hidden++;
                                        }

                                        if (result.visitedThreads.indexOf(href) !== -1) {
                                            ths.remove();
                                            hidden++;
                                        }
                                    });
                                });
                            });
                        } else {
                            $(window).scrollTop(clearCount * 300);
                            intervalState = false;
                        }
                    }, 100);
                });
            });
        }
    }
};

function addUrls(urls, callback) {
    getUrls(function (data) {
        if (!data.visitedThreads)
            data.visitedThreads = [];

        data.visitedThreads = data.visitedThreads.concat(urls);

        chrome.storage.local.set({ visitedThreads: data.visitedThreads }, function (result) {
            callback(result);
        });
    });
}

function getUrls(callback) {
    chrome.storage.local.get(["visitedThreads"], function (result) {
        callback(result);
    });
}