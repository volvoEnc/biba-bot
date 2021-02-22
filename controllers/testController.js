exports.index = async (data) => {
  let user = await User.findOne({where: {vk_id: data.from_id}});
  await user.add_session('@catalog');
  console.log(user.session);

};

exports.mailing = async (data) => {
  let conv = await Conversation.findAll({
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('conversation_id')), 'conversation_id']
    ]
  });
  for (let cov of conv){
    await pre_send(await render('app/mailing', {}, data), cov.conversation_id);
  }
};

exports.sub = async (data) => {
  console.log(await Catalog.getProduct('ConsumablesProduct', 'LittlePowerEngineer'));
};
