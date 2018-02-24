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

    if(!checkDate(ctx.state.command.splitArgs[2])) {
        ctx.reply("Invalid date time format use HH:mm");
        return;
    }
}

exports.help = () => {
    return 'usage /init [station1] [station2] [time HH:mm]';
}

function checkDate(stringDate) {
    var timePattern = new RegExp("/(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23):?(0|1|2|3|4|5)\d/");
    if(timePattern.test(stringDate)) {
        console.log('valid time');
        return true;
    } else {
        console.log("invalid time format");
        return false;
    }
}

function checkIfStationExists(stationsToCheck) {
    nsHelper.getStationList(checkStation, stationsToCheck);
}

function checkStation(stations, stationsToCheck) {

    var existingStations = [];

    // Complexity issue.
    // Need to check if the station the user entered is an existing station within the NS db.
    stationsToCheck.forEach(element => {
        for (var key in stations) {
            if (stations.hasOwnProperty(key)) {
                if (stations[key].Namen !== undefined) {
                    if (stations[key].Namen.Kort.toUpperCase() === element.toUpperCase() ||
                        stations[key].Namen.Middel.toUpperCase()  === element.toUpperCase()  ||
                        stations[key].Namen.Lang.toUpperCase()  === element.toUpperCase() ) {
                        console.log('station exists');
                        existingStations.push(element);
                    }
                }
            }
        }
    });

    if(existingStations.length === stationsToCheck) {
        // All good.
    } else {
        // Non existing station.
    }
}