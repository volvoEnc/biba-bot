exports.obmaterit = async (data) => {
    /** Если сообщение в лс */
    if (data.from_id === data.user_id) return;
    /** Если сообщение не является ответом на сообщение */
    if (data.to_id === data.from_id && !data.isAction) return;
    /** Если сообщение направлено на создателя */
    if (data.to_id != process.env.VK_USER_ID) return;

    let user = await bot.api('users.get', {user_ids: data.from_id});
    await pre_send(await render('Other/badWords', {template: random.int(1, 5), user: user[0]}, data), data.user_id);
}