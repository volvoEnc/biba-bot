const Model = Sequelize.Model;
class Event extends Model {

  /**
   * Получение события по названию для пользователя
   *
   * @param {int} userId
   * @param {string} eventName
   * @returns {Promise<object|null>}
   */
  static async getEventByUser(userId, eventName)
  {
    return this.findOne({where: {user_id: userId, event_sys_name: eventName}});
  }

  /**
   * Cуществует ли событие для пользователя
   *
   * @param {int} userId
   * @param {string} eventName
   * @returns {Promise<boolean>}
   */
  static async existsEventByUser(userId, eventName)
  {
    return (await this.count({where: {user_id: userId, event_sys_name: eventName}})) > 0;
  }

  /**
   * Получить событие которым сейчас занимается пользователь
   *
   * @param {int} userId
   * @returns {Promise<object|null>}
   */
  static async getActiveAction(userId)
  {
    let searchEvents = [];
    for (let actionKey in config.actions) {
      if (config.actions[actionKey].hasOwnProperty('name')) {
        searchEvents.push(config.actions[actionKey].name);
      }
    }

    console.log(searchEvents);

    return this.findOne({where: {user_id: userId, event_sys_name: {[Op.or] : searchEvents} }});
  }

}


Event.init({
  user_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  to_id: {
    type: Sequelize.BIGINT
  },
  peer_id: {
    type: Sequelize.BIGINT
  },
  event_sys_name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  time_exit: {
    type: Sequelize.BIGINT,
    allowNull: false
  },

}, {
  sequelize,
  modelName: 'event',
  tableName: 'events'
});
global.Event = Event;
