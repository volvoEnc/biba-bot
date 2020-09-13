/**
 * Если true, то выполняется при каждом сообщении.
 * Объект data без модификаций
 */
exports.is_all = async () => {
    return true;
}
/**
 * Если после "спокойной ночи" прошло более 4 часов
 * То выводим "доброе утро" от любого сообщения
 * Если не прошло, то "терпим" 10 сообщений и после удаляем триггер "доброго утра"
 *
 * Используемые сессии: goodMorningTrigger, messagesAfterGoodNight = 0 [max=10], goodNightNoTriggered
 */
exports.execute = async (data) => {
    if (await Session.isExists(data.object.message.from_id, 'goodMorningTrigger') &&
        !await Session.isExists(data.object.message.from_id, 'goodNightNoTriggered')) {
        await Session.remove(data.object.message.from_id, 'goodMorningTrigger');
        data.object.message.text = '@goodMorning';
        await MainRouter.run(data);
        return false;
    }
    return true;
}