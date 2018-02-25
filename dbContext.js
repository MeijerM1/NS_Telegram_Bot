const mySql = require('mysql');

var con = mySql.createConnection({
    host: "vserver218.axc.eu",
    user: "maxmeyh218_nsBotAdmin",
    password: process.env.NS_BOT_DB,
    database: "maxmeyh218_nsBot"
});

exports.addUser = function (ctx) {
    var id = ctx.from.id;
    var name = ctx.from.first_name;

    try {
        con.connect();
        
        console.log("Connected");

        var sql = "INSERT INTO user (id, name) VALUES (?, ?)";

        try {
            con.query(sql, [id, name], function (err, result) {
                if (err) { 
                    console.error(err); 
                    return;
                }
                console.log("Insertion complete");
            });
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    } finally {
        con.end();
    }
}