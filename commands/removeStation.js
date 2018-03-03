const dbContext = require('../libs/dbContext');
const bot = require('../bot');

exports.run = (ctx) => {

    console.log(ctx.state.command.splitArgs);

    if (ctx.state.command.splitArgs.length !== 1 || ctx.state.command.splitArgs[0] === "") {
        ctx.reply("Invalid argument size, " + exports.help());
        return;
    }

    dbContext.getStation(ctx.state.command.splitArgs[0], function (station, userId) {
        console.log(station);
        console.log(userId);
        if (station.length === 0) {
            ctx.reply("No station with that name");
        } else {
            dbContext.removeStationForUser(station[0], userId);
            ctx.reply("You are no longer being informed about station: " + station[0].name_long);
        }
    }, ctx.from.id);
}

exports.help = () => {
    return "usage /removeStation [stationName]";
}

exports.summary = () => {
    return "You will no longer receive notifications about said station.";
}