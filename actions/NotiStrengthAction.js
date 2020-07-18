exports.index = async (data) => {
  let user = await User.findOne({where: {id: data.user_id}});
  if (user.strength >= user.max_strength)
    return pre_send(render('profile/notifications', {
      notifications: "strength_full",
      template: random.int(1, 5),
      user: (await bot.api('users.get', {user_ids: user.vk_id}))[0]
    }), data.peer_id);
  else
    Event.create({
      user_id: data.user_id,
      event_sys_name: 'NotiStrength',
      peer_id: data.peer_id,
      time_exit: Date.now() + 1000 * 60
    });
};
