const SingletonStore = require('../common/singleton-store');
const DbHelper = require('../common/db-helper');
const JobsConstants = require('../constants/jobs-constants');

class TemperatureRest {
    constructor() {
        this.init(SingletonStore.instance.server, SingletonStore.instance.db);
    }

    init(app, db) {
        app.get('/api/temperature', (req, res) => this.getCurrentValue(req, res));

        app.get('/api/temperature/conf', (req, res) => this.getConfiguration(req, res));
        app.put('/api/temperature/conf', (req, res) => this.setConfiguration(req, res));
    
        app.get('/api/temperature/history', (req, res) => this.getHistory(req, res)); // queryParams: minutes(mandatory)
    }

    async getCurrentValue(req, res) {
        res.header('Content-type', 'application/json');
        DbHelper.executeQueryAndGetResult("select * from EGG_DATA order by measurement_time desc limit 1", (row) => res.end(JSON.stringify(row)));
        return res;
    }
    
    async getConfiguration(req, res) {
        res.header('Content-type', 'application/json');
        DbHelper.executeQueryAndGetResult("select * from EGG_CONF", (row) => res.end(JSON.stringify(row)));
        return res;
    }
    
    async getConfiguration(req, res) {
        res.header('Content-type', 'application/json');
        DbHelper.executeQueryWithNoResult(`update EGG_CONF set ideal_temperature ='${req.body.ideal_temperature}' , min_temperature='${req.body.min_temperature}', max_temperature='${req.body.max_temperature}', ideal_humidity=${req.body.ideal_humidity}`);
        return res;
    }

    async getHistory(req, res) {
        res.header('Content-type', 'application/json');
        if (!req.query.minutes) {
            res.status(400);
            return res;
        }
        const rows = [];
        const nbRows = req.query.minutes  * (60 / (JobsConstants.TIME_INTERVAL /1000));
        DbHelper.executeQueryAndGetResults(`select * from EGG_DATA order by measurement_time desc limit ${nbRows}`, (row) => {
            if (row) {
                rows.push(row);
            } else {
                res.end(JSON.stringify(rows));
            }
        });
        return res;
    }

}

module.exports = TemperatureRest;