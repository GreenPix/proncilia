var express = require('express');
var bodyparser = require('body-parser');
var spawn = require('child_process').spawn;

var app = express();
var TOKEN = 0;

var session = null
var bz;

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

        env["RENAISSANCE_BZ_PORT"] = config.bz.port;
        env["RENAISSANCE_BZ_BACKEND"] = config.bz.backend.name;

        switch (config.bz.backend.name) {
        case "yesman":
            env["RENAISSANCE_BZ_YESMAN_USERDB"] = config.bz.backend.config.userdb;
            break;
        }

        bz = spawn("node", [ "index.js" ], {
            cwd: config.bz.root,
            env: env
        });

        bz.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        bz.on('exit', (code) => {
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
        bz.kill('SIGKILL');
    }

    res.end();
});


app.listen(8000);
