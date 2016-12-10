var saved_audio = {};
var ws;
var now_playing = new Audio();

function loadAudio(data) {
    var slug = data.slug;
    var url = data.url;
    var audio = new Audio(url);
    audio.src = url;
    saved_audio[slug] = url;
}

function reload(data) {
    window.location.reload();
}

function playNew(data) {
    now_playing.pause();

    if (typeof saved_audio[data.slug] !== 'string') {
        return;
    }

    var url = saved_audio[data.slug];
    now_playing.src = url;

    if (now_playing.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        now_playing.play();
        now_playing.currentTime = 0;
    }
}

function play(data) {
    now_playing.play();
}

function stop(data) {
    now_playing.pause();
    now_playing.currentTime = 0;
}

function pause(data) {
    now_playing.pause();
}

function showAlert(data) {
    alert(data.message);
}

function reqListener () {
    var files = JSON.parse(this.response);

    for (var i = files.length - 1; i >= 0; i--) {
        loadAudio(files[i]);
    }
}

function connect() {
    var host = INSTACONGA.host;
    ws = new WebSocket('ws://' + host);

    ws.addEventListener('open', function (event) {
        var update = {message: 'Hello!'};

        var updateString = JSON.stringify(update);

        ws.send(updateString);

    });

    ws.addEventListener('message', function (event) {
        var data = JSON.parse(event.data);
        var routes = {
            'playNew': playNew,
            'pause': pause,
            'stop': stop,
            'reload': reload,
            'update': update,
            'showAlert': showAlert,
        };

        if (typeof routes[data.route] === 'function') {
            routes[data.route](data);
        }
    });
}

function update(data) {
    if (typeof saved_audio[data.slug] !== 'string') {
        return;
    }

    var url = saved_audio[data.slug];

    if (now_playing.src !== url) {
        now_playing.src = url;
    }

    if (now_playing.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        // Don't bother updating yet if audio isn't done downloading
        now_playing.currentTime = data.currentTime;
        now_playing.play();
    }
}

window.setInterval(function check() {
    if (!ws || (ws.readyState === WebSocket.CLOSED)) {
        connect();
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', reqListener);
    xhr.open('GET', '/audio-files.php');
    xhr.send();

    return check;
}(), 1000);
