const Model = Sequelize.Model;
class User extends Model {
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
    this.session = null;
    this.save();
  }
  async add_session(val) {
    this.session = val;
    this.save();
  }
  async biba_record() {
    if (this.biba >= this.record_biba){
      this.record_biba = this.biba;
      this.save();
    }
  }
};
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

}, {
  sequelize,
  modelName: 'user',
  tableName: 'users'
});

global.User = User;
Bibon.belongsTo(User, {
  foreignKey: 'user_id'
});
