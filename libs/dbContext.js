const mySql = require('mysql');
const nsHelper = require('./nsHelper');

var pool = mySql.createPool({
    connectionLimit: 10,
    host: "vserver218.axc.eu",
    user: "maxmeyh218_nsBotAdmin",
    password: process.env.NS_BOT_DB,
    database: "maxmeyh218_nsBot"
});

exports.addUser = function (ctx) {
    var query = "INSERT INTO user (id, name) VALUES (?, ?)";

    var params = [ctx.from.id, ctx.from.first_name];

    executeQuery(query, params);
}

exports.getUsersForTime = (time, callback) => {
    var query = "SELECT userId FROM time WHERE time LIKE ?"

    var params = [time];

    executeQuery(query, params, callback)
}

exports.removeTime = (userId, time, callback) => {
    var query = "DELETE FROM time WHERE userId = ? AND time = ?"

    var params = [userId, time];

    executeQuery(query, params, callback, userId);
}

exports.getTimesForUser = (userId, callback) => {
    var query = "SELECT t.userId, t.time FROM time t WHERE t.userId = ?"

    var params = [userId];

    executeQuery(query, params, callback, userId);
}

exports.getUserStationForTime = (time) => {
    var query = "SELECT DISTINCT u.id, s.name_long FROM user AS u " +
        "JOIN time AS t ON t.userId = u.id " +
        "JOIN user_station AS us ON u.id = us.user_id " +
        "JOIN station AS s ON us.station_id = s.id " +
        "WHERE t.time LIKE ?";

    var params = [time];

    executeQuery(query, params, nsHelper.checkStoring);
}

exports.addTime = (userId, time) => {

    var query = "INSERT INTO time (time, userId) VALUES (?, ?)";

    var params = [time, userId];

    executeQuery(query, params);
}

exports.getStationsForUser = (userId, callback) => {

    var query = "SELECT s.name_long FROM station AS s " +
        "JOIN user_station us ON s.id = us.station_id " +
        "WHERE us.user_id LIKE ? ORDER BY s.name_long;"

    var params = [userId];

    executeQuery(query, params, callback, userId);
}

exports.getStation = (stationName, callback, userId) => {
    var query = "SELECT * FROM station WHERE name_long LIKE ? OR name_middle LIKE ? OR name_short LIKE ?";

    var params = [stationName, stationName, stationName];

    executeQuery(query, params, callback, userId);
}

exports.addStation = function (stations) {

    var query = "INSERT INTO station (name_short, name_middle, name_long) VALUES ?";

    var params = [stations];

    executeQuery(query, params);
}

exports.removeStationForUser = (station, userId) => {
    var query = "DELETE FROM user_station WHERE user_id = ? AND station_id = ?"

    var params = [userId, station.id];

    executeQuery(query, params);
}

exports.linkUserStation = function (userId, stationName) {
    var query = "SELECT * FROM station WHERE name_long LIKE ? OR name_middle LIKE ? OR name_short LIKE ?";

    var params = [stationName, stationName, stationName];

    executeQuery(query, params, function (result, userId) {
        exports.AddStationForUser(userId, result[0].id);
    }, userId);
}

exports.AddStationForUser = (userId, stationId) => {
    var query = "INSERT INTO user_station (user_id, station_id) VALUES (?, ?)";

    var params = [userId, stationId];

    executeQuery(query, params);
}

function executeQuery(query, queryParams, callback, callbackParams) {
    pool.getConnection(function (err, connection) {

        connection.query(query, queryParams, function (error, results, fields) {
            connection.release();
            if (error) {
                console.log(error);
                return false;
            };

            console.log("Executed query: " + query + " with parameters " + queryParams);
            console.log("Affected rows: " + results.affectedRows);

            if (callback !== undefined) {
                callback(results, callbackParams);
            }
        });
    });
}