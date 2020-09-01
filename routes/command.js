/**
 * @Command: @text@ - считывать сессию
 * @Param: vkData - данные из вк, sessionData - данные из сессии
 *
 * @Command: text - считывать комманду
 * @Param: vkData - данные из вк
 */

module.exports = [
    // APP settings
    {command: "(^биба режим$)", controller: 'appController@gameBlokedToggle'},

    // Тестовые команды
    {command: "(!бибатест)", controller: 'shopController@list'},
    {command: "(!минуссила)", controller: 'testController@sub'},

    // words
    {command: "(^биба запомни|^биба запиши)", controller: 'wordsController@add'},
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
    {command: "(cпоки|cgjrb)", controller: 'eventController@nudes'},
    {command: "(😳)", controller: 'eventController@delete'},
    // main commands
    {command: "(^биба все топы|^биба топс)", controller: 'topController@tops'},
    {command: "(^биба все мои топы)", controller: 'topController@local_tops'},
    {command: "(^биба мой топ|^биба мой топ)", controller: 'bibaController@mytop'},
    {command: "(^биба помощь|^биба хелп|^biba help|^bib help|^биба команды|^команды бибы)", controller: 'mainController@help'},
    {command: "(^биба инфо|^биб инфо|^биб инф|^инфа биба)", controller: 'mainController@info'},
    {command: "(^биба мой топ бибон|^мой топ бибон|^мой топ бибонс)", controller: 'topController@local_bibon'},
    {command: "(^биба мой топ бигбон|^мой топ бигбон|^мой топ бигбонс)", controller: 'topController@local_bigbon'},
    {command: "(^биба мой топ биб|^мой топ биб|^мой топ биба|^мой биба топ)", controller: 'topController@local_biba'},
    {command: "(^биба мой топ фап|^мой топ фап|^мой топ фапов|^мой фап топ)", controller: 'topController@local_fap'},
    {command: "(^биба мой топ коин|^мой топ коин|^мой топ коинс|^мой коин топ)", controller: 'topController@local_money'},
    {command: "(^биба мой бибрейт|^мой бибрейт|^мой биб рейт)", controller: 'topController@local_record'},
    {command: "(^биба топ бибон|^топ бибон|^бибон топ|^топ бибонов|^топ бибонс)", controller: 'topController@bibon'},
    {command: "(^биба топ биб|^топ биб|^топ биба|^биба топ|^биб топ)", controller: 'topController@bibs'},
    {command: "(^биба топ фап|^топ фап|^топ фап|^топ фапы|^фапы топ|^фапс топ|^фап топ)", controller: 'topController@faps'},
    {command: "(^биба топ коин|^топ коин|^топ коин|^топ коины|^коины топ|^коинс топ|^коин топ)", controller: 'topController@coin'},
    {command: "(^биба топ бигбон|^топ бигбон|^топ бигбонс|^топ бигбоны|^бигбоны топ|^бигбонс топ|^бигбон топ)", controller: 'topController@bigbon'},
    {command: "(^биба рейтинг биб|^рейтинг биб|^рейт биб|^биб рейтинг|^биба рейтинг|^бибрейт|^рейтбиб|^биб рейт)", controller: 'topController@record'},
    {command: "(^биба бигбон|^супер бибон|^супер бибон$|^большой бибон|^большой бибон$|^бибонище|^бибонище$|^биг бибон|^биг бибон$|^бигбибон|^бигбибон$|^бигбон|бигбон$)", controller: 'BigBattleController@start'},
    {command: "(^биба бибон|^бибон|бибон$|^бибан|бибан$)", controller: 'battleController@battle'},
    {command: "(^биба$)", controller: 'bibaController@profile'},
    {command: "(^биба фап|^дроч$|^дроч|^фап$|^фап|^дрочить$|^дрочить)", controller: 'fapController@fap'},
    {command: "(^биб стата)", controller: 'bibaController@statistic'},

    {command: "(^рассылка1p-qweYrhdUs$)", controller: 'testController@mailing'},

    //Biba Shop
    {command: "(^бибазин|бибазин$)", controller: 'shopController@index'},
    {command: "(@catalog@)", controller: 'shopController@categories'},
    {command: "(@products@)", controller: 'shopController@products'},
    {command: "(@product@)", controller: 'shopController@product'},
];