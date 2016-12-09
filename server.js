var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8081});

var players = [];

var connection;

wss.on('connection', function(ws) {
    connection = ws;

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

function play(slug) {
    var playObj = {
        'route': 'play',
        'slug': slug,
    };

    broadcast(playObj);
}

function stop() {
    var stopObj = {
        'route': 'stop',
    };

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
