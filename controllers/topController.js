exports.bibs = async (data) => {
  let users = await User.findAll({order: [ ['biba', 'DESC'] ], limit: 10})
  let ids = [];
  users.forEach(user => { ids.push(user.vk_id); });

  let vk_users = await bot.api('users.get', {user_ids: ids});
  let send_users = [];

  for (var i = 0; i < vk_users.length; i++) {
    let send = {
      id: users[i].vk_id,
      first_name: vk_users[i].first_name,
      last_name: vk_users[i].last_name,
      biba: users[i].biba
    }
    send_users.push(send)
  }
  bot.send(render('rating', {
    users: send_users
  }), data.user_id, {
    disable_mentions: 1
  })
};
