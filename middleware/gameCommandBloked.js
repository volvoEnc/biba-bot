exports.execute = async data => {
  if (data.from_id == data.user_id) return true;

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
      if (checkController == name) {
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
  return !bloked;
}
