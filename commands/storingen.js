const nsHelper = require('../nsHelper');

exports.run = (ctx) => {
    ctx.reply("Checking for storingen");
    nsHelper.checkStoringForUser(ctx.from.id);
}