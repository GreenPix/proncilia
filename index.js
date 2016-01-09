var express = require('express');
var bodyparser = require('body-parser');
var spawn = require('child_process').spawn;

var app = express();
var TOKEN = 0;

var session = null
var authent;

var config = require('./config.json');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.post('/start-server', function(req, res) {
    if (session == null) {
        var r = {}
        r.token = TOKEN;
        session = {};
        session.live = true;

        var env = {};

        env["RENAISSANCE_AUTHENT_PORT"] = config.authent.port;
        env["RENAISSANCE_AUTHENT_BACKEND"] = config.authent.backend.name;

        switch (config.authent.backend.name) {
        case "yesman":
            env["RENAISSANCE_AUTHENT_YESMAN_USERDB"] = config.authent.backend.config.userdb;
            break;
        }

        authent = spawn("node", [ "index.js" ], {
            cwd: config.authent.root,
            env: env
        });

        authent.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        authent.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });

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
