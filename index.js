var express = require('express');
var bodyparser = require('body-parser');
var spawn = require('child_process').spawn;

var app = express();
var TOKEN = 0;

var session = null
var authent;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.post('/start-server', function(req, res) {
    if (session == null) {
        var r = {}
        r.token = TOKEN;
        session = {};
        session.live = true;

        authent = spawn("node", [ "index.js" ], { cwd: "../authent-yesman" })

        res.json(r);
    } else {
        res.status(403).end();
    }
});

app.post('/stop-server', function(req, res) {
    if (session == null) {
        res.status(403);
    } else {
        session = null
        authent.kill('SIGKILL');
    }

    res.end();
});


app.listen(8000);
