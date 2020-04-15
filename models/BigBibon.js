const Model = Sequelize.Model;
class BigBibon extends Model {};
BigBibon.init({
  conversation_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  user_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  opponent_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  biba: {
    type: Sequelize.FLOAT(5,2)
  },
  money: {
    type: Sequelize.INTEGER.UNSIGNED
  },
  user_hp: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  opponent_hp: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  result: {
    type: Sequelize.INTEGER(1).UNSIGNED
  },
  step: {
    type: Sequelize.STRING(255),
    defaultValue: 'start',
    allowNull: false
  },
  createdAt: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: Date.now() + (1000 * 60 * 60)
  }
}, {
  sequelize,
  modelName: 'big_bibon',
  tableName: 'big_bibons',
  timestamps: false
});
global.BigBibon = BigBibon;
