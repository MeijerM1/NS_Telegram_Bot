const ns = require('ns-api')({
    username: 'mpw.meijer@gmail.com',
    password: process.env.NS_TOKEN
});

const bot = require('./bot');
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

exports.checkStoringForUser = (userId) => {
    console.log(userId);
    var userDefects = new  Array();

    dbContext.getStationsForUser(userId, function (results) {

        var counter = results.length;
        console.log("Getting info for " + counter + " stations");

        results.forEach(element => {
            var params = {
                station: element.name_long,
                unplanned: true
            };

            console.log(params);

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

                console.log(counter);

                counter--;

                if(counter <= 0) {

                    if (userDefects.length === 0) {
                        bot.sendMessage(userId, "There are no know defects at the moment! Note that standard disclaimers apply. Information may be incomplete or incorrect.")
                    } else {
                        userDefects.forEach(element => {
                            console.log(element);
                            bot.sendMessage(userId, "Storing \n\n" + 
                                                    "Bericht: " + element.Bericht + " \n\n" +
                                                    "Reden: " + element.Reden + "\n\n" + 
                                                    "Traject: " + element.Traject);
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