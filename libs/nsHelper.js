const http = require("http");
const schedule = require('node-schedule');
const ns = require('ns-api')({
    username: 'mpw.meijer@gmail.com',
    password: process.env.NS_TOKEN
});

const bot = require('../bot');
const dbContext = require("./dbContext");

exports.getStationList = (callback, stations) => {
    ns.stations(function (err, data) {
        callback(data, stations);
    });
}

exports.getRoute = (ctx, params, callback) => {
    ns.reisadvies(params, function (err, data) {
        console.log(err);
        if (err != null) {
            ctx.reply("Oops look like you made a spelling mistake");
            return;
        }
        callback(ctx, data);
    })
}

exports.checkStoringForUsers = (users) => {
    users.forEach(user => {
        exports.checkStoringForUser(user.userId);
    });
}

exports.getAllDefects = (callback) => {
    var request = require('request'),
        username = "mpw.meijer@gmail.com",
        password = process.env.NS_TOKEN,
        url = "http://webservices.ns.nl/ns-api-storingen?&actual=true&unplanned=false",
        auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    request({
            url: url,
            headers: {
                "Authorization": auth
            }
        },
        function (error, response, body) {
            var parseString = require('xml2js').parseString;
            parseString(body.toString(),{trim: true}, function (err, result) {
                callback(result);
            });
        }
    );
}

exports.initialise = () => {
    dbContext.getAllTimes(exports.ScheduleAllTimes);
}

exports.ScheduleAllTimes = (times) => {
    times.forEach(time => {        
        exports.scheduleJob(time.time);
    });

    console.log("All jobs scheduled");
}

exports.scheduleJob = (time) => {
console.log("Scheduling job at: " + time);

    var hours = time.substring(0, 2);
    var minutes = time.substring(3, 5);

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(0, 7)];
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);

    var j = schedule.scheduleJob(rule, function (fireDate) {

        var hours = fireDate.getHours();
        var minutes = fireDate.getMinutes();

        if (hours < 10) {
            hours = padNumber(hours, 2);
        }

        if (minutes < 10) {
            minutes = padNumber(minutes, 2);
        }

        var time = hours + ":" + minutes;

        dbContext.getUsersForTime(time, exports.checkStoringForUsers);
    });
}

exports.checkStoringForUser = (userId) => {
    var userDefects = new Array();

    dbContext.getStationsForUser(userId, function (results) {

        var counter = results.length;

        results.forEach(element => {
            var params = {
                station: element.name_long,
                unplanned: true
            };

            ns.storingen(params, function (err, data) {
                if (err) {
                    console.log(err);
                    counter--;
                    return;
                }

                if (data.Ongepland.length !== 0) {
                    data.Ongepland.forEach(storing => {
                        if (storing.Traject.indexOf(element.name_long) !== -1) {
                            index = userDefects.findIndex(i => i.id === storing.id);
                            if (index === -1) {
                                userDefects.push(storing);
                            }
                        }
                    });
                }

                counter--;

                if (counter <= 0) {
                    if (userDefects.length === 0) {
                        bot.sendMessage(userId, "There are no know defects at the moment! Note that standard disclaimers apply. Information may be incomplete or incorrect.")
                    } else {
                        userDefects.forEach(element => {
                            bot.sendMessage(userId, "Storing " + element.Traject + "\n\n" +
                                "Bericht: " + element.Bericht + " \n\n" +
                                "Reden: " + element.Reden);
                        });
                    }
                }
            });
        });
    });
}

exports.checkStoring = (results) => {
    console.log(results);
}