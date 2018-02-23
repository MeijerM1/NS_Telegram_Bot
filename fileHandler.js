var fs = require('fs');


exports.readSync = function(userId) {
    try {
        var userInfo = JSON.parse(fs.readFileSync('./users/' + userId + '/userInfo.json', 'utf8'));
    } catch(err) {
        return undefined;        
    }
    return userInfo;
}

exports.saveUserData = function(userId, userInfo) {
    checkFileExist(userId);

    let data = JSON.stringify(userInfo);  
    fs.writeFileSync(getFileLocation(userId), data); 
}

exports.addStation = function(userId, station) {

    checkFileExist(userId);

    var userInfo = getUserData(userId);

    if(userInfo !== undefined) {

        var index = userInfo.stations.findIndex(station);

        if(index === -1) {
            console.log("Adding new station");
            userInfo.stations.push(station);
        }
    }

    let data = JSON.stringify(userInfo);  
    fs.writeFileSync(getFileLocation(userId), data);  
}

exports.addTime = function(userId, time) {

    checkFileExist(userId);

    var userInfo = getUserData(userId);

    if(userInfo !== undefined) {

        var index = userInfo.times.findIndex(time);

        if(index === -1) {
            console.log("Adding new time");
            userInfo.times.push(time);
        }

        let data = JSON.stringify(userInfo);  
        fs.writeFileSync(getFileLocation(userId), data);
    }

  
}

function getFileLocation(userId) {
    return './users/' + userId + '/userInfo.json'
}

function checkFileExist(userId) {

    if(!fs.existsSync('./users/')) {
        console.log("Creating new users folder");
        fs.mkdirSync('./users/');
    }

    if (!fs.existsSync('./users/' + userId)){
        console.log("Creating new folder for user: " + userId);
        fs.mkdirSync('./users/' + userId );
        fs.writeFileSync(getFileLocation(userId));        
    }

    if (!fs.existsSync(getFileLocation(userId))){
        console.log("Creating new file");
        fs.writeFileSync(getFileLocation(userId));
    }
}

function getUserData(userId) {
    try {
        let rawdata = fs.readFileSync(getFileLocation(userId), "utf8");  
        var userInfo = JSON.parse(rawdata);  
        return userInfo;
    } catch(err) {
        console.log(err);        
        return undefined;
    }
}