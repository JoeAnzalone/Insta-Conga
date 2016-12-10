var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8081});
var now_playing = {};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log(message);
    });

    ws.on('close', function(code) {
        //
    });
});

function broadcast(data) {
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }

    wss.clients.forEach((client) => {
        client.send(data);
    });
}

function playNew(slug) {
    clearInterval(now_playing.update_interval_id);


    var playObj = {
        'route': 'playNew',
        'slug': slug,
    };

    now_playing.currentTime = 0;
    var interval = 3000;
    now_playing.update_interval_id = setInterval(function () {
        now_playing.currentTime += (interval/1000);
        update(now_playing.slug, now_playing.currentTime);
    }, interval);

    now_playing.slug = slug;
    now_playing.state = 'playing';

    broadcast(playObj);
}

function stop() {
    clearInterval(now_playing.update_interval_id);

    var stopObj = {
        'route': 'stop',
    };

    now_playing.state = 'stopped';
    broadcast(stopObj);
}

function reload() {
    var reloadObj = {
        'route': 'reload',
    };

    broadcast(reloadObj);
}

function alert(message) {
    var alertObj = {
        'route': 'showAlert',
        'message': message,
    };

    broadcast(alertObj);
}

function update(slug, currentTime) {
    var thing = {
        'route': 'update',
        'state': 'playing',
        'slug': slug,
        'currentTime': currentTime,
    };

    broadcast(thing);
}
