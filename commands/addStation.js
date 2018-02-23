exports.run = (ctx) => {
    ctx.reply("I was called from an external file!")
    console.log(ctx.state.command);
    console.log(ctx.update.message.from);

    // Check if staion exists

    // If so add station to list of station specific to user

    // If not return and prompt message
}