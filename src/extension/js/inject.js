document.onclick = function (event) {
    if (!event.ctrlKey || !event.shiftKey)
        return;



    var note = prompt("Please enter your note", "");

    if (note !== null && note !== "") {
        var item = {
            id: generateId(),
            x: event.pageX / window.innerWidth,
            y: event.pageY / window.innerHeight,
            query: window.location.search,
            comments: [],
            note : note,
            status: "pending"
        };
        chrome.storage.local.get(function (data) {
            var host = window.location.host.replace(/[^\w\s]/gi, '');
            var path = window.location.pathname.replace(/[^\w\s]/gi, '');

            if (!data.urls)
                data.urls = [];

            if (!data["pages"])
                data["pages"] = {};

            if (!data["pages"][host])
                data["pages"][host] = {};

            if (!data["pages"][host][path])
                data["pages"][host][path] = [];

            data["pages"][host][path].push(item);

            console.log(data);
            $('body').append(buildHtml(item, host, path));

            setupDraggable();
            chrome.storage.local.set(data);
        });
    }
};

$(document).ready(function () {
    chrome.storage.local.get(function (data) {
        var host = window.location.host.replace(/[^\w\s]/gi, '');
        var path = window.location.pathname.replace(/[^\w\s]/gi, '');

        if (!data.urls)
            data.urls = [];

        if (!data["pages"])
            data["pages"] = {};

        if (!data["pages"][host])
            data["pages"][host] = {};

        if (!data["pages"][host][path])
            data["pages"][host][path] = [];

        $('body').prepend('<div id="path-notes" style="position: relative"></div>');
        for (var i = 0; i < data["pages"][host][path].length; i++) {
            $('#path-notes').append(buildHtml(data["pages"][host][path][i], host, path));
        }

        setupDraggable();
    });
});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function buildHtml(item, host, path) {
    console.log(item);
    var html = template;
    html = html.replace("{{id}}", item.id);
    html = html.replace("{{host}}", host);
    html = html.replace("{{path}}", path);
    html = html.replace("{{top}}", (item.y * window.innerHeight) + 'px');
    html = html.replace("{{left}}", (item.x * window.innerWidth) + 'px');
    html = html.replace("{{status}}", item.status);
    html = html.replace("{{note}}", item.note);
    html = html.replace("{{comments}}", buildComments(item.comments));
    return html;
}

function buildComments(comments) {
    if (!comments)
        return "";

    if (comments.length < 0)
        return "";

    var commentsHtml = "";

    for (var i = 0; i < comments.length; i++) {
        var commentHtml = commentTemplate;
        var time = "";
        if (comments[i].time)
            time = comments[i].time.toString();
        console.log(comments[i]);

        commentHtml = commentHtml.replace("{{sentReceived}}", comments[i].sentReceived);
        commentHtml = commentHtml.replace("{{comment}}", comments[i].comment);
        commentHtml = commentHtml.replace("{{sender}}", comments[i].sender);
        commentHtml = commentHtml.replace("{{time}}", time);
        commentsHtml += commentHtml;
    }

    return commentsHtml;
}

const template = '<div class="path-note-chat" data-id="{{id}}" data-host="{{host}}" data-path="{{path}}" style="top:{{top}}; left:{{left}}"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> <div class="path-note-chat-container"> <div class="path-note-user-bar"> <div class="path-note-name"> <span>{{note}}</span> <span class="path-note-note-status">{{status}}</span> </div><div class="path-note-actions"> <i class="fa fa-eye-slash showButton"></i> <i class="fa fa-close closeButton"></i> </div></div><div class="path-note-conversation" style="display: none"> <div class="path-note-conversation-container">{{comments}}</div><form class="path-note-conversation-compose comment-form"> <input class="path-note-input-msg comment-text" name="input" placeholder="Type a message" autocomplete="off" autofocus/> <div class="path-note-send send-comment"> <div class="path-note-circle"> <i class="zmdi zmdi-mail-send"></i> </div></div></form> </div></div></div>';
const commentTemplate = '<div class="path-note-message path-note-{{sentReceived}}"> {{comment}} <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="path-note-metadata"> {{sender}}<br/> <span class="path-note-time">{{time}}</span> </span> </div>';
function setupDraggable() {
    $(".path-note-chat").each(function () {
        var ths = $(this);
        ths.resizable();
        ths.draggable({
            snap: true,
            scroll: false,
            handle: ".path-note-user-bar",
            stop: function (e) {
                chrome.storage.local.get(function (data) {
                    var id = ths.attr("data-id");
                    var host = ths.attr("data-host");
                    var path = ths.attr("data-path");

                    if (!data.urls)
                        data.urls = [];

                    if (!data["pages"])
                        data["pages"] = {};

                    if (!data["pages"][host])
                        data["pages"][host] = {};

                    if (!data["pages"][host][path])
                        data["pages"][host][path] = [];

                    var newX = parseInt(ths.css('left').replace("px", "")) / window.innerWidth;
                    var newY = parseInt(ths.css('top').replace("px", "")) / window.innerHeight;

                    data["pages"][host][path].forEach(function (obj) {
                        if (obj.id === id) {
                            obj.x = newX;
                            obj.y = newY;
                        }
                    });
                    chrome.storage.local.set(data);
                });
            }
        });

    });

}

$(document).on('submit', 'body .comment-form', function (e) {
    e.preventDefault();
    var ths = $(this);
    chrome.storage.local.get(function (data) {
        var host = ths.closest(".path-note-chat").attr("data-host");
        var path = ths.closest(".path-note-chat").attr("data-path");

        if (!data.urls)
            data.urls = [];

        if (!data["pages"])
            data["pages"] = {};

        if (!data["pages"][host])
            data["pages"][host] = {};

        if (!data["pages"][host][path])
            data["pages"][host][path] = [];

        var comment = ths.closest(".path-note-chat").find('.comment-text').val();
        ths.closest(".path-note-chat").find('.comment-text').val("");
        var id = ths.closest(".path-note-chat").attr("data-id");
        console.log(comment);
        console.log(id);

        data["pages"][host][path].forEach(function (obj) {
            if (obj.id === id) {
                if (!obj.comments)
                    obj.comments = [];

                var date = new Date();
                var commentItem = {
                    sentReceived: "sent",
                    comment: comment,
                    sender: "Mehmet Buber",
                    time: date.timeNow() + " " + date.today()
                };
                console.log(commentItem);

                obj.comments.push(commentItem);
            }
        });
        chrome.storage.local.set(data);
    });
});

$(document).on('click', 'body .hideButton', function () {
    $(this).closest('.path-note-chat').find('.path-note-conversation').hide();
    $(this).removeClass("hideButton");
    $(this).addClass("showButton");
    $(this).removeClass("fa-eye");
    $(this).addClass("fa-eye-slash");
});

$(document).on('click', 'body .showButton', function () {
    $(this).closest('.path-note-chat').find('.path-note-conversation').show();
    $(this).removeClass("showButton");
    $(this).addClass("hideButton");
    $(this).addClass("fa-eye");
    $(this).removeClass("fa-eye-slash");
});

$(document).on('click', 'body .send-comment', function () {
    $(this).closest('.path-note-chat').find('form').submit();
});

function generateId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}