const Model = Sequelize.Model;
class Words extends Model {
  static types = [
    'C', 'P', 'PP'
  ];
  static async getWords(type) {
    return await Words.findAll({where: {type: type}});
  };
  static async addWord(word, type) {
    let new_word = new Words({
      word: word,
      type: type
    });
    return await new_word.save();
  }
  static async checkWord(word) {
    return await Words.findOne({where: {word: word}});
  }
};
Words.init({
    word: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    type: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    additionally: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'words',
    tableName: 'words',
    timestamps: false
});
global.Words = Words;
