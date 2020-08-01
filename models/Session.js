const Op = Sequelize.Op;
const Model = Sequelize.Model;

/**
 * Класс для управления сессиями пользователей
 */
class Session extends Model {
    static userId;

    /**
     * Создание сессии (контекста) для пользователя
     *
     * @param {string} name - Название сессии
     * @param {string=} value - Значение сессии
     * @param {boolean} [isRoute=false] - это сессия является маршрутом?
     * @param {int} [expiresAt=60] - Время жизни сессии в секундах
     * @returns {Promise<boolean>}
     */
    static async add(name, value, isRoute = false, expiresAt= 60) {
        let userId = this.userId;
        expiresAt = expiresAt * 1000 + Date.now(); // Превращаем из ms в s и прибавляем к текущей дате для получения timestamp
        let session = new Session({
            user_id: userId,
            name: name,
            value: value,
            is_route: isRoute,
            expires_at: expiresAt
        });
        try {
            await this.remove(name);
            await session.save();
        } catch (e) {
            //TODO: тут нужно писать в лог ошибку
            console.error(`Ошибка при создании сессии:`);
            console.error(e);
            return false;
        }
        return true;
    }

    /**
     * Получение сесии для пользователя по имени
     *
     * @param {string} name - Название сессии
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async get(name) {
        let userId = this.userId;
        return await this.findOne({where: {user_id : userId, name : name}});
    }

    /**
     * Получение маршрутной сессии для пользователя
     *
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async getRouteSession() {
        let userId = this.userId;
        return await this.findOne({where: {user_id : userId, is_route: true}});
    }

    /**
     * Проверка на наличие сессии
     *
     * @param {string} name - Название сессии
     * @returns {Promise<boolean>}
     */
    static async isExists(name) {
        let userId = this.userId;
        let session = await this.findOne({where: {user_id : userId, name: name}});
        return session !== null;
    }

    /**
     * Удаление сессии по имени
     *
     * @param {string} name - Название сессии
     * @returns {Promise<void>}
     */
    static async remove(name) {
        let userId = this.userId;
        return await this.destroy({where: {user_id : userId, name : name}});
    }

    /**
     * Удаление всех сессий пользователя
     *
     * @returns {Promise<void>}
     */
    static async removeAll() {
        let userId = this.userId;
        return await this.destroy({where: {user_id : userId}});
    }

    /**
     * Удаление "протухших" сессий
     * @param {number} [expireTime=Date.now()]
     * @returns {Promise<void>}
     */
    static async removeExpire(expireTime = Date.now()) {
        this.destroy({where: {expires_at: {[Op.lte]: expireTime}}});
    }
}
Session.init({
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    value: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    is_route: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    expires_at: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'session',
    tableName: 'sessions',
    timestamps: false
});
global.Session = Session;
