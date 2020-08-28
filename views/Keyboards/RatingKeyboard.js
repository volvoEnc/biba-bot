exports.index = async () => {
  let keyboard = new Keyboard(false)
    .addButton('✊🏻 ТОП БИБ ✊🏻', "negative", {content: "топ биб"})
      .addButton('💥 РЕЙТ БИБ 💥', "primary", {content: "рейтинг биб"})
      .addButton('💰 ТОП КОИН 💰', "negative" , {content: "топ коин"})
    .addRow()
      .addButton('🔥 БИБА МОЙ ТОП 🔥', "positive", {content: "биба мой топ"})
      .addButton('Биба все топы', "negative", {content: "биба все топы"})
    .addRow()
      .addButton('НАЗАД', null, {content: "биба"})
  return keyboard;
};
