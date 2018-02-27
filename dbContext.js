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
    var id = ctx.from.id;
    var name = ctx.from.first_name;

    pool.getConnection(function(err, connection) {
        var query = "INSERT INTO user (id, name) VALUES (?, ?)";

        connection.query(query, [id, name], function (error, results, fields) {
            connection.release();        
            if (error) {
                console.log(error);
                return;
            } 

            console.log(results);
        });
    });
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
    var query ="SELECT DISTINCT u.id, s.name_long FROM user AS u " +
                    "JOIN time AS t ON t.userId = u.id " +
                    "JOIN user_station AS us ON u.id = us.user_id " +
                    "JOIN station AS s ON us.station_id = s.id " +
                    "WHERE t.time LIKE ?";

    var params  = [time];

    executeQuery(query, params, nsHelper.checkStoring);
} 

exports.addTime = (userId, time) => {

    var query = "INSERT INTO time (time, userId) VALUES (?, ?)";

    var params = [time, userId];

    executeQuery(query, params);
}

exports.addStation = function (stations) {

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO station (name_short, name_middle, name_long) VALUES ?";

        con.query(sql, [stations], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
          con.end();
        });
    });
}

exports.linkUserStation = function(userId, stationName) {

    pool.getConnection(function(err, connection) {
        var query = "SELECT * FROM station WHERE name_long LIKE ? OR name_middle LIKE ? OR name_short LIKE ?"

        connection.query(query, [stationName, stationName, stationName], function (error, results, fields) {
            connection.release();        
            if (error) {
                console.log(error);
                return;
            }

            console.log(results);

            addUserStation(userId, results[0].id);
        });
    });
}


function addUserStation(userId, stationId) {
    pool.getConnection(function(err, connection) {
        var query = "INSERT INTO user_station (user_id, station_id) VALUES (?, ?)";

        connection.query(query, [userId, stationId], function (error, results, fields) {
            connection.release();        
            if (error) {
                console.log(error);
                return;
            };

            console.log(results);
        });
    });
}

function executeQuery(query, queryParams, callback, callbackParams) {
    pool.getConnection(function(err, connection) {

        connection.query(query, queryParams, function (error, results, fields) {
            connection.release();        
            if (error) {
                console.log(error);
                return false;
            };

            console.log("Executed query: " + query +  " with parameters " + queryParams);
            console.log("Affected rows: " + results.affectedRows);

            if(callback !== undefined) {
                callback(results, callbackParams);            
            }
        });
    });
}