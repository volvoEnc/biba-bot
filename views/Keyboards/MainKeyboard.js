exports.index = async () => {
  let keyboard = new Keyboard(false)
    .addButton('🔥 БИБОН 🔥', "primary", {content: "бибон"})
    .addButton('💥 БИГБОН 💥', "primary", {content: "бигбон"})
    .addRow()
    .addButton('⭐ ПРОФИЛЬ ⭐', "negative" , {content: "биба"})
    .addButton('⭐ ФАП ⭐', "primary" , {content: "фап"})
    .addButton('✨ СТАТА ✨', "negative" , {content: "биб стата"})
    .addRow()
    .addButton('❗ ПОМОЩЬ ❗', null, {content: "Биба хелп"})
    .addRow()
    .addButton('🔝 ТОПЫ 🔝', "positive", {content: "биба топы"})
  return keyboard;
};
