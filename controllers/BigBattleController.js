const Op = Sequelize.Op;
exports.start = async (data) => {
  let user = await User.findOne({where: {vk_id: data.from_id}});
  let user2;
  let sub_strength = 25;

  // ERRORS

  if (user == null) {
    return bot.send(render('error', {
      error: 'not found', template: random.int(1, 3), user: {id: data.from_id}
    }), data.user_id)
  }

  let bb = await BigBibon.findOne({where: {user_id: user.id, result: null}});
  if (bb != null) { return; }
  bb = await BigBibon.findOne({where: {conversation_id: data.user_id, result: null}});
  if (bb != null) { return; }

  bb = await BigBibon.findOne({where: {user_id: user.id, createdAt: {[Op.gt]: Date.now()}}});
  if (bb != null) {
    return bot.send(render('error', {
      error: 'big_biba_error',
      template: random.int(1, 3),
      time: Math.round((bb.createdAt - Date.now()) / 1000 / 60)
    }), data.user_id);
  }
  if (user.biba < 5) { return pre_send(render('error', {error: 'little_big_bibon', template: random.int(1, 3)}), data.user_id); }
  if (user.strength < sub_strength) {
    return bot.send(render('error', {
      error: 'no_strength_big_bibon',
      template: random.int(1, 3)
    }), data.user_id);
  }
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  // END ERRORS


  user.change_strength(sub_strength, 'sub');
  // user.strength -= sub_strength;
  // user.strength = user.strength >= 0 ? user.strength : 0;
  user.save();
  // Рандомный человек
  if (data.from_id == data.to_id) {
    let count_users = await User.count();
    do {
      let random_user = random.int(0, (count_users - 1));
      user2 = await User.findOne({ offset: random_user });
    } while (user2.id == user.id);
  }
  else {
    user2 = await User.findOne({where: {vk_id: data.to_id}});
  }

  BigBibon.create({
    user_id: user.id,
    opponent_id: user2.id,
    conversation_id: data.user_id,
    createdAt: Date.now() + (1000 * 60 * 60)
  });
  await Event.create({
    user_id: user.id,
    peer_id: data.user_id,
    to_id: data.to_id == data.from_id ? null : data.to_id,
    event_sys_name: 'BigBibon',
    time_exit: Date.now() + 1000 * 5
  });
  return bot.send(render('StartBattle', {
    type: "big_biba",
    template: random.int(1, 3)
  }), data.user_id);
};
