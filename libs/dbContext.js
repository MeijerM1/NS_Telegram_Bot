/**
 * This file contains all database related material.
 */

const mySql = require('mysql');
const nsHelper = require('./nsHelper');

// Connection pool.
var pool = mySql.createPool({
    connectionLimit: 10,
    host: "vserver218.axc.eu",
    user: "maxmeyh218_nsBotAdmin",
    password: process.env.NS_BOT_DB,
    database: "maxmeyh218_nsBot"
});

/**
 * Add a user to the database.
 * @param {Context} ctx The context from the sender. 
 */
exports.addUser = function (ctx) {
    var query = "INSERT INTO user (id, name) VALUES (?, ?)";

    var params = [ctx.from.id, ctx.from.first_name];

    executeQuery(query, params);
}

/**
 * Get all users that want to be received at a certain time.
 * @param {string} time The time in [HH:MM] format.
 * @param {Function} callback The callback function.
 */
exports.getUsersForTime = (time, callback) => {
    var query = "SELECT userId FROM time WHERE time LIKE ?"

    var params = [time];

    executeQuery(query, params, callback)
}

/**
 * Remove a time for a specific user.
 * @param {long} userId The user to remove the time for.
 * @param {string} time the time in [HH:MM] format.
 * @param {function} callback The callback function.
 */
exports.removeTime = (userId, time, callback) => {
    var query = "DELETE FROM time WHERE userId = ? AND time = ?"

    var params = [userId, time];

    executeQuery(query, params, callback, userId);
}

/**
 * Get all times for a specific user.
 * @param {long} userId The user to get all the times.
 * @param {Function} callback The callback function.
 */
exports.getTimesForUser = (userId, callback) => {
    var query = "SELECT t.userId, t.time FROM time t WHERE t.userId = ?"

    var params = [userId];

    executeQuery(query, params, callback, userId);
}

/**
 * Get an array of objects containing the userId and station name.
 * @param {string} time The times in [HH:MM] format.
 */
exports.getUserStationForTime = (time) => {
    var query = "SELECT DISTINCT u.id, s.name_long FROM user AS u " +
        "JOIN time AS t ON t.userId = u.id " +
        "JOIN user_station AS us ON u.id = us.user_id " +
        "JOIN station AS s ON us.station_id = s.id " +
        "WHERE t.time LIKE ?";

    var params = [time];

    executeQuery(query, params, nsHelper.checkStoring);
}

/**
 * Add a time for a specific user.
 * @param {long} userId The user.
 * @param {string} time The time in [HH:MM] format.
 */
exports.addTime = (userId, time) => {

    var query = "INSERT INTO time (time, userId) VALUES (?, ?)";

    var params = [time, userId];

    executeQuery(query, params);
}

/**
 * Get an array of station names that the user wants to be informed about.
 * @param {long} userId The user.
 * @param {Fuction} callback The callback function.
 */
exports.getStationsForUser = (userId, callback) => {

    var query = "SELECT s.name_long FROM station AS s " +
        "JOIN user_station us ON s.id = us.station_id " +
        "WHERE us.user_id LIKE ? ORDER BY s.name_long;"

    var params = [userId];

    executeQuery(query, params, callback, userId);
}

/**
 * Get a station by it's name.
 * @param {string} stationName The name of the station.
 * @param {function} callback The callback function.
 * @param {long} userId The userId that will be passed to the callback function as second argument.
 */
exports.getStation = (stationName, callback, userId) => {
    var query = "SELECT * FROM station WHERE name_long LIKE ? OR name_middle LIKE ? OR name_short LIKE ?";

    var params = [stationName, stationName, stationName];

    executeQuery(query, params, callback, userId);
}

/**
 * Add an array of stations.
 * @param {array} stations Array containing a short name, middle name and long name.
 */
exports.addStation = function (stations) {

    var query = "INSERT INTO station (name_short, name_middle, name_long) VALUES ?";

    var params = [stations];

    executeQuery(query, params);
}

/**
 * Remove the link betweena user and a station.
 * @param {long} station The station id.
 * @param {long} userId The user id.
 */
exports.removeStationForUser = (station, userId) => {
    var query = "DELETE FROM user_station WHERE user_id = ? AND station_id = ?"

    var params = [userId, station.id];

    executeQuery(query, params);
}

/**
 * Add a link between a user and station.
 * @param {long} userId The user id.
 * @param {string} stationName The station name.
 */
exports.linkUserStation = function (userId, stationName) {
    var query = "SELECT * FROM station WHERE name_long LIKE ? OR name_middle LIKE ? OR name_short LIKE ?";

    var params = [stationName, stationName, stationName];

    // Get the staion.
    executeQuery(query, params, function (result, userId) {
        // Add the actual link between the user and station.
        exports.AddStationForUser(userId, result[0].id);
    }, userId);
}

/**
 * Add a link between a user and s station.
 * @param {long} userId The user id.
 * @param {long} stationid The station id.
 */
exports.AddStationForUser = (userId, stationId) => {
    var query = "INSERT INTO user_station (user_id, station_id) VALUES (?, ?)";

    var params = [userId, stationId];

    executeQuery(query, params);
}

/**
 * Add a link between a user and a defect.
 * @param {string} defectId The defect unique identifier. (provided by NS).
 * @param {long} userId The user id.
 */
exports.AddUserDefect = (defectId, userId) => {
    var query = "INSERT INTO defect_user (id, userId) VALUES (?, ?)";

    var params = [defectId, userId];

    executeQuery(query, params);
}

/**
 * Check if a user has been informed about a defect.
 * @param {long} userId The user.
 * @param {object} defect Defect object provided by NS.
 * @param {function} callback The callback function.
 */
exports.checkUserDefect = (userId, defect, callback) => {
    var query = "SELECT * FROM defect_user WHERE id = ? AND userId = ?";

    var params = [defect.id, userId];

    executeQuery(query, params, callback, defect);
}

exports.getAllTimes = (callback)=> {
    var query = "SELECT DISTINCT time FROM time";

    executeQuery(query, undefined, callback, undefined);
}

/**
 * Get all users that are subscribed to both the stations. 
 * 
 * @param {string} firstStation The name of the first station.
 * @param {string} secondStation The name of the second station.
 * @param {function} callback The callback function.
 */
exports.GetUserWithStations = (firstStation, secondStation, callback, defect) => {
    var query = "SELECT us.user_id FROM user_station AS us " +
                "JOIN station s ON us.station_id = s.id " +
                "WHERE station_id IN ((SELECT id FROM station WHERE name_short LIKE ? OR "   +
                                                                    "name_middle LIKE ? OR " +
                                                                    "name_long LIKE ?), "    +
                                     "(SELECT id FROM station WHERE name_short LIKE ? OR "        +
                                                                    "name_middle LIKE ? OR "      +
                                                                    "name_long LIKE ?)) "         + 
                "GROUP BY us.user_id " +
                "HAVING count(DISTINCT station_id) = 2;";
    
    var params = [firstStation, firstStation, firstStation, secondStation, secondStation, secondStation];

    executeQuery(query, params, callback, defect);
}

/**
 * Execute a query.
 * If a callback is specified will call it with the query results as first argument and the callbackParameters as second.
 * @param {string} query The query to execute.
 * @param {array} queryParams The parameters of the query.
 * @param {function} callback The callback function to call. The first argument will be the query results.
 * @param {any} callbackParams Second parameter to be passed to the callback function.
 */
function executeQuery(query, queryParams, callback, callbackParams) {
    pool.getConnection(function (err, connection) {

        connection.query(query, queryParams, function (error, results, fields) {
            connection.release();
            if (error) {
                console.log(error);
                return false;
            };

            //console.log("Executed query: " + query + " with parameters " + queryParams);
            //console.log("Affected rows: " + results.affectedRows);

            if (callback !== undefined) {
                callback(results, callbackParams);
            }
        });
    });
}