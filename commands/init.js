const nsHelper = require('../nsHelper');

exports.run = (ctx) => {
    console.log(ctx.state.command.splitArgs);
    if (ctx.state.command.splitArgs.length !== 3) {
        ctx.reply("Invalid argument call, " + exports.help());
        return;
    }
    ctx.reply("Checking stations");

    var stationToCheck = [];
    stationToCheck.push(ctx.state.command.splitArgs[0]);
    stationToCheck.push(ctx.state.command.splitArgs[1]);

    checkIfStationExists(stationToCheck);

    getDate(ctx.state.command.splitArgs[2]);
}

exports.help = () => {
    return 'usage /init [station1] [station2] [time]';
}

function getDate(stringDate) {
    var date =  new Date (new Date().toDateString() + ' ' + stringDate);
    console.log(date);
}

function checkIfStationExists(stationsToCheck) {
    nsHelper.getStationList(checkStation, stationsToCheck);
}

function checkStation(stations, stationsToCheck) {

    stationsToCheck.forEach(element => {
        for (var key in stations) {
            if (stations.hasOwnProperty(key)) {
                if (stations[key].Namen !== undefined) {
                    if (stations[key].Namen.Kort.toUpperCase() === element.toUpperCase() ||
                        stations[key].Namen.Middel.toUpperCase()  === element.toUpperCase()  ||
                        stations[key].Namen.Lang.toUpperCase()  === element.toUpperCase() ) {
                        console.log('station exists');
                    }
                }
            }
        }
    });
}