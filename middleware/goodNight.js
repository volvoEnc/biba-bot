/**
 * Если false, то выполняется только при команде
 * Объект data как в контроллере
 */
exports.is_all = async () => {
    return false;
}
/**
 * Проверяет можно ли выхывать спокойной ночи
 * Доступно 1 раз в 12 часов
 *
 * Используемые сессии: goodNightBlocked, goodMorningTrigger, messagesAfterGoodNight, goodNightNoTriggered
 */
exports.execute = async (data) => {
    if (data.alias === 'goodNight') {
        if (!await Session.isExists(data.from_id, 'goodNightBlocked')) {
            await Session.add(data.from_id, 'goodNightBlocked', '', false, 60 * 60 * 12);
            await Session.add(data.from_id, 'goodMorningTrigger', '', false, 60 * 60 * 24);
            await Session.add(data.from_id, 'messagesAfterGoodNight', '0', false, 60 * 60 * 24);
            await Session.add(data.from_id, 'goodNightNoTriggered', '', false, 60 * 60 * 4);
            return true;
        }
        return false;
    }
    return true;
}