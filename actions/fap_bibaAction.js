exports.index = async (occasion) => {
  let user = await User.findOne({where: {id: occasion.user_id}});
  let vk_user = await bot.api('users.get', {user_ids: user.vk_id});

  let fap_cof = ( Math.round(user.biba) / 5 );
  fap_cof = fap_cof < 0.5 ? 0.5 : fap_cof;
  let add_dick = Math.round( ( random.int(200, 500) / fap_cof ) ) / 100;
  add_dick = user.biba < 1 ? 1 : add_dick;
  let sub_strength = 10;

  user.event_id = null;
  user.strength -= user.strength - sub_strength >= 0 ? sub_strength : user.strength;
  user.count_fap++;

  if (occasion.event_sys_name == 'fap_biba') {
    user.biba += add_dick;
    bot.send(render('fap_end', {
      template: random.int(1, 10),
      first_name: vk_user[0].first_name,
      last_name: vk_user[0].last_name,
      id: user.vk_id,
      dick: add_dick,
      fap: 'i'
    }), occasion.peer_id);
  }
  else {
    let friend = await User.findOne({where: {vk_id: occasion.to_id}});
    let vk_friend = await bot.api('users.get', {user_ids: friend.vk_id});
    fap_cof = ( Math.round(friend.biba) / 5 );
    fap_cof = fap_cof < 0.5 ? 0.5 : fap_cof;
    add_dick = Math.round( ( random.int(50, 200) / fap_cof ) ) / 100;
    friend.biba += add_dick;
    friend.save();
    bot.send(render('fap_end', {
      template: random.int(1, 10),
      first_name: vk_user[0].first_name,
      last_name: vk_user[0].last_name,
      id: user.vk_id,
      dick: add_dick,
      friend: vk_friend[0],
      fap: 'you'
    }), occasion.peer_id, {
      disable_mentions: 1
    });
  }
  return user.save();
};
