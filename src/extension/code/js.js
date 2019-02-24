var interval;
var codes = [];
var i = 0;
var pageLocation = "";
var ths;
var href = "";
var id = "";
var itemSubReddit = "";
var working = false;

document.onkeyup = function (e) {
    pageLocation = window.location.href;
    if (!working) {
        if (e.ctrlKey && e.shiftKey && e.which === 32) {
            working = true;

            $("body").prepend("<div id=\"reddit-no-repeat-loading\">" +
                "<img class=\"reddit-loading\" src=\"http://mehmetbuber.com/loading.gif\">" +
                "<p>Loading new threads, please wait...</p>" +
                "</div>");
            
            if (pageLocation.indexOf("/comments/") === -1) {
                chrome.storage.local.get(function (result) {
                    if (!result["linkCount"])
                        result["linkCount"] = 5;

                    interval = setInterval(function () {
                        $(window).scrollTop(0);

                        $(".scrollerItem").each(function () {
                            ths = $(this);
                            $(this).find("a").each(function () {
                                href = $(this).attr("href");
                                id = getId(href);
                                itemSubReddit = getItemSubReddit(href);
                                if (itemSubReddit) {
                                    if (href.indexOf("https://www.reddit.com/") === -1) {
                                        if (href.indexOf("?instanceId=") === -1) {
                                            if (href.indexOf("/comments/") !== -1) {
                                                var hrefs = codes.map(a => a.href);

                                                if (!result[itemSubReddit])
                                                    result[itemSubReddit] = [];

                                                if (result[itemSubReddit].indexOf(id) === -1) {
                                                    if (hrefs.indexOf(href) === -1 ) {
                                                        if (codes.length < result["linkCount"]) {
                                                            result[itemSubReddit].push(id);
                                                            codes.push({
                                                                id: id,
                                                                href: href,
                                                                itemSubReddit: itemSubReddit
                                                            });
                                                            ths.parent().parent().remove();
                                                        } else {
                                                            //ignore
                                                        }
                                                    } else {
                                                        ths.parent().parent().remove();
                                                    }
                                                } else {
                                                    ths.parent().parent().remove();
                                                }
                                            } else {
                                                //ignore
                                            }
                                        } else {
                                            ths.parent().parent().remove();
                                        }
                                    } else {
                                        //ignore
                                    }
                                } else {
                                    //ignore
                                }
                            });
                        });

                        if (codes.length > result["linkCount"] - 1)
                            finalize(result);
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

function getItemSubReddit(hrf) {
    try {
        return hrf.split("/")[2];
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

function finalize(val) {
    document.documentElement.scrollTop = 0;
    clearInterval(interval);

    for (i = 0; i < codes.length; i++) {
        window.open("https://www.reddit.com" + codes[i].href, "_blank");
    }

    chrome.storage.local.set(val);
    codes = [];
    $("#reddit-no-repeat-loading").remove();
    working = false;
}