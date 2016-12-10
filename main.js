var saved_audio = {};
var ws;

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

function play(data) {
    var url = saved_audio[data.slug];
    var audio = new Audio(url);
    audio.src = url;
    audio.play();
}

function stop(data) {
    reload();
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
            'play': play,
            'stop': stop,
            'reload': reload,
            'showAlert': showAlert,
        };

        if (typeof routes[data.route] === 'function') {
            routes[data.route](data);
        }
    });
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
