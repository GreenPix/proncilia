# Admin Console

This project is part of the Renaissance project, that is an attempt
to write an open source 2D online RPG engine. The Admin Console is
intended to drive the server components

## Security Disclaimer

As for now, admin does not care about security. It does not use any
authentication, so you'd rather **NOT USE it FOR REAL LIFE PURPOSE**.

## Available commands

Admin Console exposes a REST API.

### `POST /start-server`

Start the Renaissance project. For now, it is just bz, the
authentication server.

#### Response Status

Code | Description
-----|-------------
204  | Server has been started correctly

### `POST /stop-server`

Stop the Renaissance project. For now, it is just bz, the
authentication server.

#### Response Status

Code | Description
-----|-------------
204  | Server has been stoped correctly

### `GET /logs/bz`

Get the logs produced by bz, the authentication server.

#### Response Body

```json
[
    {
        "time": "$(time: Timestamp)",
        "log": {
            "subject": "$(subject: String)"
            "priority": "$(priority: Int)"
            "msg": "$(msg: String)"
        }
    },
    ...
]
```

#### Response Status

Code | Description
-----|-------------
200  | Server has been stoped correctly

## Getting Started

```
npm install
node index.js
```
