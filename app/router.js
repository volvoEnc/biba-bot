module.exports = class Router {
  constructor() {
    this.modules = [];
    this.routes = require('../routes/command.js');
    this.sessionRoutes = require('../routes/session.js');
    this.actionRoutes = require('../routes/actions.js');
    this.init();
    this.destroy_session = true;
  }
  async run(data) {

    if (!await middleware_execute(data, true)) {
      return false;
    }

    this.destroy_session = true;
    let payload = data.object.message.payload;
    let command;
    if (data.object.message.from_id < 0) return; // Сообщение от бота

    if (data.object.message.from_id != data.object.message.peer_id && data.type == 'message_new') {
      await SocketService.sendMessage(data.object.message);
    }

    if (data.object.message.action != null) {
      if (data.object.message.action.type == 'chat_invite_user' && data.object.message.action.member_id == -process.env.VK_API_GROUP_ID) {
        await this.modules.mainController.invite_chat();
      }
    }
    let user = await User.getUser(data.object.message.from_id);
    if (user == null) {
      // Это тот случай, когда у нас несколько сообщений подряд, а пользователь еще не создан
      // Тогда сообщения обрабатываются быстрее чем вставка в базу и появлялись дубли
      return await pre_send(await render('app/errors', {type: 'biba_conflict'}, data), data.object.message.from_id)
    }
    await user.updateActive();

    if (payload == undefined) command = data.object.message.text.toLowerCase();
    else command = (JSON.parse(payload)).content;

    let isSessionCommand = false;
    let isActionCommand = false;
    if (user !== null) {
      let sessionCommand = await Session.getRouteSession(user.id);
      if (sessionCommand !== null) {
        command = sessionCommand.name;
        isSessionCommand = true;
      }
    }
    socketIo.emit('message', {text: command});

    let routes = isSessionCommand ? this.sessionRoutes : this.routes;
    if (data.object.message.action !== undefined) {
      command = data.object.message.action.type;
      routes = this.actionRoutes;
      isActionCommand = true;
    }

    for (let route of routes) {
      let reg = new RegExp(route.command, 'i');
      if (reg.test(command)) {
        let controller = route.controller.split('@');
        let options = {
          controller: {
            name: controller[0],
            method: controller[1]
          },
          command: command,
          user_id: data.object.message.peer_id,
          from_id: data.object.message.from_id,
          user: user,
          user_data: data.object.message.text.toLowerCase(),
          data: data,
          alias: route.name,
          check_spam: true,
          isAction: isActionCommand
        };
        let toreg = new RegExp("(-[0-9]|[0-9])+", 'i');
        if (data.object.message.reply_message != undefined) {
          options['reply_message'] = data.object.message.reply_message;
          options['to_id'] = data.object.message.reply_message.from_id;
        }
        else if (command.match(toreg) != null) {
          options['to_id'] = command.match(toreg)[0];
        }
        else {
          options['to_id'] = data.object.message.from_id;
        }
        options['to_id'] = (options['to_id'] == process.env.VK_API_GROUP_ID || options['to_id'] == -process.env.VK_API_GROUP_ID) ? data.object.message.from_id : options['to_id'];
        this.modules.mainController.conversation(options);
        global.conversation_message_id = data.object.message.conversation_message_id;

        if (!await middleware_execute(options, false)) {
          return false;
        }

        this.modules[controller[0]][controller[1]](options);
        this.destroy_session = false;
        break;
      }
    }
    if (user != null && user.session != null && this.destroy_session === true) {
      await user.destroy_session();
      await this.run(data);
    }
  }
  init() {
    let success_module = ['mainController'];
    this.modules['mainController'] = require(`../controllers/mainController.js`);
    this.routes.forEach(route => {
      let name_controller = route.controller.split('@')[0];
      if (success_module.indexOf(name_controller) == -1) {
        success_module.push(name_controller);
        this.modules[name_controller] = require(`../controllers/${name_controller}.js`);
      }
    });
  }
};
