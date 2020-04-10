exports.fap = async (data) => {
  bot.api('users.get', {user_ids: data.from_id}).then(res => {
    User.findOne({ where: {vk_id: data.from_id} }).then(async user => {
      if (user == null) {
        bot.send(render('error', {
          error: 'not found',
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id
        }), data.user_id)
      }

      else if (user.event_id != null) {

        let eventt = await Event.findOne({where: {id: user.event_id}});

        bot.send(render('error', {
          error: eventt.event_sys_name,
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id
        }), data.user_id)
      }
      else {

        fap_time = random.int(1, 5);

        let eventt;
        if (data.to_id == data.from_id) {
          eventt = await Event.create({
            user_id: user.id,
            peer_id: data.user_id,
            event_name: "Drochit bibu",
            event_sys_name: 'fap_biba',
            time_exit: Date.now() + fap_time * 60 * 1000
          });

          bot.send(render('fap', {
            time: fap_time,
            template: random.int(1, 10),
            first_name: res[0].first_name,
            last_name: res[0].last_name,
            id: data.to_id,
            fap: 'i'
          }), data.user_id)

        }
        else {
          eventt = await Event.create({
            user_id: user.id,
            to_id: data.to_id,
            peer_id: data.user_id,
            event_name: "Drochit bibu",
            event_sys_name: 'fap_you_biba',
            time_exit: Date.now() + fap_time * 60 * 1000
          });

          bot.api('users.get', {user_ids: data.to_id, name_case: 'dat'}).then(res2 => {
            bot.send(render('fap', {
              time: fap_time,
              template: random.int(1, 5),
              first_name: res[0].first_name,
              last_name: res[0].last_name,
              id: data.to_id,
              fap: 'you',
              f_first_name: res2[0].first_name,
              f_last_name: res2[0].last_name,
              f_id: data.to_id
            }), data.user_id)
          });

        }
        user.event_id = eventt.id
        user.save();
      }
    })
  })

}
