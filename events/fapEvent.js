/*
Name: Завершение фапа
Time: Раз в 10 сек.
Event: Если событие завершения фапа подошло к концу.
*/

// const Op = Sequelize.Op;
//
// setInterval(async () => {
//   eventt = await Event.findOne({where: {
//     time_exit: {
//       [Op.lte]: Date.now()
//     }
//   }});
//   if (eventt != null) {
//     let user = await User.findOne({where: {id: eventt.user_id}});
//     let vk_user = await bot.api('users.get', {user_ids: user.vk_id});
//     let fap_cof = ( Math.round(user.biba) / 5 );
//
//     if (eventt.event_sys_name == 'fap_biba') {
//       let add_dick = Math.round( ( random.int(30, 150) / fap_cof ) ) / 100;
//       let sub_strength = 10;
//       add_dick = user.biba < 1 ? 1 : add_dick;
//
//       user.event_id = null;
//       user.biba += add_dick;
//       user.strength -= user.strength - sub_strength >= 0 ? sub_strength : user.strength;
//       user.save();
//
//       bot.send(render('fap_end', {
//         template: random.int(1, 4),
//         first_name: vk_user[0].first_name,
//         last_name: vk_user[0].last_name,
//         id: user.vk_id,
//         dick: add_dick,
//         fap: 'i'
//       }), eventt.peer_id, {
//         disable_mentions: 0
//       });
//
//     }
//     else if (eventt.event_sys_name == 'fap_you_biba') {
//       let friend = await User.findOne({where: {vk_id: eventt.to_id}});
//
//       let fap_cof = ( Math.round(friend.biba) / 5 );
//       let add_dick = Math.round( ( random.int(60, 300) / fap_cof ) ) / 100;
//       let sub_strength = 10;
//       add_dick = friend.biba < 1 ? 1 : add_dick;
//
//       user.event_id = null;
//       user.strength -= user.strength - sub_strength >= 0 ? sub_strength : user.strength;
//       user.save();
//
//       let vk_friend = await bot.api('users.get', {user_ids: friend.vk_id});
//       friend.biba += add_dick;
//       friend.save();
//
//       bot.send(render('fap_end', {
//         template: random.int(1, 4),
//         first_name: vk_user[0].first_name,
//         last_name: vk_user[0].last_name,
//         id: user.vk_id,
//         dick: add_dick,
//         friend: {
//           id: friend.vk_id,
//           first_name: vk_friend[0].first_name,
//           last_name: vk_friend[0].last_name,
//         },
//         fap: 'you'
//       }), eventt.peer_id, {
//         disable_mentions: 1
//       });
//
//     }
//     eventt.destroy();
//   }
//
//
// }, 10000);
