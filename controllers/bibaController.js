const Op = Sequelize.Op;
exports.index = async (data) => {

  bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}).then(res => {
    bot.send(render('bibametr', {
      biba: random.int(0, 30),
      template: random.int(1, 4),
      first_name: res[0].first_name,
      last_name: res[0].last_name,
      id: data.to_id
    }), data.user_id)
  })
}

exports.profile = async (data) => {
  // let [user, created] = await User.findOrCreate({ where: {vk_id: data.to_id}, defaults: { vk_id: data.to_id } });
  let user = await User.findOne({where: {vk_id: data.to_id}});
  let created = false;
  if (user == null && data.from_id != data.to_id) {
    return pre_send(render('error', {error: 'new_user_error', template: random.int(1, 3), user: {id: data.to_id}}), data.user_id)
  }
  if (user == null && data.from_id == data.to_id) {
    created = true;
    user = await User.create({vk_id: data.from_id, money: 0});
  }
  if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let vk_user = await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'});
  let eventt = await Event.findOne({where: {user_id: user.id, event_sys_name: {[Op.or] : ['fap_biba', 'fap_you_biba']} }});
  let ev = { name: "", time: 0 };
  let keyboard;
  let top = await Top.getUsers('profile_biba');
  if (eventt != null) {
    ev.name = render('events', { template: random.int(1, 3), eventt: eventt.event_sys_name });
    ev.time = Math.round(  (eventt.time_exit - Date.now() ) / (1000 * 60) );
  }
  if (created) pre_send(render('register', { template: random.int(1, 5), user: vk_user[0] }), data.user_id)

  if (data.from_id == data.user_id) keyboard = await get_keyboard('MainKeyboard', false);
  else keyboard = await get_keyboard('ProfileKeyboard');
  return pre_send(render('profile', {
    vk_user: vk_user[0], user: user, eventt: ev,
    top: top
  }), data.user_id, { disable_mentions: 1, keyboard: keyboard });
}

exports.statistic = async (data) => {
  if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let top = await User.findOne({
    where: { biba: { [Op.gte]: user.biba }, id: { [Op.ne]: user.id } },
    attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
  });
  let day = Math.round(((((Date.now() - Date.parse(user.createdAt)) / 1000) / 60) / 60) / 24);

  let bibons = await Bibon.findOne({
    order: [ [sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'bibon' ] ],
    group: 'user_id', where: {user_id: user.id}
  });
  let win_bibon = await Bibon.findOne({
    order: [ [sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'bibon' ] ],
    group: 'user_id', where: {user_id: user.id, result: 1}
  });
  let lose_bibon = await Bibon.findOne({
    order: [ [sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'bibon' ] ],
    group: 'user_id', where: {user_id: user.id, result: 0}
  });
  let rec_biba = user.record_biba;

  bot.send(render('profile/stata', {
    bigbons: await BigBibon.count({where: {user_id: user.id}}),
    win_bigbon: await BigBibon.count({where: {user_id: user.id, result: 1}}),
    lose_bigbon: await BigBibon.count({where: {user_id: user.id, result: 0}}),
    sm_plus_bigbon: await BigBibon.sum('biba', {where: {user_id: user.id, result: 1}}),
    sm_minus_bigbon: await BigBibon.sum('biba', {where: {user_id: user.id, result: 0}}),
    day: day,
    record: rec_biba,
    top: top.dataValues.top + 1,
    fap: user.count_fap,
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    bibons: bibons != null ? bibons.dataValues.bibon : 0,
    win_bibon: win_bibon != null ? win_bibon.dataValues.bibon : 0,
    lose_bibon: lose_bibon != null ? lose_bibon.dataValues.bibon : 0,
    sm_plus_bibon: await Bibon.sum('biba', {where: {user_id: user.id, result: 1}}),
    sm_minus_bibon: await Bibon.sum('biba', {where: {user_id: user.id, result: 0}})
  }), data.user_id, {
    disable_mentions: 1,
  });
};

exports.mytop = async (data) => {
  if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let record_biba = await Top.getTop('record_biba', user);
  let biba_top = await Top.getTop('biba_top', user);
  let fap_top = await Top.getTop('fap_top', user);
  let coin_top = await Top.getTop('coin_top', user);
  let local_top = await Top.getTop('biba_top', user);
  let bibon_top = await Top.getTop('bibon_top', user);
  let bigbon_top = await  Top.getTop('bigbon_top', user);

  let users = await User.findAll({order: [ ['biba', 'DESC'] ], limit: 5, offset: local_top})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      biba: users[i].biba
    }
    send_users.push(send)
  }

  pre_send(render('profile/mytop', {
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    biba_top: biba_top,
    record_biba: record_biba,
    fap_top: fap_top,
    coin_top: coin_top,
    users: send_users,
    offset: local_top,
    bibon_top: bibon_top,
    bigbon_top: bigbon_top,
  }), data.user_id, {
    disable_mentions: 1,
  })
}
