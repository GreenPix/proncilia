var express = require('express');
var bodyparser = require('body-parser');
var spawn = require('child_process').spawn;

var conf = require('./config.js');
var config = require('./config.json');

var app = express();
var TOKEN = 0;

var session = false;

var bz;
var bz_live = false;

var gjanajo;
var gjanajo_live = false;


var bz_log = [];

const LOG_INFO = 0;
const LOG_ERR = 1;
const LOG_VERBOSE = 2;

var sqlite = require('sqlite3').verbose();
var logdb = new sqlite.Database("log.db");

function LogEntry(subject, p, message) {
    this.subject = subject;
    this.priority = p;
    this.msg = message;
}

function log_info (subject, p, message) {
    console.log(JSON.stringify(new LogEntry(subject, LOG_INFO, message)));
}

function log_print(mod, log) {
    var p;

    switch (log.priority) {
    case LOG_INFO:
        p = "INF";
        break;
    case LOG_ERR:
        p = "ERR";
        break;
    case LOG_VERBOSE:
        p = "VER";
        break;
    }

    console.log(p + " [" + mod + "] <" + log.subject + "> " + log.msg);
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/status', function(req, res) {
    var r = {
        live: session,
        services: {
            bz: bz_live
        }
    }

    res.json(r);
});

app.get('/logs/bz', function(req, res) {
    logdb.all("SELECT time, p, subject, message FROM bz",
              function (err,rows) {
                  if (err) {
                      console.log(err);
                  } else {
                      var r = [];
                      for (row of rows) {
                          var tmp = {};
                          tmp.time = row.time;
                          tmp.log = new LogEntry(row.subject,
                                                 row.priority,
                                                 "" + row.message);
                          r[r.length] = tmp;
                      }

                      res.json(r);
                  }
              });
});

app.post('/start-server', function(req, res) {
    if (!session) {
        gjanajo = spawn("node", [ "index.js" ], {
            cwd: config.gjanajo.root,
            env: conf.gjanajo_env_var(config)
        });
        gjanajo_live = true;

        bz = spawn("node", [ "index.js" ], {
            cwd: config.bz.root,
            env: conf.bz_env_var(config)
        });

        bz.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        bz.stdout.on('data', (data) => {
            var log = JSON.parse(`${data}`);
            logdb.run("INSERT INTO bz (time, p, subject, message) VALUES (?, ?, ?, ?)",
                      Date.now(), log.priority, log.subject, log.msg, function (err) {
                          if (err) {
                              console.log("error with db");
                          }
                      });
            bz_log.push(log);
            log_print("bz", log);
        });

        bz.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });

        bz_live = true;
        session = true;

        res.status(204).end();
    } else {
        res.status(403).end();
    }
});

app.post('/stop-server', function(req, res) {
    if (session) {
        bz.kill('SIGKILL');
        gjanajo.kill('SIGKILL');
        session = false;
        bz_live = false;
        gjanajo_live = false;
        res.status(204).end();
    } else {
        res.status(403).end();
    }
});


app.listen(8000);
