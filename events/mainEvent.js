const Op = Sequelize.Op;
setInterval(async () => {
  events = await Event.findAll({where: { time_exit: { [Op.lte]: Date.now() }}});
  events.forEach(async (occasion, i) => {
    actions[occasion.event_sys_name + 'Action'].index(occasion);
    occasion.destroy();
  });
}, 1000);

setInterval(async () => {
  if (global.stack_messages[0] != null) {
    let msg = global.stack_messages[0];
    global.stack_messages.splice(0, 1);
    send(msg.content, msg.send_id, msg.param);
  }
}, 100);
