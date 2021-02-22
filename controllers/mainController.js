const Op = Sequelize.Op;
exports.tops = async (data) => {
  if (data.from_id == data.user_id)
    return await pre_send("Топы", data.user_id, { disable_mentions: 1, keyboard: await get_keyboard('RatingKeyboard', false) });
};
exports.help = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  await pre_send(await render("app/help", {}, data), data.user_id)
};
exports.invite_chat = async () => {
  await pre_send('Бота добавили в новую беседу', process.env.VK_USER_ID);
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
  let inactiveDate = Date.now() - (1000 * 60 * 60 * 24 * 3);
  let inactive_users = await User.count({where: {updatedAt: {[Op.lte]: inactiveDate}}});
  let active_users = (await User.count()) - inactive_users;
  let covs = await Conversation.findAll({
    where: { conversation_id: { [Op.gte]: 2000000000 } },
    attributes: [ [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id'] ]
  });
  let count_conv = covs.length;
  return await pre_send(await render('app/info', {
    users: await User.count(),
    zero_users: inactive_users,
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

exports.userInfo = async data => {
  let msPerDay = 1000 * 60 * 60 * 24;
  let date3 = Date.now() - (msPerDay * 3);
  let date10 = Date.now() - (msPerDay * 10);
  let date30 = Date.now() - (msPerDay * 30);


  return await pre_send(await render('app/users_info', {
    users: await User.count(),
    day3: {
      active: await User.count({
        where: {updatedAt: {[Op.gt]: date3}}
      }),
      inactive: await User.count({
        where: {updatedAt: {[Op.lte]: date3}}
      }),
      new: await User.count({
        where: {createdAt: {[Op.gte]: date3}}
      }),
    },
    day10: {
      active: await User.count({
        where: {updatedAt: {[Op.gt]: date10}}
      }),
      inactive: await User.count({
        where: {updatedAt: {[Op.lte]: date10}}
      }),
      new: await User.count({
        where: {createdAt: {[Op.gte]: date10}}
      }),
    },
    day30: {
      active: await User.count({
        where: {updatedAt: {[Op.gt]: date30}}
      }),
      inactive: await User.count({
        where: {updatedAt: {[Op.lte]: date30}}
      }),
      new: await User.count({
        where: {createdAt: {[Op.gte]: date30}}
      }),
    }
  }, data), data.user_id);
}
