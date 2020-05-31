const http = require('http');
const express = require('express');
const SingletonStore = require('./common/singleton-store');
const bodyParser = require('body-parser');
const TemperatureRest = require('./rest/temperature-rest');
const TemperatureJob = require('./job/temperature-job');

let restList;
init();

function init() {
    initDB();
    initWebServer();
}

function initDB() {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(':memory:');
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS EGG_DATA (temperature FLOAT, humidity FLOAT, measurement_time TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS EGG_CONF (ideal_temperature FLOAT, min_temperature FLOAT, max_temperature FLOAT, ideal_humidity FLOAT)");
        db.run("INSERT INTO EGG_CONF (ideal_temperature, min_temperature, max_temperature, ideal_humidity)  SELECT * FROM (SELECT '37.5', '35', '40', '40') AS tmp WHERE NOT EXISTS (SELECT * FROM EGG_CONF WHERE 1 = 1) LIMIT 1;");
    });
    SingletonStore.instance.db = db;
}

function initWebServer() {
    const app = express();
    const server = http.createServer(app);
    app.use(bodyParser.json());
    server.listen(1337);
    
    app.get('/', function(req, res) {
        res.header('Content-type', 'text/html');
        return res.end('<h1>HTTP WORKS!</h1>');
    });

    SingletonStore.instance.server = app;

    const restClasses = [TemperatureRest, TemperatureJob];
    restList = restClasses.map(clazz => new clazz());
}
