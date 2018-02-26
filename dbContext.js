const mySql = require('mysql');

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