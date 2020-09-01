const Op = Sequelize.Op;
exports.fap = async (data) => {
  bot.api('users.get', {user_ids: data.from_id}).then(res => {
    User.findOne({ where: {vk_id: data.from_id} }).then(async user => {

      if (user == null) {
        return bot.send(render('error', {
          error: 'not found', template: random.int(1, 3), user: {id: data.from_id}
        }), data.user_id)
      }

      let friend_fap = await Event.findOne({where: {to_id: user.vk_id}});
      let eventt = await Event.findOne({where: {user_id: user.id, event_sys_name: {[Op.or] : ['fap_biba', 'fap_you_biba']} }});

      if (eventt != null) {
        bot.send(render('error', {
          error: eventt.event_sys_name,
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id,
          time_exit: Math.round((eventt.time_exit - Date.now()) / 1000 / 60)
        }), data.user_id, {
          disable_mentions: 1
        });
      }

      else if (user.strength < 10) {
        bot.send(render('error', {
          error: 'no strength',
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id
        }), data.user_id, {
          disable_mentions: 1
        });
      }

      else if (await User.checkingSpam(data.user.id, data.user_id)) return;

      else {

        let fap_cof = ( Math.round(user.biba) / 10 );
        let fap_time;

        if (user.biba >= 201){
          fap_time = random.int(14, 16) * fap_cof; // 201 см: 281,4 - 321,6 мин., 300 см: 420 - 480 мин.
        } else if (user.biba >= 101){
          fap_time = random.int(15, 17) * fap_cof; // 101 см: 151,5 - 171,7 мин., 200 см: 300 - 340 мин.
        } else if (user.biba >= 51){
          fap_time = random.int(16, 18) * fap_cof; // 51 см: 81 - 91,8 мин., 100 см: 160 - 180 мин.
        } else if (user.biba >= 26){
          fap_time = random.int(17, 19) * fap_cof; // 26 см: 44,2 - 49,4 мин., 50см: 85 - 95 мин.
        } else {
          fap_time = random.int(18, 20) * fap_cof; // 5 см: 9 - 10 мин., 25 см: 45 - 50 мин.
        }

        let sub_strength = 5;
        fap_time = fap_time < 1 ? 1 : Math.round(fap_time);
        user.change_strength(sub_strength, 'sub');

        let eventt;
        if (data.to_id == data.from_id || data.to_id < 0) {
          eventt = await Event.create({
            user_id: user.id,
            peer_id: data.user_id,
            event_name: "Drochit bibu",
            event_sys_name: 'fap_biba',
            time_exit: Date.now() + fap_time * 60 * 1000
          });

          bot.send(render('fap', {
            time: fap_time,
            template: random.int(1, 14),
            first_name: res[0].first_name,
            last_name: res[0].last_name,
            id: data.from_id,
            fap: 'i'
          }), data.user_id, {
            disable_mentions: 1
          });

        }
        else {

          let friend_fap = await User.findOne({where: {vk_id: data.to_id}});
          // if (friend_fap.event_id != null) {
          //   bot.send(render('error', {
          //     error: 'friend_not_allowed',
          //     template: random.int(1, 3),
          //     first_name: res[0].first_name,
          //     last_name: res[0].last_name,
          //     id: data.from_id
          //   }), data.user_id, {
          //     disable_mentions: 1
          //   });
          // } else {

            let user2 = await User.findOne({where: {vk_id: data.to_id}})
            let sub_strength = 10;
            let fap_cof = ( Math.round(user2.biba) / 10 );

            if (user.biba >= 201){
              fap_time = random.int(16, 18) * fap_cof;
            } else if (user.biba >= 101){
              fap_time = random.int(17, 19) * fap_cof;
            } else if (user.biba >= 51){
             fap_time = random.int(18, 20) * fap_cof;
           } else if (user.biba >= 26){
             fap_time = random.int(19, 21) * fap_cof;
           } else {
              fap_time = random.int(22, 23) * fap_cof;
            }

            fap_time = fap_time < 1 ? 1 : Math.round(fap_time);
            user.change_strength(sub_strength, 'sub');

            eventt = await Event.create({
              user_id: user.id,
              to_id: data.to_id,
              peer_id: data.user_id,
              event_sys_name: 'fap_you_biba',
              time_exit: Date.now() + fap_time * 60 * 1000
            });

            bot.api('users.get', {user_ids: data.to_id, name_case: 'dat'}).then(async res2 => {

              bot.send(render('fap', {
                time: fap_time,
                template: random.int(1, 14),
                first_name: res[0].first_name,
                last_name: res[0].last_name,
                id: data.from_id,
                fap: 'you',
                f_first_name: res2[0].first_name,
                f_last_name: res2[0].last_name,
                f_id: data.to_id
              }), data.user_id, {
                disable_mentions: 1
              });
            });
        }
        user.event_id = eventt.id
        user.save();
      }
    })
  })

}
