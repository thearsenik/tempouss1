const SingletonStore = require("./singleton-store");

class DbHelper {
    static executeQueryAndGetResult(query, callback) {
        const db = SingletonStore.instance.db;
        db.serialize(() => {
            db.each(query, (err, row) => callback(row));
        });
    }

    static executeQueryAndGetResults(query, callback) {
        const db = SingletonStore.instance.db;
        db.serialize(() => {
            db.each(query, (err, row) => callback(row), () => callback(null));
        });
    }

    static executeQueryWithNoResult(query, callback) {
        const db = SingletonStore.instance.db;
        db.serialize(() => {
            db.run(query);
            if (callback) {
                callback();
            }
        });
    }
}

module.exports = DbHelper;