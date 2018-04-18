
// Checks if a string has the following format hh:mm.
// Returns true if the format is correct false otherwise.
exports.checkTime  = (stringTime) => {
    var timePattern = new RegExp(/^([2][0-3]|[01]?[0-9])([.:][0-5][0-9])?$/);
    if (timePattern.test(stringTime) && stringTime.length === 5) {
        return true;
    } else {
        console.log("invalid time format");
        return false;
    }
}

// Increases the hour of a string with the following format hh:mm.
// If string is in the wrong format returns undefined.
exports.increaseHour = (time) => {
    if(!exports.checkTime(time)) {
        return undefined;
    }

    let hours  = Number(time.substring(0,2));
    var newTime;

    if(hours === 23) {
        newTime  = "00" + time.substring(2,5); 
    } else {
        hours++;
        if(hours < 10) {
            hours  = "0" + hours;
        }
        newTime = hours + time.substring(2,5);
    }

    return newTime;
}

// Decreases the hour of a string with the following format hh:mm.
// If string is in the wrong format returns undefined.
exports.decreaseHour = (time) => {
    if(!exports.checkTime(time)) {
        return undefined;
    }

    let hours  = Number(time.substring(0,2));

    if(hours === 00) {
        hours = 23;
    } else {
        hours--;
        if(hours < 10) {
            hours = "0" + hours;
        }
    }

    return hours + time.substring(2,5);
}