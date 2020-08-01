exports.index = async () => {
  let keyboard = new Keyboard(false)
    .addButton('✊🏻 ТОП БИБ ✊🏻', "negative", {content: "топ биб"})
      .addButton('💥 РЕЙТ БИБ 💥', "primary", {content: "рейтинг биб"})
    .addButton('💰 ТОП КОИН 💰', "negative" , {content: "топ коин"})
    .addRow()
    .addButton('💧 ТОП ФАП 💧', "primary", {content: "топ фап"})
    .addButton('🔥 ТОП БИБОН 🔥', "primary" , {content: "топ бибон"})
    .addRow()
    .addButton('НАЗАД', null, {content: "биба"})
  return keyboard;
};
