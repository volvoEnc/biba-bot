const Model = Sequelize.Model;
class Bibon extends Model {};
Bibon.init({
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
  result: {
    type: Sequelize.INTEGER(1).UNSIGNED
  },
  createdAt: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: Date.now()
  }
}, {
  sequelize,
  modelName: 'bibon',
  tableName: 'bibons',
  timestamps: false
});
global.Bibon = Bibon;
