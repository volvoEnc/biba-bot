const Op = Sequelize.Op;
exports.tops = async (data) => {
  if (data.from_id == data.user_id)
    return pre_send("Топы", data.user_id, { disable_mentions: 1, keyboard: await get_keyboard('RatingKeyboard', false) });
};
exports.help = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  await pre_send(await render("app/help", {}, data), data.user_id)
};
exports.private_error = async (data) => {
  await pre_send('В ЛС боту дрочить нельзя. Иди в беседу, и бота туда.', data.object.message.peer_id)
};
exports.invite_chat = async () => {
  await pre_send('Бота добавили в новую беседу', process.env.VK_USER_ID)
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
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  let zero_users = await User.count({where: {biba: 0}});
  let active_users = (await User.count()) - zero_users;
  let covs = await Conversation.findAll({
    where: { conversation_id: { [Op.gte]: 2000000000 } },
    attributes: [ [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id'] ]
  });
  let count_conv = covs.length;
  return await pre_send(await render('app/info', {
    users: await User.count(),
    zero_users: zero_users,
    active_users: active_users,
    conversations: count_conv,
    faps: await User.sum('count_fap'),
    bibons: await Bibon.count(),
    bigbons: await BigBibon.count(),
    all_bibs: Math.round(await User.sum('biba')) / 100,
    sm_plus: await Bibon.sum('biba', {where: {result: 1}}),
    sm_minus: await Bibon.sum('biba', {where: {result: 0}}),
    big_sm_plus: await BigBibon.sum('biba', {where: {result: 1}}),
    big_sm_minus: await BigBibon.sum('biba', {where: {result: 0}}),
    bibon_plus: await Bibon.count({where: {result: 1}}),
    bibon_minus: await Bibon.count({where: {result: 0}}),
    bigbons_plus: await BigBibon.count({where: {result: 1}}),
    bigbons_minus: await BigBibon.count({where: {result: 0}}),
  }, data), data.user_id);
};
