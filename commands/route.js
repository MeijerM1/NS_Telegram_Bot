const nsHelper = require('../nsHelper');

exports.run = (ctx) => { 
    var params = {
        fromStation: ctx.state.command.splitArgs[0],
        toStation: ctx.state.command.splitArgs[1],
        dateTime: '2018-02-21T15:50',
        departure: false
    }

    console.log(params);

    nsHelper.getRoute(ctx, params, printRoute);
}

function printRoute(ctx, data) {
    //console.log(data);
    console.log(data[0].ReisDeel);

    ctx.reply('You will travel via the following stations: ')

    data[0].ReisDeel[0].ReisStop.forEach(element => {
        console.log(element);
        ctx.reply(element.Naam);
    });
}