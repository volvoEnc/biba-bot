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
     * @returns {Promise<boolean>} - Результат добавления предмета
     */
    static async addItem(itemName, count = 1) {
        if (!await Catalog.checkExists(itemName)) {
            console.log('Item not exists');
            return false;
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
            return false;
        }
        return true;
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

    static async checkExistsItem(itemName) {
        let item = this.getItem(itemName);
        return item !== null;
    }

    static async countItems() {
        return await this.count({where: {user_id: this.userId}});
    }

    static async getItem(itemName) {
        return await this.findOne({where: {user_id: this.userId, item_name: itemName}});
    }

    static async getCountItem(itemName) {
        return (await this.getItem(itemName)).count;
    }

    static async getItemsByType(typeName, onlyActive = true) {
        return await this.findAll({where: {}});
    }

    async executeActionItem() {

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