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
// exports.profile = async (data) => {
//   User.findOrCreate({
//     where: {vk_id: data.to_id},
//     defaults: { vk_id: data.to_id }
//   }).then(([user, created]) => {
//     if (created) {
//       bot.api('users.get', {user_ids: data.to_id}).then(res => {
//         bot.send(render('register', {
//           template: random.int(1, 5),
//           first_name: res[0].first_name,
//           last_name: res[0].last_name,
//           id: data.to_id
//         }), data.user_id)
//       })
//     } else {
//       bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}).then(async res => {
//         let ev = { name: "", time: 0 }
//         if (user.event_id != null) {
//           let eventt = await Event.findOne({where: {id: user.event_id}});
//           ev.name = render('events', {
//             template: random.int(1, 3),
//             eventt: eventt.event_sys_name
//           });
//           ev.time = Math.round(  (eventt.time_exit - Date.now() ) / (1000 * 60) )
//         }
//         pre_send(render('profile', {
//           vk_user: res[0],
//           user: user,
//           top: await User.findOne({order: [ ['biba', 'DESC'] ], offset: 9}),
//           eventt: ev
//         }), data.user_id, {
//           disable_mentions: 1,
//           keyboard: await get_keyboard('ProfileKeyboard')
//         });
//       });
//     }
//   });
// }
exports.profile = async (data) => {
  let [user, created] = await User.findOrCreate({ where: {vk_id: data.to_id}, defaults: { vk_id: data.to_id } });
  let vk_user = await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'});
  let eventt = await Event.findOne({where: {user_id: user.id, event_sys_name: {[Op.or] : ['fap_biba', 'fap_you_biba']} }});
  let ev = { name: "", time: 0 };
  if (eventt != null) {
    ev.name = render('events', { template: random.int(1, 3), eventt: eventt.event_sys_name });
    ev.time = Math.round(  (eventt.time_exit - Date.now() ) / (1000 * 60) );
  }
  if (created)
    pre_send(render('register', { template: random.int(1, 5), user: vk_user[0] }), data.user_id)
  return pre_send(render('profile', {
    vk_user: vk_user[0], user: user, eventt: ev,
    top: await User.findOne({order: [ ['biba', 'DESC'] ], offset: 9})
  }), data.user_id, { disable_mentions: 1, keyboard: await get_keyboard('ProfileKeyboard') });
}


exports.statistic = async (data) => {
  let user = await User.findOne({ where: {vk_id: data.to_id} });
  let top = await User.findOne({
    where: { biba: { [Op.gte]: user.biba }, id: { [Op.ne]: user.id } },
    attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'top'] ]
  });
  let day = Math.round(((((Date.now() - Date.parse(user.createdAt)) / 1000) / 60) / 60) / 24);

  bot.send(render('profile/stata', {
    day: day,
    top: top.dataValues.top + 1,
    fap: user.count_fap,
    user: (await bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}))[0]
  }), data.user_id, {
    disable_mentions: 1,
  });
};
