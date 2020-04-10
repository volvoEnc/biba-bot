module.exports = class Router {
  constructor() {
    this.modules = [];
    this.routes = require('../routes.js');
    this.init();
  }

  run(data) {
    const command = data.object.message.text.toLowerCase();
    console.log(command);
    // TODO: payload

    for (let route of this.routes) {
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
          data: data
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
        this.modules[controller[0]][controller[1]](options);
        access = false;
        break;
      }
    }
  }
  init() {
    let success_module = [];
    this.routes.forEach(route => {
      let name_controller = route.controller.split('@')[0];
      if (success_module.indexOf(name_controller) == -1) {
        success_module.push(name_controller);
        this.modules[name_controller] = require(`../controllers/${name_controller}.js`);
      }
    });
  }
};
