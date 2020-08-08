/**
 * @Command: text - считывать комманду
 * @Param: vkData - данные из вк
 */

module.exports = [
    {command: 'catalog', controller: 'shopController@catalog'},
    {command: 'productsByCategory', controller: 'shopController@productsByCategory'},
    {command: 'productInfo', controller: 'shopController@productInfo'},
];