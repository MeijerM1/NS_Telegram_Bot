const ns = require ('ns-api') ({
    username: 'mpw.meijer@gmail.com',
    password: process.env.NS_TOKEN
});

const bot = require('./bot');


exports.getStationList = (callback, stations) => {
    ns.stations (function (err, data) {
        callback(data,stations);
    });
}

exports.getRoute = (ctx, params, callback) => {
    ns.reisadvies(params, function(err, data) {
        console.log(err);
        if(err != null) {
            ctx.reply("Oops look like you made a spelling mistake");
            return;
        }
        callback(ctx, data);
    })
}

exports.checkStoring = (results) => {
    console.log(results);

    results.forEach(element => {
        var params = {
            station: element.name_long,
            unplanned: true
        };

        console.log(params);
    
        ns.storingen(params, function(err, data) {
            console.log(data.Ongepland);

            if(data.Ongepland.length === 0 ) {
                bot.sendMessage(element.id, "No reports about station: " + element.name_long +"!");
            } else {
                data.Ongepland.forEach(storing => {
                    if(storing.Traject.indexOf(element.name_long) !== -1) {
                        bot.sendMessage(element.id, storing.Bericht);
                    } else {
                        bot.sendMessage(element.id, "No reports about station: " + element.name_long +"!");
                    }
                });
            }
        });
    });
}