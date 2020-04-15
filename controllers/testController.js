exports.index = async (data) => {
  let conv = await Conversation.findAll({
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id']
    ]
  });
  conv.forEach((cov, i) => {
    bot.send(render('app/mailing'), cov.conversation_id);
  });
};
