setInterval(async () => {
  let users = await Conversation.findAll();
  let events = await Event.findAll({where: {event_sys_name: 'subBiba'}});

  events.forEach((eventt, i) => {
    users.forEach((user, z) => {
      if (eventt.user_id == user.user_id) { users.splice(z, 1) }
    });
  });

  for (let user of users) {
    try {
      await Event.create({
        user_id: Number(user.user_id),
        peer_id: user.conversation_id,
        event_sys_name: 'subBiba',
        time_exit: Date.now() + (1000 * 60 * 60 * 48) + random.int(1, 50)
      });
    } catch (e) {
        console.log(e);
      }
  }
}, 1000 * 60);
