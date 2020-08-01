const Model = Sequelize.Model;
class Rules extends Model {
  static async getRule(conversation_id, type) {
    return await this.findOne({where: {conversation_id: conversation_id, type_rule: type}});
  }
  static async addRule(conversation_id, type, enable = true) {
    let rule = new Rules({
      conversation_id: conversation_id,
      type_rule: type,
      enable: enable
    });
    return await rule.save();
  }
  async ruleSetEnable(enable) {
    this.enable = enable;
    return await this.save();
  }
};
Rules.init({
    conversation_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    type_rule: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    enable: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }

}, {
    sequelize,
    modelName: 'rules',
    tableName: 'rules',
    timestamps: false
});
global.Rules = Rules;
