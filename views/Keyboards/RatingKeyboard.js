exports.index = async () => {
  let keyboard = new Keyboard(false)
    .addButton('✊🏻 ТОП БИБ ✊🏻', "primary", {content: "топ биб"})
    .addButton('💰 ТОП КОИН 💰', "negative" , {content: "топ коин"})
    .addRow()
    .addButton('💧 ТОП ФАП 💧', "primary", {content: "топ фап"})
    .addButton('🔥 ТОП БИБОН 🔥', "negative" , {content: "топ бибон"})
    .addRow()
    .addButton('НАЗАД', null, {content: "биба"})
  return keyboard;
};
