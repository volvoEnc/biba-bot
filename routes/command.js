/**
 * @Command: @text@ - считывать сессию
 * @Param: vkData - данные из вк, sessionData - данные из сессии
 *
 * @Command: text - считывать комманду
 * @Param: vkData - данные из вк
 */

module.exports = [
    // APP settings
    {command: "(^биба режим текст$)", controller: 'rulesController@messageModeToggle'},
    {command: "(^биба режим$)", controller: 'rulesController@gameBlockedToggle'},

    // Protected user
    {command: "(^кик)", controller: 'ProtectedController@obmaterit'},
    {command: "(^мут)", controller: 'ProtectedController@obmaterit'},

    // Тестовые команды
    {command: "(!бибатест)", controller: 'shopController@list'},
    {command: "(!минуссила)", controller: 'testController@sub'},

    // words
    {command: "(^биба запомни|^биба запиши)", controller: 'wordsController@add'},
    {command: "(^биба удали|^биба делит)", controller: 'wordsController@delete'},
    {command: "(^биба кто я|биба что я|^биба расскажи обо мне|^биба опиши меня|^бкя)", controller: 'wordsController@portrait'},
    {command: "(^биба кто он|^биба что он|^биба кто она|^биба что она|^биба расскажи о нем|^биба расскажи о ней|^биба опиши его|биба опиши ее)", controller: 'wordsController@portraitRouter'},
    {command: "(^биба сколько слов|^биба сколько данных|^биба сколько записей)", controller: 'wordsController@stats'},

    // funny
    {command: "(биба топы)", controller: 'mainController@tops'},
    {command: "(^биба кто)", controller: 'eventController@who'},
    {command: "(^биба почему)", controller: 'eventController@why'},
    {command: "^биба.*\\?$", controller: 'eventController@question'},
    {command: "(^биба напиши)", controller: 'eventController@write_to_image'},
    {command: "(^биба нарисуй член)", controller: 'eventController@draw_chlen'},
    {command: "(споки$|спок$|^я спать|доброй ночи$|сладких снов$)", controller: 'eventController@goodNight', name: 'goodNight'},
    {command: "@goodMorning", controller: 'eventController@goodMorning', name: 'goodMorning'},
    {command: "(😳)", controller: 'eventController@repeatMessage'},
    // main commands
    {command: "(^биба все топы|^биба топс)", controller: 'topController@tops'},
    {command: "(^биба все мои топы)", controller: 'topController@local_tops'},
    {command: "(^биба помощь|^биба хелп|^biba help|^bib help|^биба команды|^команды бибы)", controller: 'mainController@help'},
    {command: "(^биба инфо|^биб инфо|^биб инф|^инфа биба)", controller: 'mainController@info'},
    {command: "(^мой топ бибон|^мой топ бибонс)", controller: 'topController@local_bibon'},
    {command: "(^мой топ бигбон|^мой топ бигбонс)", controller: 'topController@local_bigbon'},
    {command: "(^мой топ биб|^мой топ биба|^мой биба топ)", controller: 'topController@local_biba'},
    {command: "(^мой топ фап|^мой топ фапов|^мой фап топ)", controller: 'topController@local_fap'},
    {command: "(^мой топ коин|^мой топ коинс|^мой коин топ)", controller: 'topController@local_money'},
    {command: "(^мой бибрейт|^мой биб рейт)", controller: 'topController@local_record'},
    {command: "(^биба мой топ|^биба мой топ)", controller: 'bibaController@mytop'},
    {command: "(^топ бигбон|^топ бигбонс|^топ бигбоны|^бигбоны топ|^бигбонс топ|^бигбон топ)", controller: 'topController@bigbon'},
    {command: "(^топ бибон|^бибон топ|^топ бибонов|^топ бибонс)", controller: 'topController@bibon'},
    {command: "(^топ биб|^топ биба|^биба топ|^биб топ)", controller: 'topController@bibs'},
    {command: "(^топ фап|^топ фап|^топ фапы|^фапы топ|^фапс топ|^фап топ)", controller: 'topController@faps'},
    {command: "(^топ коин|^топ коин|^топ коины|^коины топ|^коинс топ|^коин топ)", controller: 'topController@coin'},
    {command: "(^рейтинг биб|^рейт биб|^биб рейтинг|^биба рейтинг|^бибрейт|^рейтбиб|^биб рейт)", controller: 'topController@record'},
    {command: "(^супер бибон|^супер бибон$|^большой бибон|^большой бибон$|^бибонище|^бибонище$|^биг бибон|^биг бибон$|^бигбибон|^бигбибон$|^бигбон|бигбон$)", controller: 'BigBattleController@start'},
    {command: "(^бибон|бибон$|^бибан|бибан$)", controller: 'battleController@battle'},
    {command: "(^биба)", controller: 'bibaController@profile'},
    {command: "(^дроч$|^дроч|^фап$|^фап|^дрочить$|^дрочить)", controller: 'fapController@fap'},
    {command: "(^биб стата)", controller: 'bibaController@statistic'},

    {command: "(^рассылка1p-qweYrhdUs$)", controller: 'testController@mailing'},

    //Biba Shop
    {command: "(^бибазин|бибазин$)", controller: 'shopController@index'},
    {command: "(@catalog@)", controller: 'shopController@categories'},
    {command: "(@products@)", controller: 'shopController@products'},
    {command: "(@product@)", controller: 'shopController@product'},
];