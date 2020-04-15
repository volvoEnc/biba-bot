const Model = Sequelize.Model;
class User extends Model {};
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
  event_id: {
    type: Sequelize.INTEGER
  },
  bibon: {
    type: Sequelize.BIGINT
  },

}, {
  sequelize,
  modelName: 'user',
  tableName: 'users'
});

global.User = User;
Bibon.belongsTo(User, {
  foreignKey: 'user_id'
});
