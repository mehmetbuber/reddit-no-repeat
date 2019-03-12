document.onclick = function (event) {
    console.log(event);
    if (!event.ctrlKey || !event.shiftKey)
        return;

    var target = 'target' in event ? event.target : event.srcElement;

    var txy = getPageXY(target);

    var item = {
        id: generateId(),
        x: txy[0] / window.innerWidth,
        y: txy[1] / window.innerHeight,
        query: window.location.search
    };

    console.log(item);

    var note = prompt("Please enter your note", "");
    item.note = note;

    if (note !== null && note !== "") {
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
            $('body').append(' <div class="chat"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <div class="chat-container"> <div class="user-bar"> <div class="back"> <i class="zmdi zmdi-arrow-left"></i> </div><div class="checkbox"> <label style="font-size: 1em"> <input type="checkbox" value=""> <span class="cr"><i class="cr-icon fa fa-check"></i></span> </label> </div><div class="name"> <span>' + note + '</span> <span class="note-status">pending</span> </div><div class="actions"> <i class="fa fa-eye-slash showButton"></i> <i class="fa fa-close closeButton"></i> </div></div><div class="conversation" style="display: none"> <div class="conversation-container"> <div class="message sent"> What happened last night? <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata"> Mehmet Buber<br/> <span class="time">17/02/2018 22:03</span> </span> </div><div class="message received"> You were drunk. <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata-received"> Mehmet Buber<br/> <span class="time">17/02/2018 22:03</span> </span> </div><div class="message sent"> No I wasnt. <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata"> Mehmet Buber<br/> <span class="time">17/02/2018 22:03</span> </span> </div><div class="message received"> <span id="random">You were hugging an old man with a beard screaming "DUMBLEDORE YOURE ALIVE!"</span> <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata-received"> Mehmet Buber<br/> <span class="time">17/02/2018 22:03</span> </span> </div></div><form class="conversation-compose"> <input class="input-msg" name="input" placeholder="Type a message" autocomplete="off" autofocus></input> <div class="send"> <div class="circle"> <i class="zmdi zmdi-mail-send"></i> </div></div></form> </div></div></div>');

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

        var notes = $('body').prepend('<div id="path-notes" style="position: relative"></div>');
        for (var i = 0; i < data["pages"][host][path].length; i++) {
            $('#path-notes').append('' +
                '<div class="chat" data-id="' + data["pages"][host][path][i].id + '" data-host="' + host + '" data-path="' + path + '" style="left: ' + (data["pages"][host][path][i].x * window.innerWidth) + 'px; top: ' + (data["pages"][host][path][i].y * window.innerHeight) + 'px; position: absolute">' +
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' +
                ' <div class="chat-container"> ' +
                '<div class="user-bar"> ' +
                '<div class="back"> ' +
                '<i class="zmdi zmdi-arrow-left"></i> ' +
                '</div>' +
                '<div class="checkbox"> ' +
                '<label style="font-size: 1em"> ' +
                '<input type="checkbox" value="">' +
                ' <span class="cr">' +
                '<i class="cr-icon fa fa-check"></i>' +
                '</span> ' +
                '</label> ' +
                '</div>' +
                '<div class="name"> ' +
                '<span>' + data["pages"][host][path][i].note + '</span> ' +
                '<span class="note-status">pending</span>' +
                ' </div><div class="actions">' +
                ' <i class="fa fa-eye-slash showButton"></i>' +
                ' <i class="fa fa-close closeButton"></i>' +
                ' </div>' +
                '</div>' +
                '<div class="conversation" style="display: none">' +
                ' <div class="conversation-container">' +
                ' <div class="message sent"> What happened last night? <br/>' +
                ' <hr style="margin: 0; margin-top: 5px"/>' +
                ' <span class="metadata"> Mehmet Buber<br/> ' +
                '<span class="time">17/02/2018 22:03</span>' +
                ' </span> ' +
                '</div>' +
                '<div class="message received"> You were drunk. <br/> ' +
                '<hr style="margin: 0; margin-top: 5px"/> ' +
                '<span class="metadata-received"> Mehmet Buber<br/>' +
                ' <span class="time">17/02/2018 22:03</span> ' +
                '</span>' +
                ' </div>' +
                '<div class="message sent"> No I wasnt. <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata"> Mehmet Buber<br/>' +
                ' <span class="time">17/02/2018 22:03</span> </span> </div><div class="message received">' +
                ' <span id="random">You were hugging an old man with a beard screaming "DUMBLEDORE YOURE ALIVE!"</span>' +
                ' <br/> <hr style="margin: 0; margin-top: 5px"/> <span class="metadata-received"> Mehmet Buber<br/> ' +
                '<span class="time">17/02/2018 22:03</span> </span> </div></div><form class="conversation-compose"> <input class="input-msg" name="input" placeholder="Type a message" autocomplete="off" autofocus></input> <div class="send"> <div class="circle"> <i class="zmdi zmdi-mail-send"></i> </div></div></form> </div></div></div>');
        }

        setupDraggable();
    });
});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function setupDraggable() {
    $(".chat").each(function () {
        var ths = $(this);
        ths.draggable({
            snap: true,
            scroll: false,
            handle: ".user-bar",
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

                    console.log(parseInt(ths.css('left').replace("px", "")));
                    console.log(parseInt(ths.css('top').replace("px", "")));

                    console.log(newX * window.innerWidth);
                    console.log(newY * window.innerHeight);

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
$(document).on('click', 'body .hideButton', function () {
    $(this).closest('.chat').find('.conversation').hide();
    $(this).removeClass("hideButton");
    $(this).addClass("showButton");
    $(this).removeClass("fa-eye");
    $(this).addClass("fa-eye-slash");
});

$(document).on('click', 'body .showButton', function () {
    $(this).closest('.chat').find('.conversation').show();
    $(this).removeClass("showButton");
    $(this).addClass("hideButton");
    $(this).addClass("fa-eye");
    $(this).removeClass("fa-eye-slash");
});

function getPageXY(element) {
    var x = 0, y = 0;
    while (element) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    }
    return [x, y];
}

function buildMessage(text) {
    var element = document.createElement('div');

    element.classList.add('message', 'sent');

    element.innerHTML = text +
        '<span class="metadata">' +
        '<span class="time">' + moment().format('h:mm A') + '</span>' +
        '<span class="tick tick-animation">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
        '</span>' +
        '</span>';

    return element;
}

function generateId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}