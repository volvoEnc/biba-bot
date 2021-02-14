const Op = Sequelize.Op;

/**
 * Валидация для настроек бота в беседах.
 * Самостоятельный компонент, в случае ошибок пишет ответ пользователю
 *
 * @param {array} data - Объект запроса после определения контроллера
 * @returns {Promise<boolean>} - успешность валидации
 */
exports.botSettingsValidate = async data => {
    let allow = false;
    if (data.from_id == data.user_id) {
        await pre_send('Настройки доступны только для бесед', data.user_id);
        return false;
    }
    let users = null;
    try {
        users = await bot.api('messages.getConversationMembers', {peer_id: data.user_id});
    } catch (e) {
        if (e.error_code == 917) {
            await pre_send(render('app/errors', { type: 'bot_is_not_admin' }), data.user_id);
            return false;
        } else {
            return false;
        }
    }

    if (users == null) {
        await pre_send('Произошла ошибка', data.user_id);
        return false;
    } else {
        users.items.forEach(user => {
            if (user.member_id == data.from_id && user.is_admin) {
                allow = true;
            }
        });
    }

    if (!allow) {
        await pre_send('Только админ беседы может настраивать бота', data.user_id);
        return false;
    }

    let conversation_id = data.data.object.message.peer_id;
    if (conversation_id == 0 || conversation_id == null || conversation_id == '') {
        await pre_send('Произошла ошибка', data.user_id);
        return false;
    }
    return true;
};

/**
 * Игровые функции для беседы
 * Самостоятельный компонент, в случае ошибок пишет ответ пользователю
 *
 * @param {array} data - Объект запроса после определения контроллера
 * @returns {Promise<boolean>} - успешность переключения
 */
exports.gameBlockedToggle = async data => {
    if ( !(await MainRouter.modules.rulesController.botSettingsValidate(data)) ) {
        return false;
    }

    let conversation_id = data.data.object.message.peer_id;
    let rule = await Rules.getRule(conversation_id, 'gameModeBloked');
    if (rule == null) {
        await Rules.addRule(conversation_id, 'gameModeBloked', true);
        await pre_send('Игровые функции ограничены для данной беседы', data.user_id);
        return true;
    } else {
        rule.ruleSetEnable(!rule.enable);
        if (rule.enable) {
            await pre_send('Игровые функции ограничены для данной беседы', data.user_id);
            return true;
        } else {
            await pre_send('Игровые функции включены для данной беседы', data.user_id);
            return true;
        }
    }
};

/**
 * Режим сообщений, с матом либо без него.
 * Самостоятельный компонент, в случае ошибок пишет ответ пользователю
 *
 * @param {array} data - Объект запроса после определения контроллера
 * @returns {Promise<boolean>} - успешность переключения
 */
exports.messageModeToggle = async data => {
    if ( !(await MainRouter.modules.rulesController.botSettingsValidate(data)) ) {
        return false;
    }

    let conversation_id = data.data.object.message.peer_id;
    let rule = await Rules.getRule(conversation_id, 'messageMode');
    if (rule == null) {
        await Rules.addRule(conversation_id, 'messageMode', true);
        await pre_send('"Злой" режим включен', data.user_id);
        return true;
    } else {
        await rule.ruleSetEnable(!rule.enable);
        if (rule.enable) {
            await pre_send('"Злой" режим включен', data.user_id);
            return true;
        } else {
            await pre_send('Обычный режим включен', data.user_id);
            return true;
        }
    }
};