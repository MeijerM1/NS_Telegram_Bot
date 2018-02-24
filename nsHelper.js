const ns = require ('ns-api') ({
    username: 'mpw.meijer@gmail.com',
    password: process.env.NS_TOKEN
  });

exports.getStationList = (callback, stations) => {
    ns.stations (function (err, data) {
        callback(data,stations);
    });
}

exports.getRoute = (ctx, params, callback) => {
    ns.reisadvies(params, function(err, data) {
        console.log(err);
        callback(ctx, data);
    })
}