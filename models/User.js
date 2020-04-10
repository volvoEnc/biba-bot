const Model = Sequelize.Model;
class User extends Model {};
User.init({
  vk_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  biba: {
    type: Sequelize.FLOAT(4,2),
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
  event_id: {
    type: Sequelize.INTEGER
  },

}, {
  sequelize,
  modelName: 'user',
  tableName: 'users'
});

global.User = User;
