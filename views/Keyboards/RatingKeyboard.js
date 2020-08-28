exports.index = async () => {
  let keyboard = new Keyboard(false)
      .addButton('🔥 БИБА МОЙ ТОП 🔥', "primary", {content: "биба мой топ"})
    .addRow()
      .addButton('✨ БИБА ВСЕ ТОПЫ ✨', "negative", {content: "биба все топы"})
    .addRow()
      .addButton('НАЗАД', null, {content: "биба"})
  return keyboard;
};
