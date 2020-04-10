exports.index = async (data) => {

  bot.api('users.get', {user_ids: data.to_id, name_case: 'gen'}).then(res => {
    bot.send(render('bibametr', {
      biba: random.int(0, 30),
      template: random.int(1, 4),
      first_name: res[0].first_name,
      last_name: res[0].last_name,
      id: data.to_id
    }), data.user_id)
  })
}
