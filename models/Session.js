const Op = Sequelize.Op;
const Model = Sequelize.Model;

/**
 * Класс для управления сессиями пользователей
 */
class Session extends Model {

    /**
     * Создание сессии (контекста) для пользователя
     *
     * @param {int|null} userId - UserId пользователя в нашей системе
     * @param {string} name - Название сессии
     * @param {string=} value - Значение сессии
     * @param {boolean} [isRoute=false] - это сессия является маршрутом?
     * @param {int|null} [expiresAt=60] - Время жизни сессии в секундах
     * @returns {Promise<boolean>}
     */
    static async add(userId, name, value, isRoute = false, expiresAt) {
        // Если null сессия безсрочная
        if (expiresAt !== null) {
            if (expiresAt === undefined) {
                expiresAt = 60;
            }
            expiresAt = expiresAt * 1000 + Date.now(); // Превращаем из ms в s и прибавляем к текущей дате для получения timestamp
        }

        let session = new Session({
            user_id: userId,
            name: name,
            value: value,
            is_route: isRoute,
            expires_at: expiresAt
        });
        try {
            await this.remove(userId, name);
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
     * @param {int|null} userId - UserId пользователя в нашей системе
     * @param {string} name - Название сессии
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async get(userId, name) {
        return (await this.findOne({where: {user_id : userId, name : name}})).value;
    }

    /**
     * Получение маршрутной сессии для пользователя
     *
     * @param {int} userId - UserId пользователя в нашей системе
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async getRouteSession(userId) {
        return await this.findOne({where: {user_id : userId, is_route: true}});
    }

    /**
     * Проверка на наличие сессии
     *
     * @param {int|null} userId - UserId пользователя в нашей системе
     * @param {string} name - Название сессии
     * @returns {Promise<boolean>}
     */
    static async isExists(userId, name) {
        let session = await this.findOne({where: {user_id : userId, name: name}});
        return session !== null;
    }

    /**
     * Удаление сессии по имени
     *
     * @param {int|null} userId - UserId пользователя в нашей системе
     * @param {string} name - Название сессии
     * @returns {Promise<boolean>}
     */
    static async remove(userId, name) {
        return await this.destroy({where: {user_id : userId, name : name}});
    }

    /**
     * Удаление всех сессий пользователя
     *
     * @param {int|null} userId - UserId пользователя в нашей системе
     * @returns {Promise<int>}
     */
    static async removeAll(userId) {
        return await this.destroy({where: {user_id : userId}});
    }

    /**
     * Удаление "протухших" сессий
     *
     * @param {number} [expireTime=Date.now()]
     * @returns {Promise<int>}
     */
    static async removeExpire(expireTime = Date.now()) {
        return await this.destroy({where: {expires_at: {[Op.lte]: expireTime}}});
    }
}
Session.init({
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: true
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
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'session',
    tableName: 'sessions',
    timestamps: false
});
global.Session = Session;
