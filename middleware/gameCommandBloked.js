/**
 * Если false, то выполняется только при команде
 * Объект data как в контроллере
 */
exports.is_all = async () => {
  return false;
}
/**
 * Проверка на доступность игровых комманд в беседе
 * Если недоступны, то пишем ошибку в беседу - 1 раз в 2 минуты, чтобы ошибками не спамили
 *
 * Используемые сессии: blockedCommandSpamControl = 2min
 */
exports.execute = async data => {
  if (data.from_id === data.user_id) return true;

  let bloked = false;
  let checkController = data.controller.name;
  let checkMethod = data.controller.method;
  let bloked_commands = [
    'tops', 'profiles', 'profile', 'fap'
  ];
  let bloked_controlles = [
    'BigBattleController', 'battleController',
    'topController'
  ];

  let conversation_id = data.user_id;
  let rule = await Rules.getRule(conversation_id, 'gameModeBloked');

  if (rule != null && rule.enable == 1) {
    bloked_controlles.forEach(name => {
      if (checkController === name) {
        bloked = true;
      }
    });
    if (!bloked) {
      bloked_commands.forEach(name => {
        if (checkMethod == name) {
          bloked = true;
        }
      });
    }
  }
  if (bloked) {
    if (!await Session.isExists(data.from_id, 'blockedCommandSpamControl')) {
      await pre_send(await render('app/errors', {type: 'command_blocked'}, data), data.user_id);
      await Session.add(data.from_id, 'blockedCommandSpamControl', '', false, 120);
    }
    return false;
  }
  return true;
}
