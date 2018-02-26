const nsHelper = require('../nsHelper');
const dbContext = require('../dbContext');

exports.run = (ctx) => {

    if (ctx.state.command.splitArgs.length !== 2) {
        ctx.reply("invalid argument size, " + exports.help());
        return;
    }

    var params = {
        fromStation: ctx.state.command.splitArgs[0].replace(/_/g, " "),
        toStation: ctx.state.command.splitArgs[1].replace(/_/g, " "),
        dateTime: new Date(),
        departure: false
    }

    console.log(params);

    nsHelper.getRoute(ctx, params, printRoute);
}

function printRoute(ctx, data) {
    //console.log(data);
    console.log(data[0].ReisDeel);
    var stations = [];

    data[0].ReisDeel.forEach(element => {
        element.ReisStop.forEach(element => {
            stations.push(element.Naam)
        })
    });

    stations.forEach(element => {
        dbContext.linkUserStation(ctx.from.id, element);
    });
}

exports.help = () => {
    return 'usage /route [stationFrom] [stationTo]';
}