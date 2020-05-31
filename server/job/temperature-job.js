const JobsConstants = require('../constants/jobs-constants');
const DbHelper = require('../common/db-helper');
const Q = require('q');
const unirest = require('unirest');

class TemperatureJob {
    constructor() {
        this.run();
    }

    run() {
        setInterval(async () => {
            const data = await this.getTemperatureAndHumidity();
            DbHelper.executeQueryWithNoResult(`INSERT INTO EGG_DATA (temperature, humidity, measurement_time) VALUES (${data.temperature}, ${data.humidity}, datetime('now', 'localtime'))`);

        }, JobsConstants.TIME_INTERVAL);
    }

    async getTemperatureAndHumidity() {
        const data = await this.unirestToPromise(unirest.get(JobsConstants.SENSOR_URL));
        return data;
    }

    unirestToPromise(unirest) {
        const deferred = Q.defer();
        try {
            unirest.end(res => deferred.resolve(res.body));
        } catch(error) {
            deferred.reject(error);
        }
        return deferred.promise;
    }
}

module.exports = TemperatureJob;