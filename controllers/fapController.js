exports.fap = async (data) => {
  bot.api('users.get', {user_ids: data.from_id}).then(res => {
    User.findOne({ where: {vk_id: data.from_id} }).then(async user => {

      if (user == null) {
        return bot.send(render('error', {
          error: 'not found',
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id
        }), data.user_id)
      }
      let friend_fap = await Event.findOne({where: {to_id: user.vk_id}});
      // if (friend_fap != null) {
      //   return bot.send(render('error', {
      //     error: 'fap_you_error',
      //     template: random.int(1, 3),
      //     first_name: res[0].first_name,
      //     last_name: res[0].last_name,
      //     id: data.from_id
      //   }), data.user_id)
      // }


      if (user.event_id != null) {

        let eventt = await Event.findOne({where: {id: user.event_id}});

        bot.send(render('error', {
          error: eventt.event_sys_name,
          template: random.int(1, 3),
          first_name: res[0].first_name,
          last_name: res[0].last_name,
          id: data.from_id
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


      else {

        let fap_cof = ( Math.round(user.biba) / 10 );
        let fap_time = random.int(40, 60) * fap_cof;
        fap_time = fap_time < 1 ? 1 : Math.round(fap_time);


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
            template: random.int(1, 10),
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

            let fap_cof = ( Math.round(user2.biba) / 10 );
            let fap_time = random.int(50, 70) * fap_cof;
            fap_time = fap_time < 1 ? 1 : Math.round(fap_time);



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
                template: random.int(1, 10),
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
          // }
        }
        user.event_id = eventt.id
        user.save();
      }
    })
  })

}
