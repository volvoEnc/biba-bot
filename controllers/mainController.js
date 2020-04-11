exports.help = async (data) => {
  bot.send(render("help"), data.user_id)
};
exports.private_error = async (data) => {
  bot.send('В ЛС боту дрочить нельзя. Иди в беседу, и бота туда.', data.object.message.peer_id)
};
