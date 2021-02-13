exports.who = async (data) => {
  if (await User.theCommandIsDisabledHere(1, data.user_id, data.from_id)) return;
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  let users;
  try {
    users = await bot.api('messages.getConversationMembers', {peer_id: data.user_id});
  } catch (e) {
    // Нет прав админа
    if (e.error_code == 917) {
      return pre_send(render('app/errors', { type: 'bot_is_not_admin' }), data.user_id);
    } else { return; }
  }
  let random_user = users.profiles[random.int(0, (users.profiles.length - 1))];
  return pre_send(render('biba_who', {user: random_user, template: random.int(1, 10)}), data.user_id, {disable_mentions: 1});
};

exports.why = async (data) => {
  if (await User.theCommandIsDisabledHere(1, data.user_id, data.from_id)) return;
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;

  let msg = data.data.object.message.text;
  let why = msg.replace('биба почему ', '');
  why = why.replace('Биба почему', '');
  why = why.replace('?', '');
  why = why.replace('!', '');
  why = why.replace('.', '');
  why = why.replace(',', '');
  why = why.replace(/(\s[яЯ]\s|^[яЯ])/iug, ' ты ');
  let words = why.split(' ');
  let phraze;
  do {
    words = shuffle(words);
    phraze = words.join(' ');
  } while (phraze == why && words.length > 1);
  phraze = `Потому что ${phraze}`;
  if (words.length <= 1) phraze = 'Потому что у тебя маленький член!';
  pre_send(phraze, data.user_id);
}

exports.question = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  let answer = random.int(0, 100) >= 50 ? 'Да' : 'Нет';
  pre_send(answer, data.user_id);
}

exports.write_to_image = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  // if (data.from_id == data.user_id) return;

  //Получаем текст
  let msg = data.data.object.message.text;
  let where = msg.replace('биба напиши ', '');
  if (where == '') {
    return pre_send('Я бы сам придумал, что написать, да мне лень..', data.user_id);
  }

  //Генерируем случайные данные
  let rotate = random.int(-35, 35) / 100;
  let font_size = random.int(20, 50);
  let random_color_text = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;
  let random_color_border = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;
  let width = 100 + where.length * 20;
  if (width > 500) width = 500;

  const canvas = draw.createCanvas(width, width);
  const ctx = canvas.getContext('2d');

  // Рисуем
  ctx.fillStyle = random_color_border;
  ctx.fillRect(0, 0, width, width);
  ctx.fillStyle = 'white';
  ctx.fillRect(5, 5, width-10, width-10);

  ctx.font = font_size+'px Impact';
  ctx.rotate(rotate);
  ctx.fillStyle = random_color_text;
  ctx.fillText(where, 25, width/2-30);

  let photo = await uploadPhotoToVk(canvas.toBuffer());

  pre_send('', data.user_id, {
    attachment: 'photo'+photo.owner_id+'_'+photo.id
  });
};

exports.draw_chlen = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  const canvas = draw.createCanvas(250, 500);
  const ctx = canvas.getContext('2d');

  let color_egg = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;
  let color_body = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;
  let color_head = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;
  let color_hole = `rgb(${random.int(0,255)},${random.int(0,255)},${random.int(0,255)})`;


  let user = await User.findOne({ where: {vk_id: data.from_id} });
  let width = user.biba;
  if (width < 15) {
    return pre_send('Твоя биба слишком маленькая, я не могу ее нарисовать', data.user_id);
  }

  // рисуем тело
  ctx.fillStyle = color_body;
  ctx.beginPath();
  ctx.moveTo(70, 420);
  ctx.lineTo(60, 430-width*5);
  ctx.moveTo(70, 420);
  ctx.lineTo(113, 420);
  ctx.lineTo(120, 420-width*5);
  ctx.lineTo(60, 430-width*5);
  ctx.fill();

  // рисуем яйцо - левое
  ctx.fillStyle = color_egg;
  ctx.beginPath();
  ctx.arc(50, 450, 40, 0, Math.PI*2, true);
  ctx.fill();

  // рисуем яйцо - правое
  ctx.beginPath();
  ctx.arc(135, 450, 40, 0, Math.PI*2, true);
  ctx.fill();

  // рисуем голову
  ctx.fillStyle = color_head;
  ctx.beginPath();
  ctx.arc(85, 400-width*5, 40, 0, Math.PI*2, true);
  ctx.fill();

  //рисуем дырку
  ctx.strokeStyle = color_hole;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(85, 420-width*5);
  ctx.lineTo(85, 385-width*5);
  ctx.stroke();

  //рисуем текст с см
  ctx.font = 14+'px Impact';
  ctx.fillStyle = color_hole;
  ctx.fillText('Copyright ©', 160, 15);
  ctx.font = 20+'px Impact';
  ctx.rotate(-1.55);
  ctx.fillText(width+' см', -375, 150);

  let photo = await uploadPhotoToVk(canvas.toBuffer());
  pre_send('', data.user_id, {
    attachment: 'photo'+photo.owner_id+'_'+photo.id
  });
};

exports.goodNight = async (data) => {
  let random_audio = random.int(0, 6);
  let filename = 'good_night/all_' + random_audio;

  if (data.from_id === 171707143) filename = 'good_night/danil';
  else if (data.from_id === 133124411) filename = 'good_night/ilia';

  let audio_message = await uploadVoiceMessageToVk(data, filename);
  let vk_user = await bot.api('users.get', {user_ids: data.from_id});
  await pre_send(render('VoiceWishes/GoodNight', {user: vk_user[0], template: random.int(1, 5)}), data.user_id)
  await pre_send(null, data.user_id, {
    attachment: 'doc'+audio_message.owner_id+'_'+audio_message.id
  })
}

exports.goodMorning = async data => {
  let random_audio = random.int(0, 2);
  let filename = 'good_morning/all_' + random_audio;
  let audio_message = await uploadVoiceMessageToVk(data, filename);
  let vk_user = await bot.api('users.get', {user_ids: data.from_id});
  await pre_send(render('VoiceWishes/GoodMorning', {user: vk_user[0], template: random.int(1, 5)}), data.user_id)
  await pre_send(null, data.user_id, {
    attachment: 'doc'+audio_message.owner_id+'_'+audio_message.id
  })
}

exports.repeatMessage = async (data) => {
  if (data.check_spam) if (await User.checkSpam(data.user.id, data.user_id)) return;
  await pre_send(data.command, data.user_id);
}

exports.hello = async (data) => {
  await pre_send(render('Other/hello', {template: random.int(1, 6)}), data.user_id);
}