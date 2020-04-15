const Op = Sequelize.Op;
exports.help = async (data) => {
  bot.send(render("help"), data.user_id)
};
exports.private_error = async (data) => {
  bot.send('В ЛС боту дрочить нельзя. Иди в беседу, и бота туда.', data.object.message.peer_id)
};
exports.invite_chat = async () => {
  bot.send('Бота добавили в новую беседу', process.env.VK_USER_ID)
};
exports.conversation = async (data) => {

  let user = await User.findOne({where: {vk_id: data.from_id}});
  if (user == null) return;

  let conv = await Conversation.findOrCreate({
      where: {user_id: user.id},
      defaults: {
        user_id: user.id,
        conversation_id: data.user_id,
        saves: 0
      }
    });
  conv = conv[0];
  if (conv.conversation_id != data.user_id && conv.saves == 0) {
    conv.conversation_id = data.user_id;
    conv.save();
  }
};

exports.info = async (data) => {
  let covs = await Conversation.findAll({
    where: { conversation_id: { [Op.gte]: 2000000000 } },
    attributes: [ [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id'] ]
  });
  let count_conv = covs.length;
  return await bot.send(render('app/info', {
    users: await User.count(),
    conversations: count_conv,
    faps: await User.sum('count_fap'),
    bibons: await Bibon.count(),
    all_bibs: Math.round(await User.sum('biba')) / 100,
    sm_plus: await Bibon.sum('biba', {where: {result: 1}}),
    sm_minus: await Bibon.sum('biba', {where: {result: 0}}),
    bibon_plus: await Bibon.count({where: {result: 1}}),
    bibon_minus: await Bibon.count({where: {result: 0}}),
  }), data.user_id);
};
