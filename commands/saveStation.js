const nsHelper = require('../nsHelper');
const dbContext = require('../dbContext');

exports.run = (ctx) => {
    nsHelper.getStationList(saveStations, undefined)
}

function saveStations(stations) {

    var values = []

    for (var key in stations) {
        if (stations.hasOwnProperty(key)) {
            if (stations[key].Namen !== undefined) {
                values. push([stations[key].Namen.Kort, stations[key].Namen.Middel, stations[key].Namen.Lang])
            }
        }
    }

    dbContext.addStation(values);
}