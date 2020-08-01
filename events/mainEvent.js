const Op = Sequelize.Op;
//Обработка событий
setInterval(async () => {
  events = await Event.findAll({where: { time_exit: { [Op.lte]: Date.now() }}});
  events.forEach(async (occasion, i) => {
    actions[occasion.event_sys_name + 'Action'].index(occasion);
    occasion.destroy();
  });
}, 1000);
//Отправка сообщений вк в порядке очереди
setInterval(async () => {
  if (global.stack_messages[0] != null) {
    let msg = global.stack_messages[0];
    global.stack_messages.splice(0, 1);
    let res = await send(msg.content, msg.send_id, msg.param);
    if (res !== true && msg.attempt < 5) {
      msg.attempt++;
      console.log("Произошла ошибка, пробуем снова!");
      console.log(res);
      global.stack_messages.push({
        send_id: msg.send_id,
        content: msg.content,
        param: msg.param,
        attempt: msg.attempt
      });
    }
  }
}, 100);
