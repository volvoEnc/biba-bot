setInterval(async () => {
  let users = await Conversation.findAll();
  let events = await Event.findAll({where: {event_sys_name: 'subBiba'}});

  events.forEach((eventt, i) => {
    users.forEach((user, z) => {
      if (eventt.user_id == user.user_id) { users.splice(z, 1) }
    });
  });

  users.forEach(async user => {
    console.log(user.user_id);
    await Event.create({
      user_id: user.user_id,
      peer_id: user.conversation_id,
      event_sys_name: 'subBiba',
      time_exit: Date.now() + (1000 * 60 * 60 * 72) + random.int(1, 50)
    });
  });


}, 1000 * 60);
