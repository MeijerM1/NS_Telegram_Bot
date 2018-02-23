const ns = require ('ns-api') ({
    username: 'mpw.meijer@gmail.com',
    password: process.env.NS_TOKEN
  });

exports.getStationList = (callback, stations) => {
    ns.stations (function (err, data) {
        callback(data,stations);
    });
}