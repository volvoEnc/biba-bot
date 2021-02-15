const Op = Sequelize.Op;
const Model = Sequelize.Model;
class User extends Model {


  /**
   * Изменение количества дроч-коинов у пользователя.
   *
   * @param {int} money
   * @returns {Promise<boolean>}
   */
  async changeMoney(money) {
    let previewMoney = this.money;
    this.money += money;
    if (this.money < 0) {
      this.money = previewMoney;
      return false;
    }
    await this.save();
    return true;
  }

  /**
   * Получить количество дней АФК у пользователя
   *
   * @returns {Promise<int>}
   */
  async getInactiveDays() {
    let user = await User.findOne({
      attributes: ['updatedAt'],
      where: {id: this.id}
    });
    let date1 = new Date(user.dataValues.updatedAt);
    let date2 = new Date();

    return Math.floor((date2 - date1) / 1000 / 60 / 60 / 24);
  }

  /**
   * Обновление даты последней активности у пользователя
   *
   * @returns {Promise<array>} успешность выполенения
   */
  async updateActive () {
    return await User.update({
      updatedAt: Date.now()
    }, {
      where: {id: this.id}
    });
  }


  async change_strength(count, type) {
    if (type == 'sub') {
      this.strength -= count;
      this.strength = this.strength < 0 ? 0 : this.strength;
      if (this.strength < 60) {
        let eventt = await Event.findOne({where: {user_id: this.id, event_sys_name: 'NotiStrength'}});
        if (eventt == null) {
          let cov = await Conversation.findOne({where: {user_id: this.id}});
          Event.create({
            user_id: this.id,
            event_sys_name: 'NotiStrength',
            peer_id: cov.conversation_id,
            time_exit: Date.now() + 1000 * 60
          });
        }
      }
    }
    else if (type == 'add') {
      this.strength += count;
      this.strength = this.strength > this.max_strength ? this.max_strength : this.strength;
    }
    this.save();
    return this.strength;
  }
  async destroy_session() {
    return await Session.removeAll();
  }
  async add_session(name, value = undefined, isRoute = false) {
    return await Session.add(name, value, isRoute, 120);
  }
  async biba_record() {
    if (this.biba >= this.record_biba){
      this.record_biba = this.biba;
      this.save();
    }
  }

  /**
   *
   * @param {int} user_id
   * @param {int} user_vk_id
   * @returns {Promise<boolean>}
   */
  static async checkSpam(user_id, user_vk_id){
    let time_exit;

    if (await Session.isExists(user_id, 'spam') === false){
      await Session.add(user_id, 'spam', 1, false, 60);
    } else {
      let checking_spam = await Session.get(user_id, 'spam');
       checking_spam = Number.parseInt(checking_spam);

      if (checking_spam >= 11){
        return true;
      }
      else if (checking_spam == 10){
        checking_spam += 1;
        time_exit = await Session.updateTime(user_id, 'spam', checking_spam, 150);
        pre_send(render('error', {
          error: 'spam', template: 3, time_exit: Math.round((time_exit - Date.now()) / 1000 / 60)
        }), user_vk_id);
        return true;
      }
      else if (checking_spam <= 5){
        checking_spam += 1;
        await Session.updateTime(user_id, 'spam', checking_spam, 5);
      }
      else {
        let template = random.int(1, 2);
        checking_spam += 1;
        time_exit = await Session.updateTime(user_id,'spam', checking_spam, 5);
        if ((Math.round((time_exit - Date.now()) / 1000)) < 0) template = 4;
        pre_send(render('error', {
          error: 'spam', template: template, time_exit: Math.round((time_exit - Date.now()) / 1000)
        }), user_vk_id);
        return true;
      }
    }
  }

  /**
   * Получение объекта пользователя
   *
   * @param {int} vk_id - id вк
   * @returns {Promise<array|null>}
   */
  static async getUser(vk_id) {
    let user = await User.findOne({where: {vk_id: vk_id}});
    if (!user) {
      try {
        user = await User.create({vk_id: vk_id, money: 0});
      } catch (e) {
        return null;
      }
    }
    return user;
  }

  /**
   *
    * @param {int} code_error. 1 - ls, 2 - not ls
   * @param {int} user_id
   * @param {int} from_id
   * @returns {Promise<boolean>}
   */
  static async theCommandIsDisabledHere(code_error, user_id, from_id){
    if (code_error == 1){
      if (from_id == user_id){
        pre_send(render('error', {
          error: 'the_command_is_disabled_here', template: code_error
        }), user_id);
        return true;
      }
    }
    else if (code_error == 2){
      if (from_id != user_id){
        pre_send(render('error', {
          error: 'the_command_is_disabled_here', template: code_error
        }), user_id);
        return true;
      }
    }
  }
}
User.init({
  vk_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  biba: {
    type: Sequelize.FLOAT(5,2),
    defaultValue: 0
  },
  strength: {
    type: Sequelize.INTEGER,
    defaultValue: 100,
    allowNull: false
  },
  max_strength: {
    type: Sequelize.INTEGER,
    defaultValue: 100,
    allowNull: false
  },
  count_fap: {
    type: Sequelize.BIGINT.UNSIGNED
  },
  money: {
    type: Sequelize.INTEGER.UNSIGNED
  },
  session: {
    type: Sequelize.STRING(255),
  },
  bibon: {
    type: Sequelize.BIGINT
  },
  record_biba: {
    type: Sequelize.FLOAT(5,2),
    defaultValue: 0
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  },

}, {
  sequelize,
  modelName: 'user',
  tableName: 'users',
  updatedAt: false
});

global.User = User;
Bibon.belongsTo(User, {
  foreignKey: 'user_id'
});
BigBibon.belongsTo(User, {
  foreignKey: 'user_id'
});
Event.belongsTo(User, {
  foreignKey: 'user_id'
});
