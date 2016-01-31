var pg = require('pg'),


    // config = require('./config'),
    Q = require('q'),
    // databaseURL = config.databaseURL;        process.env.DATABASE_URL || "postgres://belgian@localhost/belgianbeers"

    // "postgres://belgian@localhost/belgianbeers"


    // 'postgres://localhost:5000/belgianbeers'



    databaseURL = process.env.DATABASE_URL || "postgres://B@localhost/team_test_2" ;

    // var client = new pg.Client(connectionString);
    // client.connect();




/**
 * Utility function to execute a SQL query against a Postgres database
 * @param sql
 * @param values
 * @param singleItem
 * @returns {promise|*|Q.promise}
 */
exports.query = function (sql, values, singleItem, dontLog) {

    if (!dontLog) {
        console.log(sql, values);
    }

    var deferred = Q.defer();

    pg.connect(databaseURL, function (err, conn, done) {
        if (err) return deferred.reject(err);
        try {
            conn.query(sql, values, function (err, result) {
                done();
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(singleItem ? result.rows[0] : result.rows);
                }
            });
        }
        catch (e) {
            done();
            deferred.reject(e);
        }
    });

    return deferred.promise;

};
