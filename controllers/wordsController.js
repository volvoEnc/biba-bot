const Op = Sequelize.Op;

exports.add = async data => {
    let prepareRegexp = new RegExp("^биба.(запиши|добавь|запомни)", 'gi');
    let deleteSpacesRegexp = new RegExp("\\s+", 'gi');
    let prepareData = data.command.replace(prepareRegexp, '');
    prepareData = prepareData.replace(deleteSpacesRegexp, '');

    let words = prepareData.split(',');
    let add_words = 0;
    await pre_send('Слова добавляются..', data.user_id);
    await words.forEach(async word => {
        if (word != undefined && word != '' && word.length >= 3) {
            let w = await Words.checkWord(word);
            if (w == null) {
              let res = morphy.getGramInfo(word);
              if (res[0][0] != undefined) {
                let type_word = res[0][0]['pos'];
                if (type_word != '' || type_word != undefined || type_word != null) {
                  await Words.addWord(word, type_word);
                  await pre_send("Слово: '"+word+"' было успешно добавлено", data.user_id);
                }
              }
            } else {
              await pre_send("Слово: '"+word+"' уже существует", data.user_id);
            }
        }
    });
};

exports.portrait = async data => {
    // if (data.from_id == data.user_id) return;
    let wordC = exports.randomWord(await Words.getWords('С'));
    let wordPrich = exports.randomWord(await Words.getWords('ПРИЧАСТИЕ'));
    let wordPril = exports.randomWord(await Words.getWords('П'));

    let final_arr = [wordPrich, wordPril, wordC];
    let prepare_arr = exports.typeСast(final_arr);
    let final = `${prepare_arr[0]} ${prepare_arr[1]} ${prepare_arr[2]}`;

    if (data.answer) {
        let user = (await bot.api('users.get', {user_ids: data.to_id}))[0];
        pre_send(`Я точно знаю, что [id${data.to_id}|${user.last_name} ${user.first_name}] - ${final}`, data.user_id, { disable_mentions: 1 });
    } else {
        pre_send(`Ты ${final}`, data.user_id);
    }
};

exports.portraitRouter = (data) => {
    if (data.to_id != data.from_id) {
      data.answer = true;
    }
    exports.portrait(data);
};

exports.stats = data => {
    console.log('Стата');
}

exports.randomWord = words => {
  console.log(words.length);
  let idx = random.int(1, words.length);
  return words[idx-1].word;
}

exports.typeСast = words => {
  let current = 0;
  let cast_words = [];
  let provider = morphy.getGrammemsProvider();
  provider.excludeGroups('С', 'род');
  words.forEach(word => {
    if (current != 0) {
      let res = morphy.castFormByPattern(word, words[current-1], provider, true);
      if (res[0] != undefined) {
        let w = res[0].toLowerCase();
        cast_words.push(w);
      } else {
        cast_words.push(word);
      }
    } else {
      cast_words.push(word);
    }
    current++;
  });
  return cast_words;
}
