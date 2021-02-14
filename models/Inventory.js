const Op = Sequelize.Op;
const Model = Sequelize.Model;

/**
 * Класс для управления инвентарем пользователя
 */
class Inventory extends Model {
    static userId;

    /**
     * Добавление предмета в инвентарь. Если предмет уже есть, то увелечение кол-ва.
     *
     * @param {string} itemName - Название предмета
     * @param {int} [count=1] - Количество добавляемого предмета
     * @returns {Promise<array|null>} - Результат добавления предмета
     */
    static async addItem(itemName, count = 1) {
        if (!await Catalog.checkExists(itemName)) {
            console.log('Item not exists');
            return null;
        }

        let item = await this.getItem(itemName);
        if (item === null) {
            item = new Inventory({
                'user_id': this.userId,
                'item_name': itemName,
                'count': count,
                'is_active': true
            });
        } else {
            item.count += count;
        }
        try {
            await item.save();
        } catch (e) {
            console.log('При сохранении предмета в инвентарь, произошла ошибка: ');
            console.log(e);
            return null;
        }
        return item;
    }

    /**
     * Удаление предмета из инвенторя. Если кол-во предмета в инв. больше чем удалено, то уменьшается только кол-во.
     *
     * @param {string} itemName - Название предмета
     * @param {int} [count=1] - Количество удаленного предмета
     * @returns {Promise<boolean>} - Результат удаления предмета
     */
    static async removeItem(itemName, count = 1) {
        if (!await Catalog.checkExists(itemName)) {
            console.error('Item not exists');
            return false;
        }

        let item = this.getItem(itemName);
        if (item === null) {
            return true;
        }

        if (item.count - count <= 0) {
            item.destroy();
        } else {
            item.count =- count;
        }

        try {
            await item.save();
        } catch (e) {
            console.error('При удалении предмета из инвентаря, произошла ошибка: ');
            console.error(e);
            return false;
        }

        return true;
    }

    /**
     * Полное удаление предмета из инвенторя
     *
     * @param {string} itemName - Название предмета
     * @returns {Promise<boolean>} - Результат удаления предмета
     */
    static async fullRemoveItem(itemName) {
        if (!await Catalog.checkExists(itemName)) {
            console.error('Item not exists');
            return false;
        }

        let item = this.getItem(itemName);
        if (item === null) {
            return true;
        }

        try {
            await item.destroy();
        } catch (e) {
            console.error('При удалении предмета из инвентаря, произошла ошибка: ');
            console.error(e);
            return false;
        }
        return true;
    }

    /**
     * Проверка наличия предмета в бд
     *
     * @param {string} itemName - Название предмета
     * @returns {Promise<boolean>} - Существует ли такой предмет в базе
     */
    static async checkExistsItem(itemName) {
        let item = this.getItem(itemName);
        return item !== null;
    }

    /**
     * Количество товаров у пользователя
     *
     * @returns {Promise<int|null>} - Существует ли такой предмет в базе
     */
    static async countItems() {
        return await this.count({where: {user_id: this.userId}});
    }

    /**
     * Получение товара из базы по названию
     *
     * @param {string} itemName - Название предмета
     * @returns {Promise<array|null>} - товар либо null
     */
    static async getItem(itemName) {
        return await this.findOne({where: {user_id: this.userId, item_name: itemName}});
    }

    /**
     * Получение всей информации по товару из объектов в коде
     *
     * @param {string} itemName - Название предмета
     * @param {string|null} categoryName - Название категории
     * @returns {Promise<array|null>} - товар либо null
     */
    static async getItemFull(itemName, categoryName = null) {
        if (categoryName === null) {
            let item = this.getItem(itemName);
            if (item) {
                categoryName = item.categoryName;
            } else {
                return null;
            }
        }
        let product = null;
        try {
            product = global.products[categoryName][itemName]();
        } catch (e) {
            return null;
        }
        return product;
    }

    /**
     * Получение количества товара у пользователя
     *
     * @param {string} itemName - Название предмета
     * @returns {Promise<int>} - количество товара у пользователя
     */
    static async getCountItem(itemName) {
        let item = await this.getItem(itemName);
        if (item !== null) {
            return item.count;
        }
        return 0;
    }

    /**
     * Получение товаров по типу
     *
     * @param {string} typeName - тип товара
     * @param {boolean} onlyActive - только активные
     * @returns {Promise<array|null>} - массив товаров по типу
     */
    static async getItemsByType(typeName, onlyActive = true) {
        return await this.findAll({where: {}});
    }

    /**
     * Получение товаров по типу
     *
     * @param {string} typeName - тип товара
     * @param {boolean} onlyActive - только активные
     * @returns {Promise<array|null>} - массив товаров по типу
     */
    static async getItemsByTypeForUser(typeName, onlyActive = true) {
        return await this.findAll({where: {}});
    }

    /**
     * Получение количества товара у пользователя
     *
     * @param {array} item - Предмет (Full)
     * @param {array|null} data - Данные для модификации
     * @returns {Promise<boolean>} - результат выполнения action у предмета
     */
    static async executeActionItem(item, data = null) {
        try {
            item.action(data);
        } catch (e) {
            return false;
        }
        return true;
    }
}

Inventory.init({
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    item_name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'inventory',
    tableName: 'inventory',
    timestamps: false
});
global.Inventory = Inventory;