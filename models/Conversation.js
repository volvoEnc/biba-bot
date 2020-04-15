const Model = Sequelize.Model;
class Conversation extends Model {};
Conversation.init({
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false
  },
  conversation_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  saves: {
    type: Sequelize.INTEGER(1).UNSIGNED,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'conversation',
  tableName: 'conversations',
  timestamps: false
});
global.Conversation = Conversation;
