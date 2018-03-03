const nsHelper = require('../libs/nsHelper');

exports.run = (ctx) => {
    ctx.reply("Checking for storingen");
    nsHelper.checkStoringForUser(ctx.from.id);
}

exports.help = () => {
    return "Usage /storingen";
}

exports.summary = () => {
    return "Shows any failures on any of the stations you are watching";
}