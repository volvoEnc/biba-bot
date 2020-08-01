const Op = Sequelize.Op;
exports.gameBlokedToggle = async data => {
    let allow = false;
    if (data.from_id == data.user_id) {
      return await pre_send('Настройки доступны только для бесед', data.user_id);
    }
    let users = null;
    try {
      users = await bot.api('messages.getConversationMembers', {peer_id: data.user_id});
    } catch (e) {
      if (e.error_code == 917) {
        return await pre_send(render('app/errors', { type: 'bot_is_not_admin' }), data.user_id);
      } else { return; }
    }

    if (users == null) {
      return await pre_send('Произошла ошибка', data.user_id);
    } else {
      users.items.forEach(user => {
        if (user.member_id == data.from_id && user.is_admin) {
          allow = true;
        }
      });
    }

    if (!allow) {
      return await pre_send('Только админ беседы может настраивать бота', data.user_id);
    }

    let conversation_id = data.data.object.message.peer_id;
    if (conversation_id == 0 || conversation_id == null || conversation_id == '') {
      return await pre_send('Произошла ошибка', data.user_id);
    }
    let rule = await Rules.getRule(conversation_id, 'gameModeBloked');
    if (rule == null) {
      await Rules.addRule(conversation_id, 'gameModeBloked', true);
      return await pre_send('Игровые функции ограничены для данной беседы', data.user_id);
    } else {
      rule.ruleSetEnable(!rule.enable);
      if (rule.enable) {
        return await pre_send('Игровые функции ограничены для данной беседы', data.user_id);
      } else {
        return await pre_send('Игровые функции включены для данной беседы', data.user_id);
      }
    }
};
