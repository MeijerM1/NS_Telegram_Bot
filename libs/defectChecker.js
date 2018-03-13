const nsHelper = require("../libs/nsHelper");
const dbHelper = require("../libs/dbContext");
const bot = require("../bot");

// Call this at a 5 minute interval.
exports.run = () => {
    // Get all current defects.
    let date = new Date();
    console.log("Checking for defects at: " + date);
    nsHelper.getAllDefects(getStations);
}

/**
 * Callback for defect getter.
 * @param {array} defects list of current defects.
 */
function getStations(defects) {
    defects.Storingen.Ongepland[0].Storing.forEach(Storing => {
        parseRoute(Storing);
    });
}
/**
 * A defect can involve multiple routes.
 * Parse all routes to a list of stations.
 * @param {string} data Route information provided by NS.
 */
function parseRoute(defect) {
    // Split the data to single routes.
    var routes = defect.Traject[0].split(/[;]+/);

    // Split the routes into a list of stations.
    routes.forEach(route => {
        var stations = route.split(/[-]+/).map(Function.prototype.call, String.prototype.trim); // Trim all white spaces.
        if (stations.length > 2) {
            dbHelper.GetUserWithStations(stations[0], stations[2], sendMessageToUsers, defect);

        } else {
            dbHelper.GetUserWithStations(stations[0], stations[1], sendMessageToUsers, defect);
        }
    });
}

function sendMessageToUsers(results, defect) {
    results.forEach(user => {
        // Check if we have already informed the user about this defect.
        dbHelper.checkUserDefect(user.user_id, defect, function (results, defect) {

            // We have not informed the user.
            if (results.length <= 0) {
                // Notify the user.
                bot.sendMessage(user.user_id, "Storing " + defect.Traject + "\n\n" +
                    "Bericht: " + defect.Bericht + " \n\n" +
                    "Reden: " + defect.Reden);

                // Store that we have notified the user.
                dbHelper.AddUserDefect(defect.id, user.user_id);
            }
        });
    });
};