# Admin Console

This project is part of the Renaissance project, that is an attempt
to write an open source 2D online RPG engine. The Admin Console is
intended to drive the server components

## Available commands

Admin Console exposes a REST API.

URL | Type | Request body | Response Body | Error code
----|------|--------------|---------------|-----------
/start-server | POST | | { token: $TOKEN } | 403 if already started
/stop-servor | POST | { token: $TOKEN } | | 403 if invalid token or not started

## Getting Started

```
npm install
node index.js
```
