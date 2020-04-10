const Model = Sequelize.Model;
class Event extends Model {};
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
  event_name: {
    type: Sequelize.TEXT,
    allowNull: false
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
