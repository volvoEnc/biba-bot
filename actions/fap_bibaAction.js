exports.index = async (occasion) => {
  let user = await User.findOne({where: {id: occasion.user_id}});
  let vk_user = await bot.api('users.get', {user_ids: user.vk_id});

  // let fap_cof = ( Math.round(user.biba) / 5 );
  // fap_cof = fap_cof < 0.5 ? 0.5 : fap_cof;
  // let add_dick = Math.round( ( random.int(200, 500) / fap_cof ) ) / 100;
  // add_dick = user.biba < 1 ? 2 : add_dick;

  let fap_cof = ( Math.round(user.biba) / 100 + (user.count_fap / 200));
  fap_cof = fap_cof < 0.4 ? 0.4 : fap_cof;
  let add_dick = Math.round( ( random.int(100, 200) / 100 ))+ fap_cof;


  user.event_id = null;
  user.count_fap++;

  if (occasion.event_sys_name == 'fap_biba') {
    user.biba += add_dick;
    pre_send(render('fap_end', {
      template: random.int(1, 14),
      first_name: vk_user[0].first_name,
      last_name: vk_user[0].last_name,
      id: user.vk_id,
      dick: Math.abs(add_dick),
      fap: 'i'
    }), occasion.peer_id);
  }
  else {
    let friend = await User.findOne({where: {vk_id: occasion.to_id}});
    let vk_friend = await bot.api('users.get', {user_ids: friend.vk_id});

    // fap_cof = ( Math.round(friend.biba) / 5 );
    // fap_cof = fap_cof < 0.5 ? 0.5 : fap_cof;
    // add_dick = Math.round( ( random.int(50, 200) / fap_cof ) ) / 100;

    let fap_cof = ( Math.round(user.biba) / 150 );
    fap_cof = fap_cof < 0.13 ? 0.13 : fap_cof;
    let add_dick = Math.round( ( random.int(50, 100) / 100 )) + fap_cof;

    friend.biba += add_dick;
    friend.save();
    let add_money = random.int(-10, 3);
    add_money = add_money < 0 ? 0 : add_money;
    user.money += add_money;
    pre_send(render('fap_end', {
      template: random.int(1, 14),
      first_name: vk_user[0].first_name,
      last_name: vk_user[0].last_name,
      id: user.vk_id,
      dick: Math.abs(add_dick),
      friend: vk_friend[0],
      fap: 'you',
      money: add_money
    }), occasion.peer_id, { disable_mentions: 1 });
  }
  await user.biba_record();
  return user.save();
};
