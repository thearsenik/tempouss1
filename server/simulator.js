const http = require('http');
const express = require('express');
const SingletonStore = require('./common/singleton-store');
const bodyParser = require('body-parser');
const TemperatureRest = require('./rest/temperature-rest');

let restList;
init();

function init() {
    const app = express();
    const server = http.createServer(app);
    app.use(bodyParser.json());
    server.listen(1338);
    
    app.get('/', function(req, res) {
        res.header('Content-type', 'application/json');
        const temperature = roundAfter2decimals(35 + (6 * Math.random()));
        const humidity = roundAfter2decimals(20 + (80 * Math.random()));
        return res.end(`{"temperature":${temperature}, "humidity":${humidity}}`);
    });
}

function roundAfter2decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}