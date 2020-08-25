exports.index = async (eventt) => {
  let bb = await BigBibon.findOne({where: {
      user_id: eventt.user_id,
      result: null
    }});
  let user = await User.findOne({where: {id: bb.user_id}});
  let user2 = await User.findOne({where: {id: bb.opponent_id}});

  //START
  if (bb.step == 'start') {
    bb.step = 1;
    await bb.save();
    await Event.create({
      user_id: user.id,
      peer_id: eventt.peer_id,
      to_id: user2.id,
      event_sys_name: 'BigBibon',
      time_exit: Date.now() + 1000 * 3
    });
    return pre_send(render('big_biba/start', {
      template: random.int(1, 5),
      user1: (await bot.api('users.get', {user_ids: user.vk_id}))[0],
      user2: (await bot.api('users.get', {user_ids: user2.vk_id, name_case: 'acc'}))[0]
    }), eventt.peer_id, { disable_mentions: 1 });
  }
  //END
  if (bb.step == 'end') {
    let u;
    let user_biba;
    bb.result = 1;
    if (bb.user_hp <= 0) { u = user; user = user2; user2 = u; bb.result = 0;}
    await bb.save();

    if (bb.opponent_hp <= 0) {
      user.biba += bb.biba;
      user_biba = user.biba;
      user.money += bb.money
    }
    else {
      user2.biba -= bb.biba;
      user2.biba = user2.biba < 0 ? 0 : user2.biba;
      user_biba = user2.biba;
    }
    user_biba = Math.round(user_biba * 100) / 100;

    pre_send(render('big_biba/end', {
      template: random.int(1, 5),
      user1: (await bot.api('users.get', {user_ids: user.vk_id}))[0],
      user2: (await bot.api('users.get', {user_ids: user2.vk_id, name_case: 'acc'}))[0],
      biba: bb.biba,
      user_biba: user_biba,
      money: bb.money,
      result: bb.result
    }), eventt.peer_id, { disable_mentions: 1 });
    await user.biba_record();
    await user.save();
    await user2.save();
    return;
  }


  // Action
  if (bb.step % 2 != 0) {
    pre_send(render(`big_biba/step_${bb.step}`, {
      template: random.int(1, 5),
      user1: (await bot.api('users.get', {user_ids: user.vk_id}))[0],
      user2: (await bot.api('users.get', {user_ids: user2.vk_id, name_case: 'dat'}))[0],
    }), eventt.peer_id, {disable_mentions: 1});
    await Event.create({
      user_id: user.id,
      peer_id: eventt.peer_id,
      to_id: user2.id,
      event_sys_name: 'BigBibon',
      time_exit: Date.now() + 1000 * 5
    });
    bb.step++;
    await bb.save();
    return;
  }

  // Results
  if (bb.step % 2 == 0) {
    let rnb_hp = random.int(35, 75);
    let result = random.int(0, 1000);
    if (result > 500) bb.opponent_hp -= rnb_hp;
    else bb.user_hp -= rnb_hp;
    pre_send(render(`big_biba/step_${bb.step}`, {
      template: random.int(1, 5),
      user1: Object.assign((await bot.api('users.get', {user_ids: user.vk_id, name_case: 'dat'}))[0], {hp: rnb_hp}),
      user2: Object.assign((await bot.api('users.get', {user_ids: user2.vk_id, name_case: 'nom'}))[0], {hp: rnb_hp}),
      type: result > 500 ? 'win' : 'lose'
    }), eventt.peer_id, {disable_mentions: 1});


    // END Action
    if (bb.opponent_hp <= 0 || bb.user_hp <= 0) {
      await Event.create({
        user_id: user.id,
        peer_id: eventt.peer_id,
        to_id: user2.id,
        event_sys_name: 'BigBibon',
        time_exit: Date.now() + 1000 * 3
      });
      bb.step = 'end';
      bb.money = bb.opponent_hp <= 0 ? random.int(1, 5) : 0;
      bb.biba = (random.int(150, 300) / 100);
      await bb.save();
      return;
    } else {
      await Event.create({
        user_id: user.id,
        peer_id: eventt.peer_id,
        to_id: user2.id,
        event_sys_name: 'BigBibon',
        time_exit: Date.now() + 1000 * 7
      });
      bb.step++;
      await bb.save();
      return;
    }
  }

  return pre_send('Событие начала бигбибона', eventt.peer_id);
};
