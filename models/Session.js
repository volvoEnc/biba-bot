const Op = Sequelize.Op;
const Model = Sequelize.Model;

/**
 * Класс для управления сессиями пользователей
 */
class Session extends Model {

    /**
     * Создание сессии (контекста) для пользователя
     *
     * @param {int|null} peerId - UserId or ConversationId
     * @param {string} name - Название сессии
     * @param {string=} value - Значение сессии
     * @param {boolean} [isRoute=false] - это сессия является маршрутом?
     * @param {int|null} [expiresAt=60] - Время жизни сессии в секундах
     * @param {string|null} [callback=null] - Action который будет вызван при смерти сессии
     * @returns {Promise<boolean>}
     */
    static async add(peerId, name, value, isRoute = false, expiresAt, callback = null) {
        // Если null сессия безсрочная
        if (expiresAt !== null) {
            if (expiresAt === undefined) {
                expiresAt = 60;
            }
            expiresAt = expiresAt * 1000 + Date.now(); // Превращаем из ms в s и прибавляем к текущей дате для получения timestamp
        }

        let session = new Session({
            peer_id: peerId,
            name: name,
            value: value,
            is_route: isRoute,
            action_on_dead: callback,
            expires_at: expiresAt
        });
        try {
            await this.remove(peerId, name);
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
     * @param {int|null} peerId - UserId or ConversationId
     * @param {string} name - Название сессии
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async get(peerId, name) {
        return (await this.findOne({where: {peer_id : peerId, name : name}})).value;
    }

    /**
     * Получение маршрутной сессии для пользователя
     *
     * @param {int} peerId - UserId or ConversationId
     * @return {(Promise<Session>|Promise<null>)} - Сессия, либо null
     */
    static async getRouteSession(peerId) {
        return await this.findOne({where: {peer_id : peerId, is_route: true}});
    }

    /**
     * Проверка на наличие сессии
     *
     * @param {int|null} peerId - UserId or ConversationId
     * @param {string} name - Название сессии
     * @returns {Promise<boolean>}
     */
    static async isExists(peerId, name) {
        let session = await this.findOne({where: {peer_id : peerId, name: name}});
        return session !== null;
    }

    /**
     * Удаление сессии по имени
     *
     * @param {int|null} peerId - UserId or ConversationId
     * @param {string} name - Название сессии
     * @returns {Promise<boolean>}
     */
    static async remove(peerId, name) {
        return this.destroy({where: {peer_id: peerId, name: name}});
    }

    /**
     * Удаление всех сессий пользователя
     *
     * @param {int|null} peerId - UserId or ConversationId
     * @returns {Promise<int>}
     */
    static async removeAll(peerId) {
        return this.destroy({where: {peer_id : peerId}});
    }

    /**
     * Получение "протухших" сессий
     *
     * @param {number} [expireTime=Date.now()]
     * @returns {Promise<Session[]>}
     */
    static async getExpiredSessions(expireTime = Date.now()) {
        return this.findAll({where: {expires_at: {[Op.lte]: expireTime}}})
    }

    /**
     *
     * Обновление времени сессий
     *
     * @param {int} peerId - UserId or ConversationId
     * @param {string} name
     * @param {string|null} value
     * @param {int} expires_at - в секундах
     * @returns {int} new expires_at
     */
    static async updateTime(peerId, name, value, expires_at){
        let session = await this.findOne({where: {peer_id : peerId, name : name}});

        if (value === null) value = session.value;

        let time = ((session.expires_at + (expires_at * 1000)) - Date.now()) / 1000;
        await Session.add(peerId, name, value, false, time);
        return session.expires_at + (expires_at * 1000);
    }


    /**
     * Выполнить "предсмертный крик"
     */
    async executeCallback() {
        if (this.action_on_dead != null) {
            try {
                await actions[this.action_on_dead].index(this);
            } catch (e) {
                console.error('Session execute error: ' + this.action_on_dead + '. Error: ' + e)
            }
        }
    }

}
Session.init({
    peer_id: {
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
    action_on_dead: {
        type: Sequelize.STRING(255),
        allowNull: true
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
