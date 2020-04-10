const Op = Sequelize.Op;

setInterval(async () => {
  eventt = await Event.findOne({where: {
    time_exit: {
      [Op.lte]: Date.now()
    }
  }});
  if (eventt != null) {
    let user = await User.findOne({where: {id: eventt.user_id}});
    let vk_user = await bot.api('users.get', {user_ids: user.vk_id});

    if (eventt.event_sys_name == 'fap_biba') {
      let add_dick = random.int(1, 50) / 100;

      user.event_id = null;
      user.biba += add_dick;
      user.save();
      eventt.destroy();

      bot.send(render('fap_end', {
        template: random.int(1, 4),
        first_name: vk_user[0].first_name,
        last_name: vk_user[0].last_name,
        id: user.vk_id,
        dick: add_dick
      }), eventt.peer_id)
    }
  }


}, 10000);
