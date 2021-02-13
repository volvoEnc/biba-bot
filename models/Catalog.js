const Model = Sequelize.Model;
class Catalog extends Model {

  static async getProduct(category, name) {
    return await global.products[category][name]();
  }

  static async getProductByName(name) {
    return await this.findOne({where: {system_name: name}});
  }

  /**
   * Проверка на существование предмета
   * @param name
   * @returns {Promise<boolean>}
   */
  static async checkExists(name) {
    let item = await this.findOne({where: {system_name: name}});
    return item !== null;
  }
}
Catalog.init({
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  category: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  system_name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  system_category: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT(9,2),
    allowNull: false
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  max_count: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  view: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'catalog',
  tableName: 'catalog',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_unicode_ci'
});
global.Catalog = Catalog;
