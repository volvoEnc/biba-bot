exports.index = async () => {
  let keyboard = new Keyboard(false)
    .addButton('💒 Бибазин')
    .addButton('📊 Биб стата')

  return keyboard
};
