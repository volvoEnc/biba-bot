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
  if (data.to_id < 0) {
    return bot.send('Так делать нельзя!', data.user_id);
  }
  User.findOrCreate({
    where: {vk_id: data.to_id},
    defaults: {
      vk_id: data.to_id
    }
  }).then(([user, created]) => {
    if (created) {
      bot.api('users.get', {user_ids: data.to_id}).then(res => {
        bot.send(render('register', {
          template: random.int(1, 5),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.to_id
        }), data.user_id)
      })
    } else {
      bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}).then(async res => {
        if (user.event_id == null) {
          bot.send(render('profile', {
            first_name: res[0].first_name,
            last_name: res[0].last_name,
            id: data.to_id,
            biba: user.biba,
            power: user.strength,
            max_power: user.max_strength,
            eventt: {
              name: "",
              time: 0
            },
          }), data.user_id, {
            disable_mentions: 1
          });
        } else {
          let eventt = await Event.findOne({where: {id: user.event_id}});
          let event_name = render('events', {
            template: random.int(1, 3),
            eventt: eventt.event_sys_name
          });

          bot.send(render('profile', {
            first_name: res[0].first_name,
            last_name: res[0].last_name,
            id: data.to_id,
            biba: user.biba,
            power: user.strength,
            max_power: user.max_strength,
            eventt: {
              name: event_name,
              time: Math.round(  (eventt.time_exit - Date.now() ) / (1000 * 60) )
            },
          }), data.user_id, {
            disable_mentions: 1
          });

        }
      });
    }
  });
}
