exports.index = async (eventt) => {
  let conversation = await Conversation.findOne({where: {user_id: eventt.user_id}});
  let user = await User.findOne({where: {id: eventt.user_id}});
  let sub_biba = 0.5;
  sub_biba += (user.biba / 100) * 10;
  sub_biba = Math.round(sub_biba * 100) / 100;
  user.biba -= sub_biba;
  user.biba = user.biba > 0 ? Math.round(user.biba * 100) / 100 : 0;
  user.save();
  return pre_send(render("events", {
    eventt: "day_biba",
    template: random.int(1, 5),
    vk_user: (await bot.api('users.get', {user_ids: user.vk_id, name_case: 'gen'}))[0],
    biba: sub_biba
  }), conversation.conversation_id);
};
