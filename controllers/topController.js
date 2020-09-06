exports.bibs = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let users = await User.findAll({order: [ ['biba', 'DESC'] ], limit: 10})
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
  pre_send(render('rating/rating', { users: send_users }), data.user_id, { disable_mentions: 1 });
};

exports.faps = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let users = await User.findAll({order: [ ['count_fap', 'DESC'] ], limit: 10})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      fap: users[i].count_fap
    }
    send_users.push(send)
  }
  pre_send(render('rating/fap_rating', { users: send_users }), data.user_id, { disable_mentions: 1 });
};

exports.coin = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let users = await User.findAll({order: [ ['money', 'DESC'] ], limit: 10})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      coin: users[i].money
    }
    send_users.push(send)
  }
  pre_send(render('rating/coins_rating', { users: send_users }), data.user_id, { disable_mentions: 1 });
};

exports.bibon = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let bibons = await Bibon.findAll({
    order: [ [sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'bibon' ] ],
    group: 'user_id', limit: 10, include: [User]
  });
  let ids = [];
  bibons.forEach(bibon => { ids.push(bibon.user.vk_id); });
  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];
  for (let i = 0; i < vk_users.length; i++) {
    let send = Object.assign(vk_users[i], {bibons: bibons[i].dataValues.bibon});
    send_users.push(send)
  }
  pre_send(render('rating/bibons_rating', { users: send_users }), data.user_id, { disable_mentions: 1 })
};

exports.bigbon = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let big_bibons = await BigBibon.findAll({
    order: [ [sequelize.fn('COUNT', sequelize.col('big_bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('big_bibon.biba')), 'big_bibon' ] ],
    group: 'user_id', limit: 10, include: [User]
  });
  let ids = [];
  big_bibons.forEach(big_bibon => { ids.push(big_bibon.user.vk_id); });
  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];
  for (let i = 0; i < vk_users.length; i++) {
    let send = Object.assign(vk_users[i], {big_bibons: big_bibons[i].dataValues.big_bibon});
    send_users.push(send)
  }
  pre_send(render('rating/bigbons_rating', { users: send_users }), data.user_id, { disable_mentions: 1 })
};

exports.record = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  let users = await User.findAll({order: [ ['record_biba', 'DESC'] ], limit: 10})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      record: users[i].record_biba
    }
    send_users.push(send)
  }
  pre_send(render('rating/record_rating', { users: send_users }), data.user_id, { disable_mentions: 1 });
};

exports.tops = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  if (await User.theCommandIsDisabledHere(2, data.user_id, data.from_id)) return;
  data.check_spam = false;

  await MainRouter.modules.topController.record(data);
  await MainRouter.modules.topController.bibs(data);
  await MainRouter.modules.topController.faps(data);
  await MainRouter.modules.topController.bibon(data);
  await MainRouter.modules.topController.bigbon(data);
  await MainRouter.modules.topController.coin(data);
}

exports.local_tops = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;
  if (await User.theCommandIsDisabledHere(2, data.user_id, data.from_id)) return;
  data.check_spam = false;

  await MainRouter.modules.topController.local_record(data);
  await MainRouter.modules.topController.local_biba(data);
  await MainRouter.modules.topController.local_fap(data);
  await MainRouter.modules.topController.local_bibon(data);
  await MainRouter.modules.topController.local_bigbon(data);
  await MainRouter.modules.topController.local_money(data);
}

exports.local_biba = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('biba_top', user));

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

  pre_send(render('rating/local_rating', {
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    users: send_users,
    offset: local_top,
  }), data.user_id, {
    disable_mentions: 1,
  })
}

exports.local_fap = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('fap_top', user));

  let users = await User.findAll({order: [ ['count_fap', 'DESC'] ], limit: 5, offset: local_top})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      count_fap: users[i].count_fap
    }
    send_users.push(send)
  }

  pre_send(render('rating/local_fap_rating', {
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    users: send_users,
    offset: local_top,
  }), data.user_id, {
    disable_mentions: 1,
  })
}

exports.local_money = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('coin_top', user));

  let users = await User.findAll({order: [ ['money', 'DESC'] ], limit: 5, offset: local_top})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      money: users[i].count_fap
    }
    send_users.push(send)
  }

  pre_send(render('rating/local_coins_rating', {
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    users: send_users,
    offset: local_top,
  }), data.user_id, {
    disable_mentions: 1,
  })
}

exports.local_record = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('record_biba', user));

  let users = await User.findAll({order: [ ['record_biba', 'DESC'] ], limit: 5, offset: local_top})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (let i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      record_biba: users[i].record_biba
    }
    send_users.push(send)
  }

  pre_send(render('rating/local_record_rating', {
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0],
    users: send_users,
    offset: local_top,
  }), data.user_id, {
    disable_mentions: 1,
  })
}

exports.local_bibon = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('bibon_top', user));

  let bibons = await Bibon.findAll({
    order: [ [sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('bibon.biba')), 'bibon' ] ],
    group: 'user_id', limit: 5, include: [User], offset: local_top
  });
  let ids = [];
  bibons.forEach(bibon => { ids.push(bibon.user.vk_id); });
  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];
  for (let i = 0; i < vk_users.length; i++) {
    let send = Object.assign(vk_users[i], {bibons: bibons[i].dataValues.bibon});
    send_users.push(send)
  }
  pre_send(render('rating/local_bibons_rating', {
    users: send_users,
    offset: local_top
  }), data.user_id, { disable_mentions: 1 })
}

exports.local_bigbon = async (data) => {
  if (data.check_spam) if (await User.checkingSpam(data.user.id, data.user_id)) return;

  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let local_top = await Top.getLocalTop(await Top.getTop('bibon_top', user));

  let big_bibons = await BigBibon.findAll({
    order: [ [sequelize.fn('COUNT', sequelize.col('big_bibon.biba')), 'DESC'] ],
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('big_bibon.biba')), 'big_bibon' ] ],
    group: 'user_id', limit: 5, include: [User], offset: local_top
  });
  let ids = [];
  big_bibons.forEach(big_bibon => { ids.push(big_bibon.user.vk_id); });
  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];
  for (let i = 0; i < vk_users.length; i++) {
    let send = Object.assign(vk_users[i], {big_bibons: big_bibons[i].dataValues.big_bibon});
    send_users.push(send)
  }
  pre_send(render('rating/local_bigbons_rating', {
    users: send_users,
    offset: local_top
  }), data.user_id, { disable_mentions: 1 })
}