module.exports = [
  {command: "(биба помощь|биба хелп|biba help|bib help|биба команды|команды бибы)", controller: 'mainController@help'},
  {command: "(^топ биб|топ биб$|топ биба|биба топ|биб топ)", controller: 'topController@bibs'},
  {command: "(^бибон|бибон$|^бибан|бибан$)", controller: 'battleController@battle'},
  {command: "(биба$|^биба)", controller: 'bibaController@profile'},
  {command: "(дроч$|^дроч|фап$|^фап|дрочить$|^дрочить)", controller: 'fapController@fap'},
];
