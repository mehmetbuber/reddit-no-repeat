
$(function () {
});

document.onclick = function (event) {
    console.log(event);
    if (!event.ctrlKey)
        return;

    var target = 'target' in event ? event.target : event.srcElement;

    var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
    var mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];

    var path = getPathTo(target);
    var txy = getPageXY(target);

    var message = 'You clicked the element ' + path + ' at offset ' + (mxy[0] - txy[0]) + ', ' + (mxy[1] - txy[1]);
    var item = {
        path: path,
        offsetX: (mxy[0] - txy[0]),
        offsetY: (mxy[1] - txy[1]),
        url: location.protocol + '//' + location.host + location.pathname
    };

    console.log(item);
    console.log(message);
    var elem = getElementByXpath(path);

    var note = prompt("Please enter your note", "");
    item.note = note;

    if (note !== null && note !== "") {
        $(elem).append('<div class="quote-container">' +
            '<i class="pin"></i>' +
            '<blockquote class="note yellow">' +
            '' + note + '<cite class="author">Albert Einstein</cite>' +
            '' + note + '<cite class="author">Albert Einstein</cite>' +
            '' + note + '<cite class="author">Albert Einstein</cite>' +
            '</blockquote>' +
            '</div>');
        $(elem).append(
            '<div class="row message" id="conversation"><div class="row message-previous"><div class="col-sm-12 previous">' +
            '<a onclick="previous(this)" id="ankitjain28" name="20">Show Previous Message!</a></div></div><div class="row message-body">' +
            '<div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">Hyy, Its Awesome..!</div>' +
            '<span class="message-time pull-right">Sun</span></div></div></div><div class="row message-body"><div class="col-sm-12 message-main-sender">' +
            '<div class="sender"><div class="message-text">Thanks n I know its awesome...!</div><span class="message-time pull-right">Sun</span>' +
            '</div></div></div></div><!-- Message Box End --><!-- Reply Box --><div class="row reply"><div class="col-sm-1 col-xs-1 reply-emojis">' +
            '<i class="fa fa-smile-o fa-2x"></i></div><div class="col-sm-9 col-xs-9 reply-main"><textarea class="form-control" rows="1" id="comment"></textarea>' +
            '</div><div class="col-sm-1 col-xs-1 reply-recording"><i class="fa fa-microphone fa-2x" aria-hidden="true"></i></div><div class="col-sm-1 col-xs-1 reply-send">' +
            '<i class="fa fa-send fa-2x" aria-hidden="true"></i></div></div>');

        chrome.storage.local.get(function (result) {
            if (!result)
                result = {};

            if (!result["items"])
                result["items"] = [];

            result["items"].push(item);
            console.log(result["items"]);
            chrome.storage.local.set(result);
        });
    } 
};

$(document).ready(function () {
    chrome.storage.local.get(function (result) {
        if (!result)
            result = {};

        if (!result["items"])
            result["items"] = [];

        for (var i = 0; i < result["items"].length; i++) {
            console.log(result["items"][i]);
            var elem = getElementByXpath(result["items"][i].path);
            $(elem).append('' +
                '<div class="quote-container">' +
                '<input class="todo-check" type="checkbox"><hr>' +
                '<div class="message " id="conversation">' +
                '<div class="row message-previous">' +
                '<div class="col-sm-12 previous">' +
                '<a onclick="previous(this)" id="ankitjain28" name="20">Show Previous Message!</a>' +
                '</div>' +
                '</div>' +
                '<div class="row message-body">' +
                '<div class="col-sm-12 message-main-receiver">' +
                '<div class="receiver">' +
                '<div class="message-text">' + result["items"][i].note + '</div>' +
                '<span class="message-time pull-right">Sun</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row message-body">' +
                '<div class="col-sm-12 message-main-sender">' +
                '<div class="sender">' +
                '<div class="message-text">Thanks n I know its awesome...!</div>' +
                '<span class="message-time pull-right">Sun</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<!-- Message Box End --><!-- Reply Box -->' +
                '<div class="row reply">' +
                '<div class="col-sm-9 col-xs-9 reply-main">' +
                '<textarea class="form-control" rows="1" id="comment"></textarea>' +
                '</div>' +
                '<div class="col-sm-1 col-xs-1 reply-recording">' +
                '<i class="fa fa-microphone fa-2x" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="col-sm-1 col-xs-1 reply-send">' +
                '<i class="fa fa-send fa-2x" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>');
        }

        $(".quote-container").each(function() {
            $(this).draggable();
        });
    });
});
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


//*[@id='answer-2631931']/div[1]/div[2]/div[1]/p[1]
function getPathTo(element) {
    if (element.id!=='')
        return "//*[@id='"+element.id+"']";
    
    if (element===document.body)
        return element.tagName.toLowerCase();

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

function getPageXY(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
}

/* Meme */

var memes = [
    'Dude, you smashed my turtle saying "I\'M MARIO BROS!"',
    'Dude, you grabed seven oranges and yelled "I GOT THE DRAGON BALLS!"',
    'Dude, you threw my hamster across the room and said "PIKACHU I CHOOSE YOU!"',
    'Dude, you congratulated a potato for getting a part in Toy Story',
    'Dude, you were hugging an old man with a beard screaming "DUMBLEDORE YOU\'RE ALIVE!"',
    'Dude, you were cutting all my pinapples yelling "SPONGEBOB! I KNOW YOU\'RE THERE!"',
];

var random = document.querySelector('#random');

random.innerHTML = memes[Math.floor(Math.random() * memes.length)];

/* Time */

var deviceTime = document.querySelector('.status-bar .time');
var messageTime = document.querySelectorAll('.message .time');

deviceTime.innerHTML = moment().format('h:mm');

setInterval(function () {
    deviceTime.innerHTML = moment().format('h:mm');
}, 1000);

for (var i = 0; i < messageTime.length; i++) {
    messageTime[i].innerHTML = moment().format('h:mm A');
}

/* Message */

var form = document.querySelector('.conversation-compose');
var conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessage);

function newMessage(e) {
    var input = e.target.input;

    if (input.value) {
        var message = buildMessage(input.value);
        conversation.appendChild(message);
        animateMessage(message);
    }

    input.value = '';
    conversation.scrollTop = conversation.scrollHeight;

    e.preventDefault();
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

function animateMessage(message) {
    setTimeout(function () {
        var tick = message.querySelector('.tick');
        tick.classList.remove('tick-animation');
    }, 500);
}